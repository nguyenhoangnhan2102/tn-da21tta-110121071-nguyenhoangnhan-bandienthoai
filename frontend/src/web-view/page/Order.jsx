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
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from "@mui/material";
import { cancelOrder } from "../../services/orderService";
import CommentModal from "../../admin-view/modal/comment-modal";

const apiUrl = process.env.REACT_APP_API_URL;
const orderUrl = apiUrl + "/orders";
const imgURL = process.env.REACT_APP_IMG_URL;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [infoUser, setInfoUser] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const handleOpenCommentModal = (product) => {
        setSelectedProduct(product);
        setShowCommentModal(true);
    };

    const handleCloseCommentModal = () => {
        setSelectedProduct(null);
        setShowCommentModal(false);
    };

    const handleConfirmCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Vui lòng nhập lý do hủy");
            return;
        }
        try {
            const res = await cancelOrder(orderToCancel.madonhang, cancelReason);
            if (res.EC === 0) {
                toast.success(res.EM);
                fetchOrders(infoUser.manguoidung);
                handleCloseCancelModal();
            } else {
                toast.error(res.EM);
            }
        } catch {
            toast.error("Có lỗi khi hủy đơn hàng!");
        }
    };

    const handleOpenCancelModal = (order) => {
        setOrderToCancel(order);
        setCancelReason("");
        setOpenCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        setOpenCancelModal(false);
        setOrderToCancel(null);
    };


    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const trangThaiMapping = {
        choxacnhan: "Chờ xác nhận",
        danggiao: "Đang giao",
        dagiao: "Đã giao",
        huy: "Đã hủy",
        hoanthanh: "Hoàn thành"
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
                                        {o.trangthai === "hoanthanh" && "Hoàn thành"}
                                    </td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-sm btn-secondary" onClick={() => handleViewDetails(o)}>
                                            <i className="fa-regular fa-eye"></i> Xem
                                        </button>
                                        {o.trangthai !== "huy" && (
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleOpenCancelModal(o)}
                                            >
                                                <i className="fa-solid fa-xmark"></i> Hủy
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal chi tiết đơn */}
            {selectedOrder && (
                <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
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
                            <TextField
                                label="Trạng thái"
                                value={trangThaiMapping[selectedOrder.trangthai] || selectedOrder.trangthai}
                                InputProps={{ readOnly: true }}
                            />
                        </FormControl>

                        <h5 className="mt-4">Sản phẩm</h5>
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Màu</th>
                                    <th>Dung lượng</th>
                                    <th>RAM</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                    <th>Đánh giá</th>
                                </tr>
                            </thead>
                            {console.log("selectedOrder", selectedOrder)}
                            <tbody>
                                {selectedOrder.chitiet?.length > 0 ? (
                                    selectedOrder.chitiet.map((sp, i) => (
                                        <tr key={i}>
                                            <td>
                                                <img
                                                    src={`${imgURL}${sp.hinhanh}`}
                                                    alt={sp.tensanpham}
                                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                />
                                            </td>
                                            <td>{sp.tensanpham}</td>
                                            <td>{sp.mau}</td>
                                            <td>{sp.dungluong}</td>
                                            <td>{sp.ram}</td>
                                            <td>{sp.soluong}</td>
                                            <td>
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND"
                                                }).format(sp.dongia)}
                                            </td>
                                            <td>
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND"
                                                }).format(sp.thanhtien)}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleOpenCommentModal(sp)}
                                                >
                                                    <i className="fa-regular fa-comment"></i> Đánh giá
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">Không có sản phẩm</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Modal.Body>
                </Modal>
            )}
            <Dialog open={openCancelModal} onClose={handleCloseCancelModal} maxWidth="sm" fullWidth>
                <DialogTitle>Lý do hủy đơn hàng</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nhập lý do"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseCancelModal}
                        variant="secondary"  // xám
                    >
                        Đóng
                    </Button>

                    <Button
                        onClick={handleConfirmCancel}
                        variant="primary"    // xanh
                    >
                        Xác nhận hủy
                    </Button>
                </DialogActions>
            </Dialog>
            <CommentModal
                show={showCommentModal}
                handleClose={handleCloseCommentModal}
                backdropClassName="custom-backdrop"
            />
        </div>
    );
};

export default Orders;
