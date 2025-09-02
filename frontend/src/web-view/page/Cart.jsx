import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axiosInstance from "../../authentication/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import "../style/Cart.scss";

const apiUrl = process.env.REACT_APP_API_URL;
const imgURL = process.env.REACT_APP_IMG_URL;

function Cart() {
    const [infoUser, setInfoUser] = useState({});
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                if (decodedToken) {
                    setInfoUser(decodedToken);
                    fetchCartItems(decodedToken.manguoidung);
                }
            } catch (error) {
                console.error("Error decoding JWT:", error);
            }
        }
    }, []);

    const fetchCartItems = async (manguoidung) => {
        try {
            const response = await axiosInstance.get(`${apiUrl}/cart/${manguoidung}`);
            console.log("response", response)
            if (response.data.EC === 1) {
                const updatedItems = response.data.DT.map((item) => ({
                    ...item,
                    soluong: item.soluong || 1,
                }));
                setCartItems(updatedItems);
                calculateSubTotal(updatedItems);
                calculateTotalQuantity(updatedItems);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const handleCheckout = async () => {
        if (!infoUser.hoten || !infoUser.sodienthoai || !infoUser.diachi) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!!!");
            return;
        }
        if (cartItems.length === 0) {
            toast.warning("Giỏ hàng của bạn đang trống.");
            return;
        }

        try {
            const orderData = {
                manguoidung: infoUser.manguoidung,
                diachigiaohang: infoUser.diachi,
                tongtien: subTotal,
                ghichu: null, // hoặc bạn có thể lấy từ input ghi chú nếu muốn
                sanpham: cartItems.map(item => ({
                    masanpham: item.masanpham,
                    soluong: item.soluong,
                    dongia: item.giasaugiam,
                    hinhanh: item.hinhanhchinh,
                    mau: item.mau,
                }))
            };

            const response = await axiosInstance.post(`${apiUrl}/orders`, orderData);
            console.log(response);
            if (response.data.success) {
                await axiosInstance.post(`${apiUrl}/cart/delete`, { manguoidung: infoUser.manguoidung });
                toast.success("Đặt hàng thành công!");
                setCartItems([]);
                setTotalQuantity(0);
                setSubTotal(0);
            } else {
                toast.error(`Đặt hàng thất bại: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        }
    };

    const handleDelete = async (magiohang, masanpham) => {
        await axiosInstance.delete(`${apiUrl}/cart/${magiohang}/${masanpham}`);
        toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
        fetchCartItems(infoUser.manguoidung);
    };

    const calculateSubTotal = (items) => {
        setSubTotal(items.reduce((sum, item) => sum + item.giasaugiam * item.soluong, 0));
    };

    const calculateTotalQuantity = (items) => {
        setTotalQuantity(items.reduce((sum, item) => sum + item.soluong, 0));
    };

    const handleIncrease = (masanpham) => {
        const updatedItems = cartItems.map((item) => {
            if (item.masanpham === masanpham) {
                // Kiểm tra nếu số lượng hiện tại đã đạt tồn kho
                if (item.soluong >= item.soluongton) {
                    // Có thể hiện thông báo lỗi hoặc toast
                    toast.warn(`Không đủ số lượng!`);
                    return item; // Không tăng số lượng
                }
                return { ...item, soluong: item.soluong + 1 };
            }
            return item;
        });

        setCartItems(updatedItems);
        calculateSubTotal(updatedItems);
        calculateTotalQuantity(updatedItems);
    };


    const handleDecrease = (masanpham) => {
        const updatedItems = cartItems.map((item) =>
            item.masanpham === masanpham && item.soluong > 1
                ? { ...item, soluong: item.soluong - 1 }
                : item
        );
        setCartItems(updatedItems);
        calculateSubTotal(updatedItems);
        calculateTotalQuantity(updatedItems);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInfoUser(prev => ({ ...prev, [name]: value }));
    };
    console.log("cartItems", cartItems)
    return (
        <div className="cart-container container py-3">
            <h2 className="cart-title text-center mb-4">🛒 Giỏ Hàng</h2>
            <div className="row">
                {/* Danh sách sản phẩm */}
                <div className={cartItems.length > 0 ? "col-lg-8" : "col-12"}>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={`${item.magiohang}-${item.masanpham}`} className="cart-item card shadow-sm mb-3">
                                <div className="row g-0 align-items-center">
                                    <div className="col-md-3 text-center">
                                        <img
                                            src={`${imgURL}/${item.hinhanhchinh}`}
                                            alt={item.tensanpham}
                                            className="img-fluid rounded"
                                        />
                                    </div>
                                    <div className="col-md-9">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <h5 className="card-title">{item.tensanpham}</h5>
                                                <button
                                                    className="btn-remove"
                                                    onClick={() => handleDelete(item.magiohang, item.masanpham)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                            <span className="gia-goc">
                                                {parseFloat(item.giaban).toLocaleString()}<u>đ</u>
                                            </span>
                                            <span className="gia-sau-giam">
                                                {parseFloat(item.giasaugiam).toLocaleString()}<u>đ</u>
                                            </span>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="quantity-control">
                                                    <button onClick={() => handleDecrease(item.masanpham)}>-</button>
                                                    <span>{item.soluong}</span>
                                                    <button onClick={() => handleIncrease(item.masanpham)}>+</button>
                                                </div>
                                                <p className="fw-bold text-danger mb-0">
                                                    {(item.giasaugiam * item.soluong).toLocaleString()}<u>đ</u>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-cart text-center py-5">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                                alt="Giỏ hàng trống"
                                className="empty-cart-img mb-3"
                                style={{ width: "150px", opacity: 0.7 }}
                            />
                            <h5>Giỏ hàng của bạn đang trống</h5>
                            <Link to="/" className="btn btn-outline-primary mt-3">
                                ⬅ Tiếp tục mua sắm
                            </Link>
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div div className="col-lg-4">
                        <div className="card p-3 shadow-sm">
                            <h4 className="text-center mb-3">Tóm tắt đơn hàng</h4>
                            <p><strong>Số lượng sản phẩm:</strong> {totalQuantity}</p>
                            <p><strong>Tổng cộng:</strong> <span className="text-danger">{subTotal.toLocaleString()} đ</span></p>
                            <button
                                className="btn btn-success w-100 mt-3"
                                onClick={() =>
                                    navigate("/checkout", {
                                        state: { cartItems, infoUser, subTotal, totalQuantity }
                                    })
                                }
                            >
                                Thanh Toán
                            </button>
                            <Link to="/" className="btn btn-outline-primary w-100 mt-2">⬅ Tiếp tục mua sắm</Link>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Cart;
