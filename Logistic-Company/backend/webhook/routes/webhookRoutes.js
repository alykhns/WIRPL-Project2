const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

router.post("/register", webhookController.register);
router.get("/list", webhookController.list);
router.post("/notify", webhookController.notify);

module.exports = router;
