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
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const isViewMode = mode === "view"; // true khi chỉ xem
    console.log("order", order)
    useEffect(() => {
        if (order) {
            setStatus(order.trangthai);
            setPaymentMethod(order.hinhthucthanhtoan || "");
            setPaymentStatus(order.trangthaithanhtoan || "");
        }
    }, [order]);

    const handleUpdateStatus = async () => {
        try {
            await updateStatus(order.madonhang, status, paymentMethod, paymentStatus);
            toast.success("Cập nhật trạng thái đơn hàng và thanh toán thành công!");
            if (reloadOrders) reloadOrders();
            onClose();
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };

    if (!order) return null;
    console.log("order", order)
    // Map phương thức thanh toán sang tiếng Việt
    const paymentMethodMap = {
        home: "Tiền mặt",
        momo: "MoMo",
        online: "Online"
    };

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
                {order.lydohuy && (
                    <FormControl fullWidth margin="normal">
                        <TextField
                            value={order.lydohuy}
                            label="Lý do hủy"
                            multiline
                            rows={3}
                            InputLabelProps={{ shrink: true }}
                            disabled={isViewMode}
                        />
                    </FormControl>
                )}
                <div className="d-flex gap-2">
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
                            <MenuItem value="hoantien">Hoàn tiền</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Hình thức thanh toán */}
                    {/* <FormControl fullWidth margin="normal">
                        <TextField
                            label="Hình thức thanh toán"
                            value={paymentMethodMap[paymentMethod] || paymentMethod} // 👈 map sang tiếng Việt
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            disabled={isViewMode}
                        />
                    </FormControl> */}

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Hình thức thanh toán</InputLabel>
                        <Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            label="Hình thức thanh toán"
                            disabled
                        >
                            <MenuItem value="home">Tiền mặt</MenuItem>
                            <MenuItem value="momo">MoMo</MenuItem>
                            <MenuItem value="vnpay">VNPay</MenuItem>
                            <MenuItem value="paypal">Paypal</MenuItem>
                            <MenuItem value="online">Online</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Trạng thái thanh toán */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Trạng thái thanh toán</InputLabel>
                        <Select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            disabled={isViewMode}
                            label="Trạng thái thanh toán"
                        >
                            <MenuItem value="chuathanhtoan">Chưa thanh toán</MenuItem>
                            <MenuItem value="dathanhtoan">Đã thanh toán</MenuItem>
                        </Select>
                    </FormControl>
                </div>
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
                                            src={`${imgURL}${sp.hinhanh.split(',')[0]}`}
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
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onClose}
                        >
                            Đóng
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateStatus}
                        >
                            Cập nhật
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};


export default OrderDetails;
