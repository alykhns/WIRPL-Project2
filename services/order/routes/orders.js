const router = require("express").Router();
const { mainDB, paymentDB, logisticsDB } = require("../config/databases");

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function missingFields(body, fields) {
  return fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
}

router.get("/", async (_req, res) => {
  try {
    const [orders] = await mainDB.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [orders] = await mainDB.query(
      `SELECT o.*, u.username, u.email
       FROM orders o
       JOIN users u ON o.buyer_id = u.user_id
       WHERE o.order_id = ?`,
      [req.params.id]
    );
    if (!orders.length) return res.status(404).json({ error: "Order tidak ditemukan" });

    const [items] = await mainDB.query(
      `SELECT oi.*, p.product_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    const [payment] = await paymentDB.query(
      `SELECT pt.*, pm.method_name, pm.provider
       FROM payment_transactions pt
       JOIN payment_methods pm ON pt.method_id = pm.method_id
       WHERE pt.order_id = ?`,
      [req.params.id]
    );
    const [shipment] = await logisticsDB.query(
      `SELECT s.*, c.courier_name, c.service_type
       FROM shipments s
       JOIN couriers c ON s.courier_id = c.courier_id
       WHERE s.order_id = ?`,
      [req.params.id]
    );

    res.json({
      order: orders[0],
      items,
      payment: payment[0] || null,
      shipment: shipment[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/checkout", async (req, res) => {
  const missing = missingFields(req.body, ["buyer_id", "total_amount", "items", "payment_method_id", "courier_id"]);
  if (missing.length) return badRequest(res, `Missing required fields: ${missing.join(", ")}`);
  if (!Array.isArray(req.body.items) || req.body.items.length === 0) return badRequest(res, "items harus berupa array dan tidak boleh kosong");

  const buyerId = Number(req.body.buyer_id);
  const institutionId = req.body.institution_id ? Number(req.body.institution_id) : null;
  const paymentMethodId = Number(req.body.payment_method_id);
  const courierId = Number(req.body.courier_id);
  const totalAmount = Number(req.body.total_amount);

  if (!Number.isFinite(buyerId) || buyerId <= 0) return badRequest(res, "buyer_id tidak valid");
  if (!Number.isFinite(paymentMethodId) || paymentMethodId <= 0) return badRequest(res, "payment_method_id tidak valid");
  if (!Number.isFinite(courierId) || courierId <= 0) return badRequest(res, "courier_id tidak valid");
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) return badRequest(res, "total_amount harus lebih dari 0");

  for (const [index, item] of req.body.items.entries()) {
    const itemMissing = missingFields(item, ["product_id", "quantity", "price"]);
    if (itemMissing.length) return badRequest(res, `Item ${index + 1} missing fields: ${itemMissing.join(", ")}`);
    if (Number(item.quantity) <= 0) return badRequest(res, `Item ${index + 1} quantity harus lebih dari 0`);
    if (Number(item.price) < 0) return badRequest(res, `Item ${index + 1} price tidak boleh negatif`);
  }

  const calculatedTotal = req.body.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0);
  if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
    return badRequest(res, "total_amount tidak sama dengan total item");
  }

  const mainConn = await mainDB.getConnection();
  const paymentConn = await paymentDB.getConnection();
  const logisticsConn = await logisticsDB.getConnection();

  try {
    await mainConn.beginTransaction();
    await paymentConn.beginTransaction();
    await logisticsConn.beginTransaction();

    const [[buyer]] = await mainConn.query("SELECT user_id FROM users WHERE user_id = ?", [buyerId]);
    if (!buyer) throw new Error("Buyer tidak ditemukan");

    if (institutionId) {
      const [[institution]] = await mainConn.query("SELECT institution_id FROM fintech_institutions WHERE institution_id = ?", [institutionId]);
      if (!institution) throw new Error("Institution tidak ditemukan");
    }

    const [[method]] = await paymentConn.query("SELECT method_id FROM payment_methods WHERE method_id = ? AND is_active = TRUE", [paymentMethodId]);
    if (!method) throw new Error("Payment method tidak ditemukan atau tidak aktif");

    const [[courier]] = await logisticsConn.query("SELECT courier_id FROM couriers WHERE courier_id = ? AND is_active = TRUE", [courierId]);
    if (!courier) throw new Error("Courier tidak ditemukan atau tidak aktif");

    const [orderResult] = await mainConn.query(
      "INSERT INTO orders (buyer_id, institution_id, total_amount, order_status) VALUES (?, ?, ?, ?)",
      [buyerId, institutionId, totalAmount, "order"]
    );
    const orderId = orderResult.insertId;

    for (const item of req.body.items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      const [[product]] = await mainConn.query("SELECT stock FROM products WHERE product_id = ? FOR UPDATE", [productId]);
      if (!product) throw new Error(`Product ${productId} tidak ditemukan`);
      if (Number(product.stock) < quantity) throw new Error(`Stock product ${productId} tidak cukup`);

      await mainConn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
        [orderId, productId, quantity, price]
      );
      await mainConn.query("UPDATE products SET stock = stock - ? WHERE product_id = ?", [quantity, productId]);
    }

    await paymentConn.query(
      "INSERT INTO payment_transactions (order_id, method_id, amount, status) VALUES (?, ?, ?, ?)",
      [orderId, paymentMethodId, totalAmount, "pending"]
    );

    const trackingNumber = `LMR-${Date.now()}`;
    const [shipmentResult] = await logisticsConn.query(
      `INSERT INTO shipments
       (order_id, courier_id, tracking_number, shipping_status, destination_address)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, courierId, trackingNumber, "preparing", req.body.destination_address || null]
    );
    await logisticsConn.query(
      "INSERT INTO tracking_history (shipment_id, location, status_note) VALUES (?, ?, ?)",
      [shipmentResult.insertId, "Warehouse", "Pesanan sedang disiapkan"]
    );

    await logisticsConn.commit();
    await paymentConn.commit();
    await mainConn.commit();

    res.status(201).json({
      message: "Checkout berhasil!",
      order_id: orderId,
      tracking_number: trackingNumber
    });
  } catch (err) {
    await logisticsConn.rollback();
    await paymentConn.rollback();
    await mainConn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    logisticsConn.release();
    paymentConn.release();
    mainConn.release();
  }
});

module.exports = router;
