const express = require("express");
const cors = require("cors");
const { registerProxies } = require("./routes");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/health", (req, res) => res.json({ status: "ok", service: "gateway" }));

registerProxies(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));
