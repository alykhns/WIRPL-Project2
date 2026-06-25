module.exports = function verifyApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API key missing" });
  }

  // TODO: validate apiKey against registered e-commerce keys
  req.apiKey = apiKey;
  next();
};
