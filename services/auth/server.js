require("dotenv").config();
const cors = require("cors");
const express = require("express");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

const app = express();
const PORT = Number(process.env.AUTH_PORT || 3001);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "auth", status: "ok" });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Auth route not found" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
