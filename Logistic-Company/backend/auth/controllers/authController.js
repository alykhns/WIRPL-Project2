// const User = require("../models/User");

exports.register = async (req, res) => {
  res.json({ message: "register placeholder" });
};

exports.login = async (req, res) => {
  res.json({ message: "login placeholder" });
};

exports.getProfile = async (req, res) => {
  res.json({ message: "getProfile placeholder", user: req.user || null });
};
