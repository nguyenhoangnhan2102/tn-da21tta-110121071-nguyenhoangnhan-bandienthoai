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
} from "@mui/material";
import { toast } from "react-toastify";
import brandService from "../../services/brandService";

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

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        if (brand) {
            setForm({
                tenthuonghieu: brand.tenthuonghieu || "",
                trangthaithuonghieu: brand.trangthaithuonghieu || 0,
            });
            setLogoFile(null);
            setLogoPreview(null);
        } else {
            setForm({
                tenthuonghieu: "",
                trangthaithuonghieu: 0,
            });
            setLogoFile(null);
            setLogoPreview(null);
        }
    }, [brand, open]);

    const handleChange = (e) => {
        if (isView) return;
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (isView) return;
        const file = e.target.files[0];
        setLogoFile(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        } else {
            setLogoPreview(null);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!form.tenthuonghieu) {
                toast.warning("Vui lòng nhập tên thương hiệu");
                return;
            }

            if (brand) {
                // Chỉnh sửa (không cập nhật logo ở đây)
                await brandService.updateBrand(brand.mathuonghieu, form);
                toast.success("Cập nhật thành công!");
            } else {
                // Tạo mới
                const formData = new FormData();
                formData.append("tenthuonghieu", form.tenthuonghieu);
                formData.append("trangthaithuonghieu", form.trangthaithuonghieu);
                if (logoFile) {
                    formData.append("logo", logoFile);
                }

                const result = await brandService.createBrand(formData);
                if (!result?.success) return; // createBrand đã có toast

                toast.success("Tạo mới thành công!");
            }

            onSave(form);
            onClose();
        } catch (error) {
            console.error("Error saving brand:", error);
            toast.error("Đã xảy ra lỗi");
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
                    {isView ? "Xem chi tiết thương hiệu" : brand ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
                </Typography>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Tên thương hiệu"
                    name="tenthuonghieu"
                    value={form.tenthuonghieu}
                    onChange={handleChange}
                    disabled={isView}
                />

                {!brand && (
                    <>
                        <Box my={2}>
                            <input
                                accept="image/*"
                                id="upload-logo"
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                disabled={isView}
                            />
                            <label htmlFor="upload-logo">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<i className="fa-solid fa-image"></i>}
                                    disabled={isView}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: "8px",
                                        paddingX: 2,
                                        paddingY: 1,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    Ảnh
                                </Button>
                            </label>

                            {logoPreview && (
                                <Box mt={2}>
                                    <img
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        style={{
                                            maxHeight: "120px",
                                            border: "1px solid #ccc",
                                            padding: "4px",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </>
                )}

                <FormControl fullWidth margin="normal" disabled={isView}>
                    <InputLabel id="select-trangthai-label">Trạng thái</InputLabel>
                    <Select
                        labelId="select-trangthai-label"
                        label="Trạng thái"
                        name="trangthaithuonghieu"
                        value={form.trangthaithuonghieu}
                        onChange={(e) => setForm(prev => ({ ...prev, trangthaithuonghieu: e.target.value }))}
                    >
                        <MenuItem value={0}>Hoạt động</MenuItem>
                        <MenuItem value={1}>Không hoạt động</MenuItem>
                    </Select>
                </FormControl>

                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    {!isView && (
                        <button
                            className="btn btn-primary admin-btn"
                            onClick={handleSubmit}
                        >
                            <i className="fa-solid fa-floppy-disk mr-5"></i> Lưu
                        </button>
                    )}
                    <button className="btn btn-danger admin-btn" onClick={onClose}>
                        <i className="fa-solid fa-ban mr-5"> </i> Huỷ
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default BrandModal;
