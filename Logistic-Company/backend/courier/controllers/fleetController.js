// const Fleet = require("../models/Fleet");

exports.getAll = async (req, res) => {
  res.json({ message: "fleet getAll placeholder" });
};

exports.getById = async (req, res) => {
  res.json({ message: "fleet getById placeholder", id: req.params.id });
};

exports.create = async (req, res) => {
  res.json({ message: "fleet create placeholder" });
};

exports.update = async (req, res) => {
  res.json({ message: "fleet update placeholder", id: req.params.id });
};

exports.delete = async (req, res) => {
  res.json({ message: "fleet delete placeholder", id: req.params.id });
};
