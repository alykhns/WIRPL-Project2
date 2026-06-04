require("dotenv").config();
const cors = require("cors");
const express = require("express");

const paymentRouter = require("./routes/payment");

const app = express();
const PORT = Number(process.env.PAYMENT_PORT || 3004);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "payment", status: "ok" });
});

app.use("/payment", paymentRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Payment route not found" });
});

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
