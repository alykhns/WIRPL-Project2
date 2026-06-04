const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
require("dotenv").config();

const baseConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || process.env.DB_MAIN_USER || "root",
  password: process.env.DB_PASSWORD ?? process.env.DB_MAIN_PASSWORD ?? "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
};

const mainDB = mysql.createPool({
  ...baseConfig,
  database: process.env.DB_MAIN_NAME || "lumiere_tenant_1"
});

const paymentDB = mysql.createPool({
  ...baseConfig,
  database: process.env.DB_PAYMENT_NAME || "lumiere_payment"
});

const logisticsDB = mysql.createPool({
  ...baseConfig,
  database: process.env.DB_LOGISTICS_NAME || "lumiere_logistics"
});

module.exports = { mainDB, paymentDB, logisticsDB };
