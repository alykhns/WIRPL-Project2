const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TrackingLog = sequelize.define("TrackingLog", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  resi: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = TrackingLog;
