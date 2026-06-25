const WebhookSubscriber = require("../models/WebhookSubscriber");
const { notifyAll } = require("../services/webhookService");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { companyName, callbackUrl } = req.body;

    if (!companyName || !callbackUrl) {
      return res.status(400).json({ message: "Company name and callback URL required" });
    }

    const apiKey = crypto.randomBytes(32).toString("hex");

    const subscriber = await WebhookSubscriber.create({
      companyName,
      callbackUrl,
      apiKey,
    });

    res.status(201).json({
      message: "Webhook registered successfully",
      apiKey: subscriber.apiKey,
      subscriber: {
        id: subscriber.id,
        companyName: subscriber.companyName,
        callbackUrl: subscriber.callbackUrl,
      },
    });
  } catch (error) {
    console.error("Error registering webhook:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const subscribers = await WebhookSubscriber.findAll({
      attributes: ["id", "companyName", "callbackUrl"],
    });
    res.json(subscribers);
  } catch (error) {
    console.error("Error getting subscribers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.notify = async (req, res) => {
  try {
    const { resi, status, description, timestamp } = req.body;
    
    // In a real scenario, this would only be called by the tracking service via an internal network.
    // For now, we trust the caller.

    const payload = await notifyAll(resi, status);
    
    res.json({
      message: "Broadcast initiated",
      payload,
    });
  } catch (error) {
    console.error("Error initiating broadcast:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.validateApiKey = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return res.status(401).json({ message: "No API key provided" });

    const subscriber = await WebhookSubscriber.findOne({ where: { apiKey } });
    if (!subscriber) return res.status(401).json({ message: "Invalid API key" });

    res.json({ valid: true, partner: subscriber.companyName });
  } catch (error) {
    console.error("Error validating API key:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
