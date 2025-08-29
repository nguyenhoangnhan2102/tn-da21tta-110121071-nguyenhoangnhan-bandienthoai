/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Modal,
    Typography,
    Input,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxHeight: "95vh", // Đặt chiều cao tối đa để tránh vượt quá màn hình
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflowY: "auto", // Thêm thuộc tính này để có thanh cuộn dọc khi cần
};

const CommentModal = ({ comment, onSave, open, onClose, viewMode }) => {
    const [form, setForm] = useState({
        binhluan: "",
        sao: 0,
        trangthai: 0,
    });

    useEffect(() => {
        if (comment) {
            setForm({
                binhluan: comment.binhluan || "",
                sao: comment.sao || 0,
                trangthai: comment.trangthai || 0,
            });
        }
    }, [comment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(form);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    {viewMode ? "Chi tiết bình luận" : "Chỉnh sửa bình luận"}
                </Typography>

                <TextField
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                    label="Nội dung bình luận"
                    name="binhluan"
                    value={form.binhluan}
                    onChange={handleChange}
                    disabled={viewMode}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Số sao (1-5)"
                    name="sao"
                    value={form.sao}
                    onChange={handleChange}
                    disabled={viewMode}
                />
                {!viewMode && (
                    <Box mt={2} display="flex" justifyContent="flex-end" gap="5px">
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Lưu
                        </button>
                        <button className="btn btn-danger" onClick={onClose}>
                            Huỷ
                        </button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};


export default CommentModal; 
