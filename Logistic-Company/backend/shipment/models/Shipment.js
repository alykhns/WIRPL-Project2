const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Shipment = sequelize.define("Shipment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  resi: { type: DataTypes.STRING, allowNull: false, unique: true },
  orderId: { type: DataTypes.INTEGER },
  courierId: { type: DataTypes.INTEGER },
  senderName: { type: DataTypes.STRING },
  senderAddress: { type: DataTypes.TEXT },
  receiverName: { type: DataTypes.STRING },
  receiverAddress: { type: DataTypes.TEXT },
  weight: { type: DataTypes.FLOAT },
  serviceType: {
    type: DataTypes.ENUM("REGULAR", "EXPRESS"),
    defaultValue: "REGULAR",
  },
  status: {
    type: DataTypes.ENUM("WAITING_PICKUP", "PICKED_UP", "IN_TRANSIT", "DELIVERED"),
    defaultValue: "WAITING_PICKUP",
  },
});

module.exports = Shipment;
