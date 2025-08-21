const express = require("express");
const router = express.Router();
const statisticalController = require("../controllers/statisticalController");

// Doanh thu theo ngày / tháng / năm
router.get("/revenue/time", statisticalController.revenueByTime);

// Doanh thu theo sản phẩm
router.get("/revenue/product", statisticalController.revenueByProduct);

// Doanh thu theo thương hiệu
router.get("/revenue/brand", statisticalController.revenueByBrand);

// Doanh thu theo khách hàng
router.get("/revenue/customer", statisticalController.revenueByCustomer);

// Doanh thu theo hình thức thanh toán
router.get("/revenue/payment", statisticalController.revenueByPayment);

module.exports = router;
