const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");

router.post("/:resi/status", trackingController.updateStatus);
router.get("/:resi", trackingController.getByResi);

module.exports = router;
