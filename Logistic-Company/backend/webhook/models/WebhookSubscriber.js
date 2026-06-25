const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WebhookSubscriber = sequelize.define("WebhookSubscriber", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  callbackUrl: { type: DataTypes.STRING, allowNull: false },
  apiKey: { type: DataTypes.STRING, allowNull: false },
});

module.exports = WebhookSubscriber;
