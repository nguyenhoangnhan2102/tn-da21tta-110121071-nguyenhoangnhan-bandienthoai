const express = require("express");
const router = express.Router();

const colorController = require("../controllers/colorController");

router.get("/", colorController.getAllColor);
router.post("/", colorController.createColor);
router.put("/:mamau", colorController.updateColor);
router.delete("/:mamau", colorController.deleteColor);


module.exports = router;