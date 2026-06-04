require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const services = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  product: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
  order: process.env.ORDER_SERVICE_URL || "http://localhost:3003",
  payment: process.env.PAYMENT_SERVICE_URL || "http://localhost:3004",
  logistics: process.env.LOGISTICS_SERVICE_URL || "http://localhost:3005",
  supplier: process.env.SUPPLIER_SERVICE_URL || "http://localhost:3006"
};

app.use(cors());

function prefixPath(prefix) {
  return (path) => {
    if (path === "/" || path === "") return prefix;
    return `${prefix}${path}`;
  };
}

function proxy(target, prefix) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: prefixPath(prefix),
    on: {
      error: (err, _req, res) => {
        res.status(502).json({ error: err.message });
      }
    }
  });
}

app.get("/health", (_req, res) => {
  res.json({ status: "Gateway running", services });
});

app.use("/api/auth", proxy(services.auth, "/auth"));
app.use("/api/users", proxy(services.auth, "/users"));
app.use("/api/products", proxy(services.product, "/products"));
app.use("/api/orders", proxy(services.order, "/orders"));
app.use("/api/payment", proxy(services.payment, "/payment"));
app.use("/api/payments", proxy(services.payment, "/payment"));
app.use("/api/logistics", proxy(services.logistics, "/logistics"));
app.use("/api/supplier", proxy(services.supplier, "/supplier"));

app.use((_req, res) => {
  res.status(404).json({ error: "Gateway route not found" });
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
