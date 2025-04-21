const express = require("express");
const router = express.Router();

const capacityController = require("../controllers/capacityController");

router.get("/", capacityController.getAllCapacity);
router.post("/", capacityController.createCapacity);
router.put("/:madungluong", capacityController.updateCapacity);
router.delete("/:madungluong", capacityController.deleteCapacity);


module.exports = router;