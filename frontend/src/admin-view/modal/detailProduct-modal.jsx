import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    TextField,
} from "@mui/material";
import productService from "../../services/productService";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxHeight: "90vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
};
const imgURL = process.env.REACT_APP_IMG_URL;
const ProductDetailModal = ({ product, open, onClose }) => {
    const [form, setForm] = useState({
        tensanpham: "",
        mathuonghieu: "",
        tenthuonghieu: "",
        giasanpham: "",
        soluongsanpham: "",
        hedieuhanh: "",
        cpu: "",
        gpu: "",
        ram: "",
        dungluong: "",
        cameratruoc: "",
        camerasau: "",
        congnghemanhinh: "",
        dophangiaimanhinh: "",
        pin: "",
        motasanpham: "",
        hinhanhchinh: "",
        danhsachmausac: "",
        danhsachmausacsanpham: "",
        danhsachhinhanh: "",
    });

    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetchProducts();
        if (product) {
            setForm({
                ...product,
                danhsachhinhanh: product.danhsachhinhanh
                    ? product.danhsachhinhanh.split(',') // Chuyển thành mảng
                    : [],
            });
        }
    }, [product]);

    const fetchProducts = async () => {
        try {
            const data = await productService.getDetailProduct();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx=
                {{
                    ...modalStyle,
                    maxHeight: '95vh',
                    height: '95vh',
                }}>
                <Typography makhachhang="modal-title" variant="h6" component="h2">
                    Chi tiết
                </Typography>

                <FormControl fullWidth margin="normal">
                    <TextField
                        makhachhang="product-text-field"
                        value={form.tensanpham}
                        label="Tên"
                        //disabled
                        sx={{
                            '& .MuiInputBase-input': {
                                height: '10px', // Chỉnh độ cao của input
                            },
                        }}
                    />
                </FormControl>
                <div className="d-flex gap-2">
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.tenthuonghieu}
                            label="Thương hiệu"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.hedieuhanh}
                            label="Hệ điều hành"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                },
                            }}
                        />
                    </FormControl>
                </div>
                <div className="d-flex gap-2">
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.giasanpham}
                            label="Giá"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                    color: 'black', // Đổi màu chữ thành đen
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.soluongsanpham}
                            label="Số lượng"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                },
                            }}
                        />
                    </FormControl>
                </div>
                <div className="d-flex gap-2">
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.cpu}
                            label="CPU"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                    color: 'black', // Đổi màu chữ thành đen
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.gpu}
                            label="GPU"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.pin}
                            label="Pin"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                },
                            }}
                        />
                    </FormControl>
                </div>
                <div className="d-flex gap-2">
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.cameratruoc}
                            label="Camera trước"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                    color: 'black', // Đổi màu chữ thành đen
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.camerasau}
                            label="Camera sau"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                },
                            }}
                        />
                    </FormControl>
                </div>
                <div className="d-flex gap-2">
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.congnghemanhinh}
                            label="Công nghệ màn hình"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                    color: 'black', // Đổi màu chữ thành đen
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            makhachhang="product-text-field"
                            value={form.dophangiaimanhinh}
                            label="Độ phân giải màn hình"
                            //disabled
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px', // Chỉnh độ cao của input
                                },
                            }}
                        />
                    </FormControl>
                </div>
                <FormControl fullWidth margin="normal">
                    <TextField
                        makhachhang="product-text-field"
                        value={form.motasanpham}
                        label="Mô tả"
                        multiline
                        rows={4} // Số dòng tối thiểu hiển thị
                        sx={{
                            '& .MuiInputBase-input': {
                                height: 'auto', // Để textarea tự điều chỉnh chiều cao
                                resize: 'vertical', // Cho phép thay đổi chiều cao
                            },
                        }}
                    />
                </FormControl>
                <div className="d-flex align-items-center mb-3">
                    <p className="col-2">Ảnh chính</p>
                    <div className="d-flex align-items-center justify-content-center col-10">
                        {form.hinhanhchinh && product?.hinhanhchinh && (
                            <img
                                src={`${imgURL}/${product.hinhanhchinh}`}
                                alt={product.tensanpham}
                                style={{ width: "80px", height: "80px" }}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-between text-center mb-3">
                    <label>Màu</label>
                    {Array.isArray(form.danhsachmausacsanpham) &&
                        form.danhsachmausacsanpham.map((img, index) => (
                            <img
                                key={index}
                                src={`${imgURL}/${img}`}
                                alt={`Màu sản phẩm ${index + 1}`}
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                        ))}
                </div>
            </Box>
        </Modal >
    );
};

export default ProductDetailModal;
