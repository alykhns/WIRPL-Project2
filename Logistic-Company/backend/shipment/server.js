const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const shipmentRoutes = require("./routes/shipmentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", shipmentRoutes);

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => console.log(`Shipment service running on port ${PORT}`));

module.exports = { app, sequelize };
