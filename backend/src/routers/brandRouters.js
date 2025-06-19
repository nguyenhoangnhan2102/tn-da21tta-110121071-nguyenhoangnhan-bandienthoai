const express = require("express");
const router = express.Router();

const brandController = require("../controllers/brandController");

router.get("/", brandController.getAllBrand);
router.post("/", uploadSingle("logo"), brandController.createBrand); // upload logo tại đây
router.put("/:mathuonghieu", brandController.updateBrand);
router.delete("/:mathuonghieu", brandController.deleteBrand);


module.exports = router;