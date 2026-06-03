// routes/users.js — User Service (profil, alamat, wishlist)
const router = require('express').Router();
const { mainDB } = require('../config/databases');
const { verifyToken } = require('./auth'); // reuse middleware JWT dari auth service

// ── PROFIL ──────────────────────────────────────────

// GET /api/users/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [rows] = await mainDB.query(
      'SELECT user_id, username, email, first_name, last_name, created_at FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { first_name, last_name, username } = req.body;
    await mainDB.query(
      'UPDATE users SET first_name=?, last_name=?, username=? WHERE user_id=?',
      [first_name, last_name, username, req.user.user_id]
    );
    res.json({ message: 'Profil berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ALAMAT ──────────────────────────────────────────

// GET /api/users/addresses
router.get('/addresses', verifyToken, async (req, res) => {
  try {
    const [rows] = await mainDB.query(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC',
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/addresses
router.post('/addresses', verifyToken, async (req, res) => {
  try {
    const { label, street, city, province, postal_code, is_default } = req.body;
    // Kalau is_default true, reset dulu alamat lain
    if (is_default) {
      await mainDB.query(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [req.user.user_id]
      );
    }
    const [result] = await mainDB.query(
      'INSERT INTO user_addresses (user_id, label, street, city, province, postal_code, is_default) VALUES (?,?,?,?,?,?,?)',
      [req.user.user_id, label, street, city, province, postal_code, is_default || false]
    );
    res.status(201).json({ message: 'Alamat ditambahkan', address_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/addresses/:id
router.delete('/addresses/:id', verifyToken, async (req, res) => {
  try {
    await mainDB.query(
      'DELETE FROM user_addresses WHERE address_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    res.json({ message: 'Alamat dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── WISHLIST ─────────────────────────────────────────

// GET /api/users/wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const [rows] = await mainDB.query(
      `SELECT w.wishlist_id, p.product_id, p.product_name, p.price, p.stock, w.added_at
       FROM user_wishlist w
       JOIN products p ON w.product_id = p.product_id
       WHERE w.user_id = ?`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/wishlist
router.post('/wishlist', verifyToken, async (req, res) => {
  try {
    const { product_id } = req.body;
    await mainDB.query(
      'INSERT INTO user_wishlist (user_id, product_id) VALUES (?,?)',
      [req.user.user_id, product_id]
    );
    res.status(201).json({ message: 'Produk ditambahkan ke wishlist' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Produk sudah ada di wishlist' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/wishlist/:product_id
router.delete('/wishlist/:product_id', verifyToken, async (req, res) => {
  try {
    await mainDB.query(
      'DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.user_id, req.params.product_id]
    );
    res.json({ message: 'Produk dihapus dari wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;