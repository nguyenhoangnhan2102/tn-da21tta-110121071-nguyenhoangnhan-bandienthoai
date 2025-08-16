import React, { useState, useEffect } from "react";
import {
    Typography,
    Box,
    Modal,
    FormControl,
    TextField,
    Select,
    MenuItem,
    Button,
    InputLabel
} from "@mui/material";
import moment from "moment";
import { updateStatus } from "../../services/orderService";
import { toast } from "react-toastify";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1100,
    maxHeight: "90vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
};

const imgURL = process.env.REACT_APP_IMG_URL;

const OrderDetails = ({ open, onClose, order, reloadOrders, mode }) => {
    const [status, setStatus] = useState("");
    const isViewMode = mode === "view"; // true khi chỉ xem

    useEffect(() => {
        if (order) {
            setStatus(order.trangthai);
        }
    }, [order]);

    const handleUpdateStatus = async () => {
        try {
            await updateStatus(order.madonhang, status);
            toast.success("Cập nhật trạng thái thành công!");
            if (reloadOrders) reloadOrders();
            onClose();
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };

    if (!order) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyle }}>
                <Typography variant="h6">Chi tiết đơn hàng</Typography>

                <FormControl fullWidth margin="normal">
                    <TextField
                        value={order.hotenkhachhang}
                        label="Họ tên"
                        InputLabelProps={{ shrink: true }}
                        disabled={isViewMode}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        value={order.sodienthoaikhachhang}
                        label="Số điện thoại"
                        InputLabelProps={{ shrink: true }}
                        disabled={isViewMode}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        value={order.diachigiaohang}
                        label="Địa điểm giao hàng"
                        InputLabelProps={{ shrink: true }}
                        disabled={isViewMode}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        value={moment(order.thoigiandat).format('HH:mm:ss DD/MM/YYYY')}
                        label="Ngày đặt"
                        InputLabelProps={{ shrink: true }}
                        disabled={isViewMode}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongtien)}
                        label="Tổng tiền"
                        InputLabelProps={{ shrink: true }}
                        disabled={isViewMode}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Trạng thái đơn hàng</InputLabel>
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={isViewMode}
                        label="Trạng thái đơn hàng"
                    >
                        <MenuItem value="choxacnhan">Chờ xác nhận</MenuItem>
                        <MenuItem value="danggiao">Đang giao</MenuItem>
                        <MenuItem value="hoanthanh">Hoàn thành</MenuItem>
                        <MenuItem value="huy">Đã hủy</MenuItem>
                    </Select>
                </FormControl>

                {/* Bảng sản phẩm */}
                <table style={{ width: '100%', marginTop: "20px" }} className="table table-hover">
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Tổng tiền</th>
                            <th>Màu</th>
                            <th>RAM</th>
                            <th>Dung lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.sanpham && order.sanpham.length > 0 ? (
                            order.sanpham.map((sp, index) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            width="70px"
                                            height="70px"
                                            src={`${imgURL}${sp.hinhanh}`}
                                            alt={sp.tensanpham}

                                        />
                                    </td>
                                    <td >{sp.tensanpham}</td>
                                    <td >{sp.soluong}</td>
                                    <td >
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sp.dongia)}
                                    </td>
                                    <td >
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sp.soluong * sp.dongia)}
                                    </td>
                                    <td >{sp.mau}</td>
                                    <td >{sp.ram}</td>
                                    <td >{sp.dungluong}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>
                                    Không có sản phẩm trong đơn hàng
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {mode === "edit" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateStatus}
                        sx={{ mt: 2 }}
                    >
                        Cập nhật trạng thái
                    </Button>
                )}
            </Box>
        </Modal>
    );
};


export default OrderDetails;
