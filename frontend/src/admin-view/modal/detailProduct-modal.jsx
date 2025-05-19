import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Grid,
    TextField
} from '@mui/material';
import productService from '../../services/productService';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 1000,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '98vh',
    overflowY: 'auto'
};

const ProductDetailModal = ({ open, onClose, product, imageBaseUrl = "http://localhost:3333/images" }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (open && product?.masanpham) {
            fetchData(product.masanpham);
        }
    }, [open, product?.masanpham]);

    const fetchData = async (id) => {
        try {
            const response = await productService.getProductById(id);
            setData(response || []);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    if (!data) return null;

    const imageList = data.hinhanh?.split(',') || [];

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    🛍 Chi tiết sản phẩm
                </Typography>

                {/* Ảnh sản phẩm */}
                <Grid container spacing={2} mb={2}>
                    {imageList.map((img, idx) => (
                        <Grid item key={idx}>
                            <img
                                src={`${imageBaseUrl}/${img}`}
                                alt={`product-${idx}`}
                                style={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover',
                                    borderRadius: 4,
                                    border: '1px solid #ccc'
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Thông tin sản phẩm */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Thương hiệu" value={data.tenthuonghieu || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Tên sản phẩm" value={data.tensanpham || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Hệ điều hành" value={data.hedieuhanh || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="CPU" value={data.cpu || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="GPU" value={data.gpu || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Camera trước" value={data.cameratruoc || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Camera sau" value={data.camerasau || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Công nghệ màn hình" value={data.congnghemanhinh || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Độ phân giải màn hình" value={data.dophangiaimanhinh || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Pin" value={data.pin || ''} InputProps={{ readOnly: true }} margin="dense" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mô tả"
                            value={data.mota || ''}
                            InputProps={{ readOnly: true }}
                            multiline
                            rows={3}
                            margin="dense"
                        />
                    </Grid>
                </Grid>

                {/* Chi tiết phiên bản sản phẩm */}
                {Array.isArray(data.chiTietSanPham) && data.chiTietSanPham.length > 0 && (
                    <Box mt={3}>
                        <Typography variant="subtitle1">📦 Các phiên bản sản phẩm</Typography>
                        <Grid container spacing={2} mt={1}>
                            {data.chiTietSanPham.map((detail, index) => (
                                <Grid item xs={12} key={index}>
                                    <Box
                                        p={2}
                                        mb={2}
                                        border="1px solid #ccc"
                                        borderRadius={2}
                                    >
                                        {/* Hình ảnh nằm riêng một dòng */}
                                        {detail.hinhanhchitiet && (
                                            <Box mb={2}>
                                                <img
                                                    src={`${imageBaseUrl}/${detail.hinhanhchitiet}`}
                                                    alt={`variant-${index}`}
                                                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }}
                                                />
                                            </Box>
                                        )}

                                        {/* Thông tin nằm ngang một dòng */}
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            flexWrap="wrap"
                                            alignItems="center"
                                            gap={2}
                                        >
                                            <TextField label="Màu" value={detail.mau} InputProps={{ readOnly: true }} size="small" />
                                            <TextField label="Dung lượng" value={detail.dungluong} InputProps={{ readOnly: true }} size="small" />
                                            <TextField label="RAM" value={detail.ram} InputProps={{ readOnly: true }} size="small" />
                                            <TextField label="Số lượng" value={detail.soluong} InputProps={{ readOnly: true }} size="small" />
                                            <TextField label="Giá nhập" value={detail.gianhap} InputProps={{ readOnly: true }} size="small" />
                                            <TextField label="Giá bán" value={detail.giaban} InputProps={{ readOnly: true }} size="small" />
                                            <TextField label="Khuyến mãi (%)" value={detail.khuyenmai} InputProps={{ readOnly: true }} size="small" />
                                            <TextField label="Giá giảm" value={detail.giagiam} InputProps={{ readOnly: true }} size="small" />
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default ProductDetailModal;
