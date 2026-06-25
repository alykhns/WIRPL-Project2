// const TrackingLog = require("../models/TrackingLog");

exports.updateStatus = async (req, res) => {
  res.json({ message: "tracking updateStatus placeholder" });
};

exports.getByResi = async (req, res) => {
  res.json({ message: "tracking getByResi placeholder", resi: req.params.resi });
};
