const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const trackingRoutes = require("./routes/trackingRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", trackingRoutes);

const PORT = process.env.PORT || 8004;
app.listen(PORT, () => console.log(`Tracking service running on port ${PORT}`));

module.exports = { app, sequelize };
