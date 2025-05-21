import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
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

const ProductDetailModal = ({ open, onClose, product, imageBaseUrl }) => {
    if (!product) return null;

    const imageList = product.hinhanh?.split(',') || [];

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
                        <TextField
                            fullWidth
                            label="Thương hiệu"
                            value={product.tenthuonghieu || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Tên sản phẩm"
                            value={product.tensanpham || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth label="Hệ điều hành"
                            value={product.hedieuhanh || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="CPU"
                            value={product.cpu || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="GPU"
                            value={product.gpu || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Camera trước"
                            value={product.cameratruoc || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Camera sau"
                            value={product.camerasau || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Công nghệ màn hình"
                            value={product.congnghemanhinh || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Độ phân giải màn hình"
                            value={product.dophangiaimanhinh || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Pin"
                            value={product.pin || ''}
                            InputProps={{ readOnly: true }}
                            margin="dense" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="trangthai-label">Trạng thái</InputLabel>
                            <Select
                                labelId="trangthai-label"
                                name="trangthai"
                                value={product.trangthai}
                                label="Trạng thái"
                            >
                                <MenuItem value={0}>Hoạt động</MenuItem>
                                <MenuItem value={1}>Không hoạt động</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mô tả"
                            value={product.mota || ''}
                            InputProps={{ readOnly: true }}
                            multiline
                            rows={3}
                            margin="dense"
                        />
                    </Grid>
                </Grid>

                {/* Chi tiết phiên bản sản phẩm */}
                {Array.isArray(product.chiTietSanPham) && product.chiTietSanPham.length > 0 && (
                    <Box mt={3}>
                        <Typography variant="subtitle1">📦 Biến thể sản phẩm</Typography>
                        <Grid container spacing={2} mt={1}>
                            {product.chiTietSanPham.map((detail, index) => (
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
                                            <TextField
                                                label="Màu"
                                                value={detail.mau}
                                                InputProps={{ readOnly: true }}
                                                size="small" />
                                            <TextField
                                                label="Dung lượng"
                                                value={detail.dungluong}
                                                InputProps={{ readOnly: true }}
                                                size="small" />
                                            <TextField
                                                label="RAM"
                                                value={detail.ram}
                                                InputProps={{ readOnly: true }}
                                                size="small" />
                                            <TextField
                                                label="Số lượng"
                                                value={detail.soluong}
                                                InputProps={{ readOnly: true }}
                                                size="small" />
                                            <TextField
                                                label="Giá nhập"
                                                value={(parseInt(detail.gianhap)).toLocaleString("vi-VN") + " đ"}
                                                InputProps={{ readOnly: true }}
                                                size="small" />
                                            <TextField
                                                label="Giá bán"
                                                value={(parseInt(detail.giaban)).toLocaleString("vi-VN") + " đ"}
                                                InputProps={{ readOnly: true }}
                                                size="small" />
                                            <TextField
                                                label="Khuyến mãi (%)"
                                                value={detail.khuyenmai + "%"}
                                                InputProps={{ readOnly: true }}
                                                size="small" />
                                            <TextField
                                                label="Giá giảm"
                                                value={(parseInt(detail.giagiam)).toLocaleString("vi-VN") + " đ"}
                                                InputProps={{ readOnly: true }}
                                                size="small" />
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
