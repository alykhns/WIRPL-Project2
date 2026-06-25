const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Courier = sequelize.define("Courier", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  vehicleId: { type: DataTypes.INTEGER },
  status: {
    type: DataTypes.ENUM("available", "on_delivery", "off"),
    defaultValue: "available",
  },
});

module.exports = Courier;
