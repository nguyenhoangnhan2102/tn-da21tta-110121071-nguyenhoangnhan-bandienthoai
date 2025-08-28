const express = require("express");
const router = express.Router();
const statisticalController = require("../controllers/statisticalController");

router.get("/day", statisticalController.RevenueByDay);
router.get("/month", statisticalController.RevenueByMonth);
router.get("/year", statisticalController.RevenueByYear);

router.get("/top10-products", statisticalController.Top10Products);
router.get("/status", statisticalController.OrderStatusSummary);

module.exports = router;
