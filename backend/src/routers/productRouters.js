const express = require("express");
const router = express.Router();
const multipleUpload = require("../config/multerConfig")

const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", multipleUpload, productController.createProduct);
router.put("/:id", multipleUpload, productController.updateProduct);
router.delete("/:masanpham", productController.deleteProduct);

module.exports = router;