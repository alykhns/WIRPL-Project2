// const Courier = require("../models/Courier");

exports.getAll = async (req, res) => {
  res.json({ message: "courier getAll placeholder" });
};

exports.getById = async (req, res) => {
  res.json({ message: "courier getById placeholder", id: req.params.id });
};

exports.create = async (req, res) => {
  res.json({ message: "courier create placeholder" });
};

exports.update = async (req, res) => {
  res.json({ message: "courier update placeholder", id: req.params.id });
};

exports.delete = async (req, res) => {
  res.json({ message: "courier delete placeholder", id: req.params.id });
};
