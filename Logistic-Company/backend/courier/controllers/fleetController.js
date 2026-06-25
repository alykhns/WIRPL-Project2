const Fleet = require("../models/Fleet");

exports.getAll = async (req, res) => {
  try {
    const fleets = await Fleet.findAll();
    res.json(fleets);
  } catch (error) {
    console.error("Error in fleet getAll:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const fleet = await Fleet.findByPk(req.params.id);
    if (!fleet) {
      return res.status(404).json({ message: "Fleet not found" });
    }
    res.json(fleet);
  } catch (error) {
    console.error("Error in fleet getById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { plateNumber, type, status } = req.body;

    if (!plateNumber) {
      return res.status(400).json({ message: "Fleet plate number is required" });
    }

    const fleet = await Fleet.create({
      plateNumber,
      type,
      status: status || "available",
    });

    res.status(201).json({
      message: "Fleet created successfully",
      fleet,
    });
  } catch (error) {
    console.error("Error in fleet create:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { plateNumber, type, status } = req.body;
    const fleet = await Fleet.findByPk(req.params.id);

    if (!fleet) {
      return res.status(404).json({ message: "Fleet not found" });
    }

    if (plateNumber !== undefined) fleet.plateNumber = plateNumber;
    if (type !== undefined) fleet.type = type;
    if (status !== undefined) fleet.status = status;

    await fleet.save();

    res.json({
      message: "Fleet updated successfully",
      fleet,
    });
  } catch (error) {
    console.error("Error in fleet update:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const fleet = await Fleet.findByPk(req.params.id);
    if (!fleet) {
      return res.status(404).json({ message: "Fleet not found" });
    }

    await fleet.destroy();

    res.json({
      message: "Fleet deleted successfully",
    });
  } catch (error) {
    console.error("Error in fleet delete:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

