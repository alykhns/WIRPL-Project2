const router = require("express").Router();
const { supplierDB } = require("../config/databases");

function missingFields(body, fields) {
  return fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
}

router.get("/", async (_req, res) => {
  try {
    const [rows] = await supplierDB.query("SELECT * FROM suppliers WHERE is_active = TRUE ORDER BY supplier_name ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/purchase-orders/list", async (_req, res) => {
  try {
    const [rows] = await supplierDB.query(
      `SELECT po.*, s.supplier_name
       FROM purchase_orders po
       JOIN suppliers s ON po.supplier_id = s.supplier_id
       ORDER BY po.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await supplierDB.query("SELECT * FROM suppliers WHERE supplier_id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Supplier tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/products", async (req, res) => {
  try {
    const [rows] = await supplierDB.query(
      `SELECT sp.*, s.supplier_name
       FROM supplier_products sp
       JOIN suppliers s ON sp.supplier_id = s.supplier_id
       WHERE sp.supplier_id = ?
       ORDER BY sp.sp_id DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/purchase-order", async (req, res) => {
  const missing = missingFields(req.body, ["supplier_id", "items"]);
  if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
  if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
    return res.status(400).json({ error: "items harus berupa array dan tidak boleh kosong" });
  }

  for (const [index, item] of req.body.items.entries()) {
    const itemMissing = missingFields(item, ["product_ref_id", "quantity", "unit_price"]);
    if (itemMissing.length) return res.status(400).json({ error: `Item ${index + 1} missing fields: ${itemMissing.join(", ")}` });
    if (Number(item.quantity) <= 0) return res.status(400).json({ error: `Item ${index + 1} quantity harus lebih dari 0` });
    if (Number(item.unit_price) < 0) return res.status(400).json({ error: `Item ${index + 1} unit_price tidak boleh negatif` });
  }

  const conn = await supplierDB.getConnection();

  try {
    await conn.beginTransaction();

    const [[supplier]] = await conn.query("SELECT supplier_id FROM suppliers WHERE supplier_id = ? AND is_active = TRUE", [req.body.supplier_id]);
    if (!supplier) throw new Error("Supplier tidak ditemukan atau tidak aktif");

    const total = req.body.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0);
    const [po] = await conn.query(
      "INSERT INTO purchase_orders (supplier_id, total_amount, expected_delivery, notes) VALUES (?, ?, ?, ?)",
      [req.body.supplier_id, total, req.body.expected_delivery || null, req.body.notes || null]
    );

    for (const item of req.body.items) {
      await conn.query(
        "INSERT INTO po_items (po_id, product_ref_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [po.insertId, item.product_ref_id, Number(item.quantity), Number(item.unit_price)]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Purchase Order dibuat", po_id: po.insertId, total_amount: total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
