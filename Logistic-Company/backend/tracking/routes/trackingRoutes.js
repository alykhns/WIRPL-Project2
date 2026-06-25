const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");

router.post("/update", trackingController.updateStatus);
router.get("/track/:resi", trackingController.getByResi);

module.exports = router;
