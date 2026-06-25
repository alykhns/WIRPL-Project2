const Shipment = require("../models/Shipment");
const crypto = require("crypto");

exports.create = async (req, res) => {
  try {
    const {
      orderId,
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      weight,
      serviceType,
    } = req.body;

    const resi = "AWB-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const newShipment = await Shipment.create({
      resi,
      orderId,
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      weight,
      serviceType,
    });

    res.status(201).json({
      message: "Shipment created successfully",
      shipment: newShipment,
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const shipments = await Shipment.findAll();
    res.json(shipments);
  } catch (error) {
    console.error("Error getting shipments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.json(shipment);
  } catch (error) {
    console.error("Error getting shipment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.assignCourier = async (req, res) => {
  try {
    const { courierId } = req.body;
    const shipment = await Shipment.findByPk(req.params.id);
    
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    shipment.courierId = courierId;
    shipment.status = "PICKED_UP";
    await shipment.save();

    res.json({
      message: "Courier assigned successfully",
      shipment,
    });
  } catch (error) {
    console.error("Error assigning courier:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
