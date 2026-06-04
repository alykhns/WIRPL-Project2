const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { mainDB } = require("../config/databases");

function missingFields(body, fields) {
  return fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token tidak ada" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "rahasia_apapun_bebas");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token tidak valid atau kadaluarsa" });
  }
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;
    const missing = missingFields(req.body, ["username", "email", "password"]);
    if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await mainDB.query(
      "INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashed, first_name || null, last_name || null]
    );
    res.status(201).json({ message: "Registrasi berhasil", user_id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Username atau email sudah terdaftar" });
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const missing = missingFields(req.body, ["email", "password"]);
    if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });

    const [rows] = await mainDB.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Email tidak ditemukan" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET || "rahasia_apapun_bebas",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/verify", verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
