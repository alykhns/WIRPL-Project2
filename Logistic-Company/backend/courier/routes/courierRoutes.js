const express = require("express");
const router = express.Router();
const courierController = require("../controllers/courierController");

router.get("/", courierController.getAll);
router.get("/:id", courierController.getById);
router.post("/", courierController.create);
router.put("/:id", courierController.update);
router.delete("/:id", courierController.delete);

module.exports = router;
