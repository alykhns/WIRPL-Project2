require("dotenv").config();
const cors = require("cors");
const express = require("express");

const productsRouter = require("./routes/products");

const app = express();
const PORT = Number(process.env.PRODUCT_PORT || 3002);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "product", status: "ok" });
});

app.use("/products", productsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Product route not found" });
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});
