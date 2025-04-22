const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig")

const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:masanpham", productController.getProductById);
router.post("/", upload.array("hinhanh", 5), productController.createProduct);
router.put("/:masanpham", upload.array("hinhanh", 5), productController.updateProduct);
router.delete("/:masanpham", productController.deleteProduct);

module.exports = router;