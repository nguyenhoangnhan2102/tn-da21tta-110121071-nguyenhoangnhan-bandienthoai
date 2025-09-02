const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();

const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor";
const redirectUrl = "http://localhost:3000/momo-return";
const ipnUrl = "http://localhost:3002/api/momo/ipn"; // callback backend

// Tạo URL thanh toán
router.post("/create_payment_url", async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        const requestId = orderId + new Date().getTime();
        const orderInfo = "Thanh toán MoMo cho đơn hàng " + orderId;
        const requestType = "captureMoMoWallet";

        const rawSignature =
            "partnerCode=" +
            partnerCode +
            "&accessKey=" +
            accessKey +
            "&requestId=" +
            requestId +
            "&amount=" +
            amount +
            "&orderId=" +
            orderId +
            "&orderInfo=" +
            orderInfo +
            "&returnUrl=" +
            redirectUrl +
            "&notifyUrl=" +
            ipnUrl +
            "&extraData=";

        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            returnUrl: redirectUrl,
            notifyUrl: ipnUrl,
            extraData: "",
            requestType,
            signature,
        };

        const response = await axios.post(endpoint, requestBody);

        return res.json(response.data);
    } catch (error) {
        console.error("MoMo error:", error);
        res.status(500).json({ error: "Tạo URL thanh toán MoMo thất bại" });
    }
});

// IPN callback từ MoMo (server to server)
router.post("/ipn", (req, res) => {
    console.log("MoMo IPN:", req.body);
    // TODO: update trạng thái THANHTOAN thành "dathanhtoan" nếu resultCode === 0
    res.status(200).json({ message: "IPN received" });
});

module.exports = router;
