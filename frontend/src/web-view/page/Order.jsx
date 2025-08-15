// Orders.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../authentication/axiosInstance";
import Cookies from "js-cookie";
import moment from "moment";
import "../style/Order.scss";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FormControl, TextField } from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL;
const orderUrl = apiUrl + "/orders";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [infoUser, setInfoUser] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            return navigate("/login");
        }
        try {
            setInfoUser(jwtDecode(token) || {});
        } catch {
            toast.error("Lỗi xác thực");
        }
    }, []);

    useEffect(() => {
        if (infoUser?.manguoidung) {
            fetchOrders(infoUser.manguoidung);
        }
    }, [infoUser]);

    const fetchOrders = async (manguoidung) => {
        try {
            const res = await axiosInstance.get(`${orderUrl}/khachhang/${manguoidung}`);
            console.log("first", res);
            setOrders(res.data.DT || []);
        } catch {
            toast.error("Không thể tải danh sách đơn hàng");
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div className="order-history container">
            <h1 className="text-center my-4">Lịch sử đơn hàng</h1>
            {orders.length === 0 ? (
                <p className="text-center text-muted">Bạn chưa có đơn hàng nào</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Ngày đặt</th>
                                <th>Địa chỉ giao</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o, idx) => (
                                <tr key={o.madonhang}>
                                    <td>{idx + 1}</td>
                                    <td>{moment(o.thoigiandat).format("HH:mm DD/MM/YYYY")}</td>
                                    <td>{o.diachigiaohang}</td>
                                    <td>
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(o.tongtien)}
                                    </td>
                                    <td className={`status-${o.trangthai}`}>
                                        {o.trangthai === "choxacnhan" && "Chờ xác nhận"}
                                        {o.trangthai === "danggiao" && "Đang giao"}
                                        {o.trangthai === "dagiao" && "Đã giao"}
                                        {o.trangthai === "huy" && "Đã hủy"}
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-secondary" onClick={() => handleViewDetails(o)}>
                                            <i className="fa-regular fa-eye"></i> Xem
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal chi tiết đơn */}
            {selectedOrder && (
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết đơn #{selectedOrder.madonhang}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl fullWidth margin="dense">
                            <TextField label="Ngày đặt" value={moment(selectedOrder.thoigiandat).format("HH:mm DD/MM/YYYY")} InputProps={{ readOnly: true }} />
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <TextField label="Địa chỉ giao" value={selectedOrder.diachigiaohang} InputProps={{ readOnly: true }} />
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <TextField label="Tổng tiền" value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedOrder.tongtien)} InputProps={{ readOnly: true }} />
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <TextField label="Trạng thái" value={selectedOrder.trangthai} InputProps={{ readOnly: true }} />
                        </FormControl>

                        <h5 className="mt-4">Sản phẩm</h5>
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.chitiet?.length > 0 ? (
                                    selectedOrder.chitiet.map((sp, i) => (
                                        <tr key={i}>
                                            <td>{sp.tensanpham}</td>
                                            <td>{sp.soluong}</td>
                                            <td>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(sp.dongia)}</td>
                                            <td>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(sp.thanhtien)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">Không có sản phẩm</td>
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
