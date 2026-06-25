// const Shipment = require("../models/Shipment");

exports.create = async (req, res) => {
  res.json({ message: "shipment create placeholder" });
};

exports.getAll = async (req, res) => {
  res.json({ message: "shipment getAll placeholder" });
};

exports.getById = async (req, res) => {
  res.json({ message: "shipment getById placeholder", id: req.params.id });
};

exports.assignCourier = async (req, res) => {
  res.json({ message: "shipment assignCourier placeholder", id: req.params.id });
};
