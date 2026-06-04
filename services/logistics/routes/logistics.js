const router = require("express").Router();
const { logisticsDB, mainDB } = require("../config/databases");

const VALID_STATUSES = new Set(["preparing", "picked_up", "in_transit", "delivered", "returned"]);

router.get("/couriers", async (_req, res) => {
  try {
    const [rows] = await logisticsDB.query("SELECT * FROM couriers WHERE is_active = TRUE");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/track/:tracking_number", async (req, res) => {
  try {
    const [rows] = await logisticsDB.query(
      `SELECT s.*, c.courier_name, c.service_type
       FROM shipments s
       JOIN couriers c ON s.courier_id = c.courier_id
       WHERE s.tracking_number = ?`,
      [req.params.tracking_number]
    );
    if (!rows.length) return res.status(404).json({ error: "Tracking tidak ditemukan" });

    const [history] = await logisticsDB.query(
      "SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY recorded_at DESC",
      [rows[0].shipment_id]
    );
    res.json({ shipment: rows[0], history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/shipments/:order_id/status", async (req, res) => {
  const { status, location, note } = req.body;
  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: "Status pengiriman tidak valid" });
  }

  const logisticsConn = await logisticsDB.getConnection();
  const mainConn = await mainDB.getConnection();

  try {
    await logisticsConn.beginTransaction();
    await mainConn.beginTransaction();

    const [[shipment]] = await logisticsConn.query(
      "SELECT shipment_id FROM shipments WHERE order_id = ?",
      [req.params.order_id]
    );
    if (!shipment) {
      await logisticsConn.rollback();
      await mainConn.rollback();
      return res.status(404).json({ error: "Shipment tidak ditemukan" });
    }

    await logisticsConn.query(
      `UPDATE shipments
       SET shipping_status = ?, actual_delivery = IF(? = "delivered", NOW(), actual_delivery)
       WHERE order_id = ?`,
      [status, status, req.params.order_id]
    );
    await logisticsConn.query(
      "INSERT INTO tracking_history (shipment_id, location, status_note) VALUES (?, ?, ?)",
      [shipment.shipment_id, location || "Warehouse", note || `Status pengiriman: ${status}`]
    );

    const orderStatus = status === "returned" ? "return" : "delivery";
    await mainConn.query("UPDATE orders SET order_status = ? WHERE order_id = ?", [orderStatus, req.params.order_id]);

    await mainConn.commit();
    await logisticsConn.commit();

    res.json({ message: "Status pengiriman diupdate" });
  } catch (err) {
    await mainConn.rollback();
    await logisticsConn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    mainConn.release();
    logisticsConn.release();
  }
});

module.exports = router;
