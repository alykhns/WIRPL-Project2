const router = require("express").Router();
const { paymentDB, mainDB } = require("../config/databases");

router.get("/methods", async (_req, res) => {
  try {
    const [rows] = await paymentDB.query("SELECT * FROM payment_methods WHERE is_active = TRUE");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:order_id", async (req, res) => {
  try {
    const [rows] = await paymentDB.query(
      `SELECT pt.*, pm.method_name, pm.provider
       FROM payment_transactions pt
       JOIN payment_methods pm ON pt.method_id = pm.method_id
       WHERE pt.order_id = ?`,
      [req.params.order_id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:transaction_id/confirm", async (req, res) => {
  const paymentConn = await paymentDB.getConnection();
  const mainConn = await mainDB.getConnection();

  try {
    await paymentConn.beginTransaction();
    await mainConn.beginTransaction();

    const [result] = await paymentConn.query(
      `UPDATE payment_transactions
       SET status = "success", external_ref = COALESCE(?, external_ref), paid_at = NOW()
       WHERE transaction_id = ?`,
      [req.body.external_ref || null, req.params.transaction_id]
    );
    if (result.affectedRows === 0) {
      await paymentConn.rollback();
      await mainConn.rollback();
      return res.status(404).json({ error: "Transaksi pembayaran tidak ditemukan" });
    }

    const [[payment]] = await paymentConn.query(
      "SELECT * FROM payment_transactions WHERE transaction_id = ?",
      [req.params.transaction_id]
    );
    await mainConn.query("UPDATE orders SET order_status = ? WHERE order_id = ?", ["pay", payment.order_id]);

    await mainConn.commit();
    await paymentConn.commit();

    res.json({ message: "Pembayaran dikonfirmasi", payment });
  } catch (err) {
    await mainConn.rollback();
    await paymentConn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    mainConn.release();
    paymentConn.release();
  }
});

module.exports = router;
