const express = require("express");
const router = express.Router();
const multer = require("../config/multerConfig")

const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:masanpham", productController.getProductById);
router.post("/", multer.array('hinhanh', 5), productController.createProduct);
router.put("/:masanpham", multer.array('hinhanh', 5), productController.updateProduct);
router.delete("/:masanpham", productController.deleteProduct);

module.exports = router;