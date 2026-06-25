const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");
const verifyApiKey = require("../middleware/verifyApiKey");

router.post("/", verifyApiKey, shipmentController.create);
router.get("/", shipmentController.getAll);
router.get("/:id", shipmentController.getById);
router.patch("/:id/assign-courier", shipmentController.assignCourier);

module.exports = router;
