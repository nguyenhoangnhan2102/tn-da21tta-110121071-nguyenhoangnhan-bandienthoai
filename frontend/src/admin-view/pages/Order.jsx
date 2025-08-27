import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import "../style/order.scss";
import {
    Typography,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import OrderDetails from "../modal/detailOrders";
import { getAllOrders, getOrderDetails, updateStatus } from "../../services/orderService";

const imgURL = process.env.REACT_APP_IMG_URL;

const Order = () => {
    const [orders, setOrders] = useState([]);
    console.log("oder", orders)
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [newStatus, setNewStatus] = useState(null);
    const [detailMode, setDetailMode] = useState("view"); // thêm state
    const ordersPerPage = 10;
    console.log("orders", orders)
    useEffect(() => {
        getAllOrdersData();
    }, []);

    const getAllOrdersData = async () => {
        try {
            const response = await getAllOrders();
            if (response?.data) {
                const sortedOrders = response.data.sort((a, b) => {
                    const dateA = new Date(a.ngaycapnhat || a.ngaytao);
                    const dateB = new Date(b.ngaycapnhat || b.ngaytao);
                    return dateB - dateA; // Mới nhất lên đầu
                });
                setOrders(sortedOrders);
            }
        } catch (err) {
            console.error("Error occurred", err);
        }
    };


    const handleViewDetails = async (order, mode = "view") => {
        setDetailMode(mode); // set chế độ view/edit
        setSelectedOrders(order);
        setOpenDetailModal(true);

        try {
            const response = await getOrderDetails(order.madonhang);
            if (response.success) {
                setSelectedOrders(prev => ({
                    ...response.data,
                    sanpham: response.data.sanpham.map((sp, i) => ({
                        ...sp,
                        hinhanh: prev?.sanpham?.[i]?.hinhanh || null
                    }))
                }));
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin chi tiết đơn hàng");
            console.error("Error fetching order details", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleUpdateStatus = (order, status) => {
        setSelectedOrder(order);
        setNewStatus(status);
        setOpenModal(true);
    };

    const confirmUpdateStatus = async () => {
        if (selectedOrder && newStatus !== null) {
            try {
                const response = await updateStatus(selectedOrder.madonhang, newStatus);
                if (response.EC === 1) {
                    toast.success(response.EM); // Hiển thị thông báo thành công
                    getAllOrdersData(); // Lấy lại danh sách đơn hàng sau khi cập nhật
                    setOpenModal(false); // Đóng modal
                } else {
                    toast.error(response.EM); // Hiển thị thông báo lỗi
                }
            } catch (err) {
                toast.error("Lỗi cập nhật trạng thái đơn hàng"); // Hiển thị thông báo lỗi khi gọi API
                console.error("Error occurred", err);
            }
        }
    };

    const indexOfLast = currentPage * ordersPerPage;
    const indexOfFirst = indexOfLast - ordersPerPage;

    const currentOrders = orders
        .filter(order =>
            (order.hotenkhachhang && order.hotenkhachhang.toLowerCase().startsWith(searchTerm.toLowerCase()))
            ||
            (order.tensanpham && order.tensanpham.toLowerCase().startsWith(searchTerm.toLowerCase()))
        )
        .sort((a, b) => new Date(b.ngaycapnhat || b.ngaytao) - new Date(a.ngaycapnhat || a.ngaytao))
        .slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Map trạng thái đơn hàng sang class, icon và text
    const statusMap = {
        choxacnhan: {
            className: "status-pending",
            icon: "fa-hourglass",
            text: "Chờ xác nhận"
        },
        danggiao: {
            className: "status-shipping",
            icon: "fa-truck",
            text: "Đang giao"
        },
        hoanthanh: {
            className: "status-delivered",
            icon: "fa-check",
            text: "Hoàn thành"
        },
        huy: {
            className: "status-cancelled",
            icon: "fa-ban",
            text: "Đã hủy"
        }
    };


    return (
        <>
            <div>
                <div className="group-header">
                    <h2>Danh sách đơn hàng</h2>
                    <div className="filterGroup" style={{ position: 'relative' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <i
                            className="fa-solid fa-magnifying-glass"
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                pointerEvents: 'none',
                                color: '#000'
                            }}
                        ></i>
                    </div>
                </div>
                <table className="table table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên người mua</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">Tổng tiền</th>
                            <th scope="col">Ngày đặt</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order, index) => (
                                <tr
                                    key={order.madonhang}
                                // className={order.trangthaidonhang === 2 ? "disabled-row" : ""}
                                >
                                    <td>{(currentPage - 1) * ordersPerPage + index + 1}</td>
                                    <td>{order.hotenkhachhang || "Không có"}</td>
                                    <td>{order.sodienthoaikhachhang || "Không có"}</td>
                                    <td>{order.diachigiaohang || "Không có"}</td>
                                    <td>{order.tongtien ? new Intl.NumberFormat('vi-VN', { currency: 'VND' }).format(order.tongtien) : "Không có"}đ</td>
                                    <td>
                                        {/* Chuyển đổi ngày */}
                                        {order.thoigiandat
                                            ? new Date(order.thoigiandat).toLocaleString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric"
                                            })
                                            : "Không có"}
                                    </td>
                                    <td>
                                        {statusMap[order.trangthai] && (
                                            <span className={statusMap[order.trangthai].className}>
                                                <i className={`fa-solid ${statusMap[order.trangthai].icon} me-2`}></i>
                                                {statusMap[order.trangthai].text}
                                            </span>
                                        )}
                                    </td>
                                    <td className="d-flex align-items-center gap-2" style={{ border: 'none' }}>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handleViewDetails(order, "view")}
                                        >
                                            <i className="fa-regular fa-eye"></i> Xem
                                        </button>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleViewDetails(order, "edit")}
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i> Sửa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">
                                    <h6>Không tìm thấy đơn hàng</h6>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end admin-pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                            </button>
                        </li>
                    </ul>
                </nav>

                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <DialogTitle>Xác nhận cập nhật trạng thái</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            Bạn chắc chắn muốn <strong>{newStatus === 1 ? 'giao' : 'hủy'}</strong> đơn hàng này không?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <button
                            onClick={() => setOpenModal(false)}
                            className="btn btn-danger"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={confirmUpdateStatus}
                            className="btn btn-primary"
                        >
                            Xác nhận
                        </button>
                    </DialogActions>
                </Dialog>
            </div >
            <OrderDetails
                open={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                order={selectedOrders}
                mode={detailMode}         // truyền prop mới
                reloadOrders={getAllOrdersData}
            />

        </>
    );
};

export default Order;
