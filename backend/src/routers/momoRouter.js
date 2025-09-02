const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();

const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
const redirectUrl = "http://localhost:3000/momo-return";
const ipnUrl = "http://localhost:3002/api/momo/ipn"; // backend callback

// Tạo URL thanh toán MoMo
router.post("/create_payment_url", async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        const requestId = partnerCode + new Date().getTime();
        const orderInfo = "Thanh toán MoMo cho đơn hàng " + orderId;
        const requestType = "payWithMethod";
        const extraData = "";
        const momoOrderId = orderId + "_" + Date.now();

        // 🔑 raw signature đúng format MoMo
        const rawSignature =
            "accessKey=" + accessKey +
            "&amount=" + amount +
            "&extraData=" + extraData +
            "&ipnUrl=" + ipnUrl +
            "&orderId=" + momoOrderId +   // 👈 gửi orderId unique cho MoMo
            "&orderInfo=" + orderInfo +
            "&partnerCode=" + partnerCode +
            "&redirectUrl=" + redirectUrl +
            "&requestId=" + requestId +
            "&requestType=" + requestType;

        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId: momoOrderId,   // 👈 sửa lại ở đây
            orderInfo,
            redirectUrl,
            ipnUrl,
            extraData,
            requestType,
            signature,
            lang: "en",
        };

        // Gọi MoMo API
        const response = await axios.post(endpoint, requestBody, {
            headers: { "Content-Type": "application/json" },
        });

        return res.json(response.data);
    } catch (error) {
        console.error("MoMo error:", error.response?.data || error.message);
        res.status(500).json({ error: "Tạo URL thanh toán MoMo thất bại" });
    }
});

// IPN callback từ MoMo (server to server)
router.post("/ipn", async (req, res) => {
    const data = req.body;
    console.log("MoMo IPN:", data);

    const { orderId, resultCode } = req.body;
    const madonhang = orderId.split("_")[0];

    try {
        if (resultCode === 0) {
            await connection.query(
                `UPDATE THANHTOAN SET trangthai = 'dathanhtoan', ngaythanhtoan = NOW() WHERE madonhang = ?`,
                [madonhang]
            );
            await connection.query(
                `UPDATE DONHANG SET trangthai = 'hoanthanh' WHERE madonhang = ?`,
                [madonhang]
            );
            return res.status(200).json({ message: "Cập nhật đơn hàng thành công" });
        } else {
            // ❌ Thanh toán thất bại → có thể update đơn hàng thành hủy
            await connection.query(
                `UPDATE DONHANG SET trangthai = 'huy', lydohuy = 'Thanh toán MoMo thất bại' WHERE madonhang = ?`,
                [orderId]
            );
            return res.status(200).json({ message: "Cập nhật đơn hàng thất bại" });
        }
    } catch (error) {
        console.error("MoMo IPN error:", error.message);
        res.status(500).json({ error: "Lỗi xử lý IPN" });
    }
});


module.exports = router;
