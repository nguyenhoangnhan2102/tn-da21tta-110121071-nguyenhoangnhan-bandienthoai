const express = require("express");
const router = express.Router();
const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");

router.post("/create_payment_url", (req, res) => {
    const { amount, orderId } = req.body;

    const vnp_TmnCode = "2QXUI4J4";
    const vnp_HashSecret = "SECRETKEYTEST";
    const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const vnp_ReturnUrl = "http://localhost:3000/vnpay_return";

    let vnp_TxnRef = orderId || new Date().getTime();
    let vnp_OrderInfo = "Thanh toan don hang test";
    let vnp_OrderType = "other";
    let vnp_Amount = amount * 100; // VNPay yêu cầu số tiền nhân 100
    let vnp_Locale = "vn";
    let vnp_IpAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: vnp_TmnCode,
        vnp_Locale: vnp_Locale,
        vnp_CurrCode: "VND",
        vnp_TxnRef: vnp_TxnRef,
        vnp_OrderInfo: vnp_OrderInfo,
        vnp_OrderType: vnp_OrderType,
        vnp_Amount: vnp_Amount,
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_IpAddr: vnp_IpAddr,
        vnp_CreateDate: moment().format("YYYYMMDDHHmmss"),
    };

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    const paymentUrl = vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });

    return res.json({ payUrl: paymentUrl });
});

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = obj[decodeURIComponent(str[key])];
    }
    return sorted;
}

module.exports = router;
