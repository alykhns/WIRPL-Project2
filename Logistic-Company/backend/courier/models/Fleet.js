const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fleet = sequelize.define("Fleet", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  plateNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.STRING },
  status: {
    type: DataTypes.ENUM("available", "in_use"),
    defaultValue: "available",
  },
});

module.exports = Fleet;
