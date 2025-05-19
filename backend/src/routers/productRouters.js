const express = require("express");
const router = express.Router();
const multipleUpload = require("../config/multerConfig")

const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
// router.post("/", multer.array('hinhanh', 5), productController.createProduct);
router.post("/", multipleUpload, productController.createProduct);
router.put("/:masanpham", multipleUpload, productController.updateProduct);
router.delete("/:masanpham", productController.deleteProduct);

module.exports = router;