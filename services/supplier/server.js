require("dotenv").config();
const cors = require("cors");
const express = require("express");

const supplierRouter = require("./routes/supplier");

const app = express();
const PORT = Number(process.env.SUPPLIER_PORT || 3006);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "supplier", status: "ok" });
});

app.use("/supplier", supplierRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Supplier route not found" });
});

app.listen(PORT, () => {
  console.log(`Supplier service running on port ${PORT}`);
});
