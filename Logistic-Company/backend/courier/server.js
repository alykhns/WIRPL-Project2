const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const courierRoutes = require("./routes/courierRoutes");
const fleetRoutes = require("./routes/fleetRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/couriers", courierRoutes);
app.use("/fleets", fleetRoutes);

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`Courier service running on port ${PORT}`));

module.exports = { app, sequelize };
