import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Modal,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Menu,
    InputAdornment,
    ListItemText,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import brandService from "../../services/brandService";
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

const BrandModal = ({ brand, onSave, open, onClose, isView }) => {
    const [form, setForm] = useState({
        tenthuonghieu: "",
        trangthaithuonghieu: 0,
    });

    useEffect(() => {
        if (brand) {
            setForm({
                tenthuonghieu: brand.tenthuonghieu || "",
                trangthaithuonghieu: brand.trangthaithuonghieu || "",
            });
        } else {
            setForm({
                tenthuonghieu: "",
                trangthaithuonghieu: 0
            });
        }
    }, [brand, open]);

    const handleChange = (e) => {
        if (isView) return;

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const data = {
                tenthuonghieu: form.tenthuonghieu,
                trangthaithuonghieu: form.trangthaithuonghieu,
            };

            if (brand) {
                await brandService.updateBrand(brand.mathuonghieu, data);
                toast.success("Cập nhật thành công!")
            } else {
                await brandService.createBrand(data);
                toast.success("Tạo mới thành công!")
            }
            onSave(form);
            onClose();
        } catch (error) {
            console.error("Error saving brand:", error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2">
                    {isView ? "Xem chi tiết danh mục" : brand ? "Cập nhật danh mục" : "Thêm thương hiệu mới"}
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Tên danh mục"
                    name="tenthuonghieu"
                    value={form.tenthuonghieu}
                    onChange={handleChange}
                    disabled={isView}
                    inputProps={{
                        autoFocus: true
                    }}
                />{" "}
                <FormControl fullWidth margin="normal" disabled={isView}>
                    <InputLabel id="select-trangthai-label">Trạng thái</InputLabel>
                    <Select
                        labelId="select-trangthai-label"
                        label="Trạng thái"
                        name="trangthaithuonghieu"
                        value={form.trangthaithuonghieu}
                        onChange={(e) => {
                            if (isView) return;
                            setForm(prev => ({ ...prev, trangthaithuonghieu: e.target.value }));
                        }}
                    >
                        <MenuItem value={0}>Hoạt động</MenuItem>
                        <MenuItem value={1}>Không hoạt động</MenuItem>
                    </Select>
                </FormControl>
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

export default BrandModal;
