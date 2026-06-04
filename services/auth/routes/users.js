const router = require("express").Router();
const { mainDB } = require("../config/databases");
const { verifyToken } = require("./auth");

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [rows] = await mainDB.query(
      "SELECT user_id, username, email, first_name, last_name, created_at FROM users WHERE user_id = ?",
      [req.user.user_id]
    );
    if (!rows.length) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { first_name, last_name, username } = req.body;
    const [result] = await mainDB.query(
      "UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), username = COALESCE(?, username) WHERE user_id = ?",
      [first_name || null, last_name || null, username || null, req.user.user_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ message: "Profil berhasil diupdate" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Username sudah digunakan" });
    res.status(500).json({ error: err.message });
  }
});

router.get("/addresses", verifyToken, async (req, res) => {
  try {
    const [rows] = await mainDB.query(
      "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, address_id DESC",
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/addresses", verifyToken, async (req, res) => {
  try {
    const { label, street, city, province, postal_code, is_default } = req.body;
    if (!street) return res.status(400).json({ error: "street wajib diisi" });

    if (is_default) {
      await mainDB.query("UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?", [req.user.user_id]);
    }

    const [result] = await mainDB.query(
      "INSERT INTO user_addresses (user_id, label, street, city, province, postal_code, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.user.user_id, label || "Rumah", street, city || null, province || null, postal_code || null, Boolean(is_default)]
    );
    res.status(201).json({ message: "Alamat ditambahkan", address_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/addresses/:id", verifyToken, async (req, res) => {
  try {
    const [result] = await mainDB.query(
      "DELETE FROM user_addresses WHERE address_id = ? AND user_id = ?",
      [req.params.id, req.user.user_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Alamat tidak ditemukan" });
    res.json({ message: "Alamat dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/wishlist", verifyToken, async (req, res) => {
  try {
    const [rows] = await mainDB.query(
      `SELECT w.wishlist_id, p.product_id, p.product_name, p.price, p.stock, w.added_at
       FROM user_wishlist w
       JOIN products p ON w.product_id = p.product_id
       WHERE w.user_id = ?
       ORDER BY w.added_at DESC`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/wishlist", verifyToken, async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: "product_id wajib diisi" });

    await mainDB.query("INSERT INTO user_wishlist (user_id, product_id) VALUES (?, ?)", [req.user.user_id, product_id]);
    res.status(201).json({ message: "Produk ditambahkan ke wishlist" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Produk sudah ada di wishlist" });
    res.status(500).json({ error: err.message });
  }
});

router.delete("/wishlist/:product_id", verifyToken, async (req, res) => {
  try {
    const [result] = await mainDB.query(
      "DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?",
      [req.user.user_id, req.params.product_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Produk wishlist tidak ditemukan" });
    res.json({ message: "Produk dihapus dari wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
