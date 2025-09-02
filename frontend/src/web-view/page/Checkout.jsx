import React, { useState } from "react";
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { toast } from "react-toastify";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../authentication/axiosInstance";
import "../style/Checkout.scss";

const apiUrl = process.env.REACT_APP_API_URL;
const imgURL = process.env.REACT_APP_IMG_URL;

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Nhận dữ liệu từ giỏ hàng (truyền khi click Thanh toán)
    const { cartItems, infoUser, subTotal, totalQuantity } = location.state || {};

    const [orderInfo, setOrderInfo] = useState({
        hoten: infoUser?.hoten || "",
        sodienthoai: infoUser?.sodienthoai || "",
        diachi: infoUser?.diachi || "",
        ghichu: "",
        paymentMethod: "home",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!orderInfo.hoten || !orderInfo.sodienthoai || !orderInfo.diachi) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            if (orderInfo.paymentMethod === "momo") {
                const res = await axiosInstance.post(`${apiUrl}/momo/create_payment_url`, {
                    amount: subTotal.toString(),
                    orderId: new Date().getTime().toString(),
                });
                if (res.data && res.data.payUrl) {
                    window.location.href = res.data.payUrl; // chuyển hướng sang MoMo
                } else {
                    toast.error("Không tạo được link MoMo!");
                }
            } else {
                // Thanh toán COD
                const orderData = {
                    manguoidung: infoUser?.manguoidung,
                    diachigiaohang: orderInfo.diachi,
                    tongtien: subTotal,
                    ghichu: orderInfo.ghichu,
                    hinhthucthanhtoan: orderInfo.paymentMethod,
                    sanpham: cartItems.map(item => ({
                        masanpham: item.masanpham,
                        soluong: item.soluong,
                        dongia: item.giasaugiam,
                        hinhanh: item.hinhanhchinh
                    }))
                };
                await axiosInstance.post(`${apiUrl}/orders`, orderData);
                toast.success("Đặt hàng thành công!");
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi đặt hàng!");
        }
    };


    if (!cartItems) {
        return <p className="text-center mt-4">Không có dữ liệu đơn hàng.</p>;
    }
    console.log("cartItems", cartItems)
    return (
        <div className="checkout-container">
            <h2 className="text-center mb-4">🧾 Thanh Toán Đơn Hàng</h2>
            <div className="row">
                {/* BÊN TRÁI */}
                <div>
                    {/* Danh sách sản phẩm */}
                    <div className="card p-3 shadow-sm mb-3">
                        <h4>Sản phẩm</h4>
                        {cartItems.map(item => (
                            <div key={item.masanpham} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={`${imgURL}/${item.hinhanhchinh}`}
                                        alt={item.tensanpham}
                                        style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "10px" }}
                                    />

                                    <div>
                                        <div>{item.tensanpham} (x{item.soluong})</div>
                                        <div>Màu:<strong> {item.mau}</strong></div>
                                    </div>
                                </div>
                                <span>{(item.giasaugiam * item.soluong).toLocaleString()} đ</span>
                            </div>
                        ))}
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="card p-3 shadow-sm mb-3">
                        <h4>Phương thức thanh toán</h4>
                        <FormControl>
                            <FormLabel>Chọn phương thức</FormLabel>
                            <RadioGroup
                                value={orderInfo.paymentMethod}
                                onChange={(e) => setOrderInfo({ ...orderInfo, paymentMethod: e.target.value })}
                            >
                                <FormControlLabel value="home" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                                <FormControlLabel value="momo" control={<Radio />} label="Ví MoMo" />
                            </RadioGroup>
                        </FormControl>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div className="card p-3 shadow-sm card-summary">
                        <h4>Tóm tắt đơn hàng</h4>
                        <p className="mt-2"><strong>Tổng số lượng:</strong> {totalQuantity}</p>
                        <p><strong>Tổng tiền:</strong> <span className="text-danger">{subTotal.toLocaleString()} đ</span></p>
                        <div className="d-flex gap-2 mt-2">
                            <Link to="/cart" className="btn btn-outline-primary w-100">⬅ Quay lại giỏ hàng</Link>
                            <button className="btn btn-success w-100" onClick={handleSubmit}>Xác nhận đặt hàng</button>
                        </div>
                    </div>
                </div>

                {/* BÊN PHẢI */}
                <div>
                    <div className="card p-3 shadow-sm">
                        <h4>Thông tin người mua</h4>
                        <TextField fullWidth margin="normal" label="Họ tên" name="hoten" value={orderInfo.hoten} onChange={handleChange} />
                        <TextField fullWidth margin="normal" label="Số điện thoại" name="sodienthoai" value={orderInfo.sodienthoai} onChange={handleChange} />
                        <TextField fullWidth margin="normal" label="Địa chỉ" name="diachi" value={orderInfo.diachi} onChange={handleChange} multiline rows={2} />
                        <TextField fullWidth margin="normal" label="Ghi chú" name="ghichu" value={orderInfo.ghichu} onChange={handleChange} multiline rows={2} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Checkout;
