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
                role: Number(user.role)  // đảm bảo luôn là số 0 hoặc 1

            });
        } else {
            setForm({
                manguoidung: "",
                hoten: "",
                sodienthoai: "",
                diachi: "",
                role: 0, // mặc định là Người dùng
            });
        }
    }, [user]);

    const handleChange = (e) => {
        if (isView) return;
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value, // giữ nguyên string
        }));
    }

    const handleSubmit = async () => {
        try {
            if (user) {
                const updatedData = {
                    ...form,
                    role: parseInt(form.role, 10), // convert string "1"/"0" sang số
                    ngaycapnhat: new Date(),
                };

                const response = await userService.updateUserById_User(
                    form.manguoidung,
                    updatedData
                );

                if (response) {
                    onSave(response.user);
                    onClose();
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
