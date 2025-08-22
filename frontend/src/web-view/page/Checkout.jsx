import React, { useState } from "react";
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { toast } from "react-toastify";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../authentication/axiosInstance";
import "../style/Checkout.scss";

const apiUrl = process.env.REACT_APP_API_URL;

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
        paymentMethod: "cod", // mặc định Thanh toán khi nhận hàng
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

            const response = await axiosInstance.post(`${apiUrl}/orders`, orderData);

            if (response.data.success) {
                toast.success("Đặt hàng thành công!");
                navigate("/"); // quay về trang chủ
            } else {
                toast.error(`Đặt hàng thất bại: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Có lỗi xảy ra khi đặt hàng!");
        }
    };

    if (!cartItems) {
        return <p className="text-center mt-4">Không có dữ liệu đơn hàng.</p>;
    }

    return (
        <div className="checkout-container">
            <h2 className="text-center mb-4">🧾 Thanh Toán Đơn Hàng</h2>
            <div className="row">
                {/* Thông tin người mua */}
                <div>
                    <div>
                        {cartItems.map(item => (
                            <div key={item.masanpham} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={`${process.env.REACT_APP_IMG_URL}/${item.hinhanhchinh}`}
                                        alt={item.tensanpham}
                                        style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                                    />
                                    <span>{item.tensanpham} (x{item.soluong})</span>
                                </div>
                                <span>{(item.giasaugiam * item.soluong).toLocaleString()} đ</span>
                            </div>
                        ))}
                    </div>
                    <div className="card p-3 shadow-sm mb-3">
                        <h4>Thông tin người mua</h4>
                        <TextField fullWidth margin="normal" label="Họ tên" name="hoten" value={orderInfo.hoten} onChange={handleChange} />
                        <TextField fullWidth margin="normal" label="Số điện thoại" name="sodienthoai" value={orderInfo.sodienthoai} onChange={handleChange} />
                        <TextField fullWidth margin="normal" label="Địa chỉ" name="diachi" value={orderInfo.diachi} onChange={handleChange} multiline rows={2} />
                        <TextField fullWidth margin="normal" label="Ghi chú" name="ghichu" value={orderInfo.ghichu} onChange={handleChange} multiline rows={2} />
                    </div>
                    <div className="card p-3 shadow-sm mb-3">
                        <h4>Phương thức thanh toán</h4>
                        <FormControl>
                            <FormLabel>Chọn phương thức</FormLabel>
                            <RadioGroup
                                value={orderInfo.paymentMethod}
                                onChange={(e) => setOrderInfo({ ...orderInfo, paymentMethod: e.target.value })}
                            >
                                <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                                <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản ngân hàng" />
                                <FormControlLabel value="momo" control={<Radio />} label="Ví MoMo" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>

                {/* Thông tin đơn hàng */}
                <div>
                    <div className="card p-3 shadow-sm">
                        <h4>Tóm tắt đơn hàng</h4>
                        {cartItems.map(item => (
                            <div key={item.masanpham} className="d-flex justify-content-between border-bottom py-2">
                                <span>{item.tensanpham} (x{item.soluong})</span>
                                <span>{(item.giasaugiam * item.soluong).toLocaleString()} đ</span>
                            </div>
                        ))}
                        <p className="mt-3"><strong>Tổng số lượng:</strong> {totalQuantity}</p>
                        <p><strong>Tổng tiền:</strong> <span className="text-danger">{subTotal.toLocaleString()} đ</span></p>
                        <button className="btn btn-success w-100" onClick={handleSubmit}>Xác nhận đặt hàng</button>
                        <Link to="/cart" className="btn btn-outline-primary w-100 mt-2">⬅ Quay lại giỏ hàng</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
