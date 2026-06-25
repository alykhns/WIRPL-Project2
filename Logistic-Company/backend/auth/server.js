const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");

// Import models to ensure they are registered with Sequelize
require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", authRoutes);

const PORT = process.env.PORT || 8001;

sequelize.sync()
  .then(() => {
    console.log("Auth database & tables synced successfully.");
    app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Unable to sync Auth database:", error);
  });

module.exports = { app, sequelize };

