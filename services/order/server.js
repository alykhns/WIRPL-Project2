require("dotenv").config();
const cors = require("cors");
const express = require("express");

const ordersRouter = require("./routes/orders");

const app = express();
const PORT = Number(process.env.ORDER_PORT || 3003);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "order", status: "ok" });
});

app.use("/orders", ordersRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Order route not found" });
});

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
