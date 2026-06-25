const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", webhookRoutes);

const PORT = process.env.PORT || 8005;
app.listen(PORT, () => console.log(`Webhook service running on port ${PORT}`));

module.exports = { app, sequelize };
