import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../authentication/axiosInstance";
import Cookies from "js-cookie";
import moment from "moment";
import "../style/Order.scss";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {
    Typography,
    Box,
    FormControl,
    TextField,
    FormLabel,
} from "@mui/material"; // Ensure these are imported

const apiUrl = process.env.REACT_APP_API_URL;
const orderUrl = apiUrl + "/orders";
const imgURL = process.env.REACT_APP_IMG_URL;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [infoUser, setInfoUser] = useState({});
    const [selectedOrder, setSelectedOrder] = useState({});
    const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            toast.error("Vui lòng đăng nhập");
            setLoading(false);
            return navigate("/login");
        }

        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                setInfoUser(decodedToken || {});
            } catch (error) {
                console.error("Error decoding JWT:", error);
                setError("Lỗi xác thực người dùng");
                setLoading(false);
            }
        } else {
            console.log("No Access Token found in Cookie");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (infoUser?.manguoidung) {
            fetchOrders(infoUser.manguoidung);
        }
    }, [infoUser]);


    const fetchOrders = async (manguoidung) => {
        try {
            const response = await axiosInstance.get(`${orderUrl}/khachhang/${manguoidung}`);
            setOrders(response.data.DT || []);
            setLoading(false);
        } catch (err) {
            setError("Không thể tải danh sách hóa đơn");
            setLoading(false);
            toast.error("Có lỗi xảy ra khi tải hóa đơn");
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order); // Lưu thông tin đơn hàng được chọn
        setShowModal(true); // Hiển thị modal
    };


    console.log("selectedOrder", selectedOrder.chitiet);

    // if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div>
            {orders.length === 0 ? (
                <p>Không có đơn hàng nào</p>
            ) : (
                <div className="order-history container">
                    <h1 className="text-center my-4">Lịch sử đơn hàng</h1>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-dark">
                                <tr className="table-title" style={{ color: "black" }}>
                                    <th scope="col">STT</th>
                                    <th scope="col">Họ Tên</th>
                                    <th scope="col">Số điện thoại</th>
                                    <th scope="col">Địa chỉ giao hàng</th>
                                    <th scope="col">Ngày lập</th>
                                    <th scope="col">Tổng tiền</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.madonhang}>
                                        <td>{index + 1}</td>
                                        <td>{order.hotenkhachhang}</td>
                                        <td>{order.sdtkhachhang}</td>
                                        <td>{order.diachigiaohang}</td>
                                        <td>{moment(order.ngaydat).utcOffset(12 * 60).format("HH:mm:ss DD/MM/YYYY")}</td>
                                        <td>
                                            {order.tongtien
                                                ? new Intl.NumberFormat("vi-VN", { currency: "VND" }).format(order.tongtien)
                                                : "Không có"}đ
                                        </td>
                                        <td
                                            className={
                                                order.trangthaidonhang === 0
                                                    ? "text-warning"
                                                    : order.trangthaidonhang === 1
                                                        ? "text-success"
                                                        : "text-danger"
                                            }
                                        >
                                            {order.trangthaidonhang === 0
                                                ? "Đang giao hàng"
                                                : order.trangthaidonhang === 1
                                                    ? "Đã giao"
                                                    : "Hủy"}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <i className="fa-regular fa-eye"></i> Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết đơn hàng{selectedOrder.madonhang}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                madonhang="product-text-field"
                                value={selectedOrder.hotenkhachhang}
                                label="Họ tên"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: '10px',
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                madonhang="product-text-field"
                                value={selectedOrder.sdtkhachhang}
                                label="Số điện thoại"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: '10px',
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                madonhang="product-text-field"
                                value={selectedOrder.diachigiaohang}
                                label="Địa chỉ giao hàng"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: '10px',
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                madonhang="product-text-field"
                                value={moment(selectedOrder.ngaydat).format("HH:mm:ss DD/MM/YYYY")}
                                label="Ngày đặt"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: '10px',
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                madonhang="product-text-field"
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.tongtien)}
                                label="Tổng tiền"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: '10px',
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                madonhang="product-text-field"
                                value={selectedOrder.trangthaidonhang === 0 ? "Đang giao hàng" : selectedOrder.trangthaidonhang === 1 ? "Đã giao" : "Hủy"}
                                label="Trạng thái"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: '10px',
                                    },
                                }}
                            />
                        </FormControl>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }} className="table table-hover">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Tên sản phẩm</th>
                                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Số lượng</th>
                                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Giá</th>
                                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Tổng tiền</th>
                                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Màu</th>
                                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Hình ảnh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.chitiet && selectedOrder.chitiet.length > 0 ? (
                                    selectedOrder.chitiet.map((product, index) => (
                                        <tr key={index}>
                                            <td
                                                style={{
                                                    padding: '8px',
                                                    borderBottom: '1px solid #ddd',
                                                    maxWidth: '200px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer'
                                                }}
                                                title={product.tensanpham}
                                            >
                                                {product.tensanpham}
                                            </td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{product.soluong}</td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaban)}
                                            </td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                                {/* Tính tổng tiền */}
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.soluong * product.giatien)}
                                            </td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{product.mau}</td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }} >
                                                <img
                                                    width="70px"
                                                    height="70px"
                                                    src={`${imgURL}${product.mausachinhanh}`}
                                                    alt={product.tensanpham || "Hình ảnh sản phẩm"}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                                            Không có sản phẩm trong đơn hàng
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default Orders;
