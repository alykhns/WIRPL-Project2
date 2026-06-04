const router = require("express").Router();
const { mainDB } = require("../config/databases");

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

router.get("/", async (req, res) => {
  try {
    const { search, min_price, max_price, in_stock } = req.query;
    const filters = [];
    const params = [];

    if (search) {
      filters.push("(product_name LIKE ? OR description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (min_price) {
      filters.push("price >= ?");
      params.push(Number(min_price));
    }
    if (max_price) {
      filters.push("price <= ?");
      params.push(Number(max_price));
    }
    if (in_stock === "true") {
      filters.push("stock > 0");
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const [rows] = await mainDB.query(`SELECT * FROM products ${where} ORDER BY created_at DESC`, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await mainDB.query("SELECT * FROM products WHERE product_id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { product_name, description, price, stock } = req.body;
    if (!product_name) return badRequest(res, "product_name wajib diisi");
    if (price === undefined || Number(price) < 0) return badRequest(res, "price tidak valid");
    if (stock !== undefined && Number(stock) < 0) return badRequest(res, "stock tidak boleh negatif");

    const [result] = await mainDB.query(
      "INSERT INTO products (product_name, description, price, stock) VALUES (?, ?, ?, ?)",
      [product_name, description || null, Number(price), Number(stock || 0)]
    );
    res.status(201).json({ message: "Produk ditambahkan", product_id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { product_name, description, price, stock } = req.body;
    if (price !== undefined && Number(price) < 0) return badRequest(res, "price tidak valid");
    if (stock !== undefined && Number(stock) < 0) return badRequest(res, "stock tidak boleh negatif");

    const [result] = await mainDB.query(
      `UPDATE products
       SET product_name = COALESCE(?, product_name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           stock = COALESCE(?, stock)
       WHERE product_id = ?`,
      [
        product_name || null,
        description || null,
        price === undefined ? null : Number(price),
        stock === undefined ? null : Number(stock),
        req.params.id
      ]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ message: "Produk diupdate" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await mainDB.query("DELETE FROM products WHERE product_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ message: "Produk dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
