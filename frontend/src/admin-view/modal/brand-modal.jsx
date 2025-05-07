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
    });

    useEffect(() => {
        if (brand) {
            setForm({
                tenthuonghieu: brand.tenthuonghieu || "",
            });
        } else {
            setForm({
                tenthuonghieu: "",
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
            if (brand) {
                await brandService.updateBrand(brand.mathuonghieu, form.tenthuonghieu);
                toast.success("Cập nhật loại sản phẩm thành công");
            } else {
                const response = await brandService.createBrand(form.tenthuonghieu);
                if (response.statusCode === 400) {
                    toast.error("Danh mục này đã tồn tại");
                } else {
                    toast.success("Thêm loại sản phẩm thành công");
                }
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
