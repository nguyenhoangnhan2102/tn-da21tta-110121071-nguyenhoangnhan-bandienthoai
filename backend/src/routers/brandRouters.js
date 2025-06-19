const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");

router.get("/", brandController.getAllBrand);
router.post("/", brandController.createBrand); // OK
router.put("/:mathuonghieu", brandController.updateBrand);
router.delete("/:mathuonghieu", brandController.deleteBrand);

module.exports = router;
