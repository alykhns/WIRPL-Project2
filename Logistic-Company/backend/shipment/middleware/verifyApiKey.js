module.exports = async function verifyApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API key missing" });
  }

  try {
    const response = await fetch("http://localhost:8005/webhook/validate", {
      headers: { "x-api-key": apiKey }
    });

    if (!response.ok) {
      return res.status(401).json({ message: "Invalid API Key" });
    }

    const data = await response.json();
    req.partner = data.partner;
    next();
  } catch (error) {
    console.error("Error validating API key:", error);
    return res.status(500).json({ message: "Error validating API key" });
  }
};
