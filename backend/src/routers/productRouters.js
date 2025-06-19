const express = require("express");
const router = express.Router();
const { uploadMultiple } = require("../config/multerConfig")

const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", uploadMultiple, productController.createProduct);
router.put("/:id", uploadMultiple, productController.updateProduct);
router.delete("/:masanpham", productController.deleteProduct);

module.exports = router;