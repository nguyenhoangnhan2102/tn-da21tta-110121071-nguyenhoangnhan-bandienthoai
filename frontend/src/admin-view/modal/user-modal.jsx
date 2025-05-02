import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import userService from "../../services/userAccountService";
// Style for the modal box
const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "97vh",
    overflow: "auto",
};

const UserModal = ({ user, onSave, open, onClose, isView }) => {
    const [form, setForm] = useState({
        manguoidung: "",
        hoten: "",
        sodienthoai: "",
        diachi: "",
        role: "",
    });

    useEffect(() => {
        if (user) {
            setForm({
                manguoidung: user.manguoidung || "",
                hoten: user.hoten || "",
                sodienthoai: user.sodienthoai || "",
                diachi: user.diachi || "",
                role: user.role || "",
            });
        } else {
            setForm({
                manguoidung: "",
                hoten: "",
                sodienthoai: "",
                diachi: "",
                role: "",
            });
        }
    }, [user, open]);

    const handleChange = (e) => {
        if (isView) return;
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "role" ? parseInt(value) : value,
        }));
    };


    const handleSubmit = async () => {
        try {
            if (user) {
                // Cập nhật thông tin người dùng với dữ liệu từ form
                const updatedData = {
                    ...form,
                    updated_at: new Date(),
                };

                // Gọi API để cập nhật người dùng
                const response = await userService.updateUserById_Admin(updatedData);

                if (response) {
                    toast.success("Cập nhật thành công");
                    onSave(response.user); // Gửi dữ liệu người dùng mới về cha
                    onClose(); // Đóng modal
                } else {
                    toast.error("Cập nhật không thành công");
                }
            }
        } catch (error) {
            console.error("Error saving user:", error);
            toast.error("Lỗi khi lưu thông tin người dùng");
        }
    };

    console.log("form", form);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2">
                    {isView ? "Xem chi tiết danh mục" : user ? "Cập nhật danh mục" : "Thêm thương hiệu mới"}
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Họ tên"
                    name="hoten"
                    value={form.hoten}
                    onChange={handleChange}
                    disabled={isView}
                />{" "}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Số điện thoại"
                    name="sodienthoai"
                    value={form.sodienthoai}
                    onChange={handleChange}
                    disabled={isView}
                />{" "}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Địa chỉ"
                    name="diachi"
                    value={form.diachi}
                    onChange={handleChange}
                    disabled={isView}
                />{" "}
                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="Phân quyền"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    disabled={isView}
                >
                    <MenuItem value={1}>Quản trị viên</MenuItem>
                    <MenuItem value={2}>Nhân viên</MenuItem>
                    <MenuItem value={0}>Người dùng</MenuItem>
                </TextField>
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    {!isView ? (
                        <button
                            className="btn btn-primary admin-btn"
                            onClick={handleSubmit}
                        >
                            <i className="fa-solid fa-floppy-disk mr-5"></i> Lưu
                        </button>
                    ) : (
                        false
                    )}

                    <button className="btn btn-danger admin-btn " onClick={onClose}>
                        <i className="fa-solid fa-ban mr-5"> </i> Huỷ
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default UserModal;
