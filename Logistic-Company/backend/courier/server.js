const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const courierRoutes = require("./routes/courierRoutes");
const fleetRoutes = require("./routes/fleetRoutes");

// Import models to ensure they are registered with Sequelize
require("./models/Courier");
require("./models/Fleet");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/couriers", courierRoutes);
app.use("/fleets", fleetRoutes);

const PORT = process.env.PORT || 8002;

sequelize.sync()
  .then(() => {
    console.log("Courier database & tables synced successfully.");
    app.listen(PORT, () => console.log(`Courier service running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Unable to sync Courier database:", error);
  });

module.exports = { app, sequelize };

