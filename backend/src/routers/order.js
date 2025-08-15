
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getAllOrders);
router.get("/:madonhang", orderController.getOrderDetails);
router.get("/khachhang/:manguoidung", orderController.getAllOrdersByCustomer);
router.post("/", orderController.confirmOrder);
router.put("/:madonhang", orderController.updateOrders);

module.exports = router;