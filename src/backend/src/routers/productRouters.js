// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const uploadMultiple = require("../config/multerConfig");

router.get("/", productController.getAllProduct);

router.get("/:masanpham", productController.getDetailProduct);

router.post("/", productController.createProduct);

router.put("/:masanpham", productController.updateProduct);

router.delete("/:masanpham", productController.deleteProduct);

router.put("/:masanpham/trangthai", productController.updateStatusProduct);

router.get("/best-selling-products", productController.bestSellingProducts)

module.exports = router;
