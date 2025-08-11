
const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/manufacturerController");

router.get("/", manufacturerController.getAllManufacturer);

router.post("/", manufacturerController.createManufacture);

router.put("/:mathuonghieu", manufacturerController.updateManufacture);

router.delete("/:mathuonghieu", manufacturerController.deleteManufacture);

module.exports = router;