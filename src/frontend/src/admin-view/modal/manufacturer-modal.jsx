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

const ModalManufacturer = ({ manufacturer, onSave, open, onClose }) => {

    const [form, setForm] = useState({
        tenthuonghieu: "",
        trangthaithuonghieu: "",
    });

    useEffect(() => {
        if (manufacturer) {
            setForm(manufacturer);
        } else {
            setForm({
                tenthuonghieu: "",
                trangthaithuonghieu: 0,
            });
        }
    }, [manufacturer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = () => {
        onSave(form);
        setForm({
            tennhasanxuat: "",
            trangthaithuonghieu: 0,
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <Typography makhachhang="modal-title" variant="h6" component="h2">
                    {manufacturer ? "Cập nhật" : "Thêm mới"}
                </Typography>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Tên thương hiệu"
                    name="tenthuonghieu"
                    value={form.tenthuonghieu}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel makhachhang="trangthaithuonghieu-label">Trạng thái</InputLabel>
                    <Select
                        labelId="trangthaithuonghieu-label"
                        name="trangthaithuonghieu"
                        label="Trạng thái"
                        value={form.trangthaithuonghieu}
                        onChange={handleChange}
                    >
                        <MenuItem value={0}>Hoạt động</MenuItem>
                        <MenuItem value={1}>Không hoạt động</MenuItem>
                    </Select>
                </FormControl>
                <Box mt={2} display="flex" justifyContent="flex-end" gap="5px">
                    <button className="btn btn-primary admin-btn" onClick={handleSubmit}>
                        {manufacturer ? "Cập nhật" : "Tạo mới"}
                    </button>
                    <button className="btn btn-danger admin-btn" onClick={onClose} style={{ width: '15%' }}>
                        Huỷ
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalManufacturer; 
