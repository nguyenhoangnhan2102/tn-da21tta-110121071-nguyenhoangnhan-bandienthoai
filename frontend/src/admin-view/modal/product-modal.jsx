import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import Form from 'react-bootstrap/Form';
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

const ProductModal = ({ product, onSave, open, onClose, isView }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const [form, setForm] = useState({
        mathuonghieu: "",
        tensanpham: "",
        hedieuhanh: "",
        ram: "",
        cpu: "",
        gpu: "",
        cameratruoc: "",
        camerasau: "",
        congnghemanhinh: "",
        dophangiaimanhinh: "",
        pin: "",
        mota: "",
        hinhanh: [],
        chiTietSanPham: [
            {
                mau: "",
                dungluong: "",
                soluong: "",
                gia: ""
            }
        ]
    });

    useEffect(() => {
        if (product) {
            setForm({
                mathuonghieu: product.mathuonghieu || "",
                tensanpham: product.tensanpham || "",
                hedieuhanh: product.hedieuhanh || "",
                ram: product.ram || "",
                cpu: product.cpu || "",
                gpu: product.gpu || "",
                cameratruoc: product.cameratruoc || "",
                camerasau: product.camerasau || "",
                congnghemanhinh: product.congnghemanhinh || "",
                dophangiaimanhinh: product.dophangiaimanhinh || "",
                pin: product.pin || "",
                mota: product.mota || "",
                hinhanh: product.hinhanh || [],
                chiTietSanPham: product.chiTietSanPham || [
                    { mau: "", dungluong: "", soluong: "", gia: "" }
                ]
            });
        } else {
            setForm({
                mathuonghieu: "",
                tensanpham: "",
                hedieuhanh: "",
                ram: "",
                cpu: "",
                gpu: "",
                cameratruoc: "",
                camerasau: "",
                congnghemanhinh: "",
                dophangiaimanhinh: "",
                pin: "",
                mota: "",
                hinhanh: [],
                chiTietSanPham: [
                    { mau: "", dungluong: "", soluong: "", gia: "" }
                ]
            });
        }
    }, [product, open]);

    const handleChange = (e) => {
        if (isView) return;

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Thêm ảnh mới vào danh sách ảnh cũ
        const updatedHinhanh = [...form.hinhanh, ...files];
        const updatedPreviews = [
            ...previewImages,
            ...files.map((file) => URL.createObjectURL(file))
        ];

        setForm((prev) => ({
            ...prev,
            hinhanh: updatedHinhanh
        }));
        setPreviewImages(updatedPreviews);
    };

    const handleRemoveImage = (indexToRemove) => {
        setPreviewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
        setForm((prev) => ({
            ...prev,
            hinhanh: prev.hinhanh.filter((_, index) => index !== indexToRemove)
        }));
    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2" mb={2}>
                    {isView ? "Xem chi tiết sản phẩm" : product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Tên sản phẩm"
                            name="tensanpham"
                            value={form.tensanpham}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Hệ điều hành"
                            name="hedieuhanh"
                            value={form.hedieuhanh}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="RAM"
                            name="ram"
                            value={form.ram}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="CPU"
                            name="cpu"
                            value={form.cpu}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="GPU"
                            name="gpu"
                            value={form.gpu}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Camera trước"
                            name="cameratruoc"
                            value={form.cameratruoc}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Camera sau"
                            name="camerasau"
                            value={form.camerasau}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Công nghệ màn hình"
                            name="congnghemanhinh"
                            value={form.congnghemanhinh}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Độ phân giải màn hình"
                            name="dophangiaimanhinh"
                            value={form.dophangiaimanhinh}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Pin"
                            name="pin"
                            value={form.pin}
                            onChange={handleChange}
                            disabled={isView}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mô tả"
                            name="mota"
                            value={form.mota}
                            onChange={handleChange}
                            disabled={isView}
                            multiline
                            rows={3}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Default file input example</Form.Label>
                            <Form.Control
                                type="file"
                                name="hinhanh"
                                multiple
                                accept="image/*"
                                disabled={isView}
                                onChange={handleImageChange} />
                        </Form.Group>
                        {previewImages.length > 0 && (
                            <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                                {previewImages.map((src, index) => (
                                    <Box
                                        key={index}
                                        position="relative"
                                        width={100}
                                        height={100}
                                        borderRadius={2}
                                        overflow="hidden"
                                        border="1px solid #ccc"
                                    >
                                        <img
                                            src={src}
                                            alt={`preview-${index}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }}
                                        />
                                        {!isView && (
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                style={{
                                                    position: "absolute",
                                                    top: 2,
                                                    right: 2,
                                                    background: "rgba(0,0,0,0.6)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: 20,
                                                    height: 20,
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    lineHeight: "20px",
                                                    textAlign: "center"
                                                }}
                                                title="Xoá ảnh"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>

                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    {!isView && (
                        <button
                            className="btn btn-primary admin-btn"
                        // onClick={handleSubmit}
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

export default ProductModal;
