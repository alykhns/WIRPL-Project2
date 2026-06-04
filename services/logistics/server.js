require("dotenv").config();
const cors = require("cors");
const express = require("express");

const logisticsRouter = require("./routes/logistics");

const app = express();
const PORT = Number(process.env.LOGISTICS_PORT || 3005);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "logistics", status: "ok" });
});

app.use("/logistics", logisticsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Logistics route not found" });
});

app.listen(PORT, () => {
  console.log(`Logistics service running on port ${PORT}`);
});
