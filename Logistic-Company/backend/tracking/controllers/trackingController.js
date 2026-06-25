const TrackingLog = require("../models/TrackingLog");

exports.updateStatus = async (req, res) => {
  try {
    const { resi } = req.params;
    const { status, description } = req.body;

    const newLog = await TrackingLog.create({
      resi,
      status,
      description,
    });

    // Fire-and-forget call to webhook service to broadcast notification
    fetch("http://localhost:8005/webhook/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resi,
        status,
        description,
        timestamp: newLog.timestamp,
      }),
    }).catch(err => console.error("Failed to trigger webhook broadcast:", err));

    res.status(201).json({
      message: "Tracking status updated successfully",
      log: newLog,
    });
  } catch (error) {
    console.error("Error updating tracking status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getByResi = async (req, res) => {
  try {
    const { resi } = req.params;
    const logs = await TrackingLog.findAll({
      where: { resi },
      order: [["timestamp", "DESC"]],
    });

    if (!logs.length) {
      return res.status(404).json({ message: "No tracking logs found for this resi" });
    }

    res.json(logs);
  } catch (error) {
    console.error("Error fetching tracking logs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
