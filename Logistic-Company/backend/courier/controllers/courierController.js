const Courier = require("../models/Courier");

exports.getAll = async (req, res) => {
  try {
    const couriers = await Courier.findAll();
    res.json(couriers);
  } catch (error) {
    console.error("Error in courier getAll:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const courier = await Courier.findByPk(req.params.id);
    if (!courier) {
      return res.status(404).json({ message: "Courier not found" });
    }
    res.json(courier);
  } catch (error) {
    console.error("Error in courier getById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, phone, vehicleId, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Courier name is required" });
    }

    const courier = await Courier.create({
      name,
      phone,
      vehicleId,
      status: status || "available",
    });

    res.status(201).json({
      message: "Courier created successfully",
      courier,
    });
  } catch (error) {
    console.error("Error in courier create:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, phone, vehicleId, status } = req.body;
    const courier = await Courier.findByPk(req.params.id);

    if (!courier) {
      return res.status(404).json({ message: "Courier not found" });
    }

    if (name !== undefined) courier.name = name;
    if (phone !== undefined) courier.phone = phone;
    if (vehicleId !== undefined) courier.vehicleId = vehicleId;
    if (status !== undefined) courier.status = status;

    await courier.save();

    res.json({
      message: "Courier updated successfully",
      courier,
    });
  } catch (error) {
    console.error("Error in courier update:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const courier = await Courier.findByPk(req.params.id);
    if (!courier) {
      return res.status(404).json({ message: "Courier not found" });
    }

    await courier.destroy();

    res.json({
      message: "Courier deleted successfully",
    });
  } catch (error) {
    console.error("Error in courier delete:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

