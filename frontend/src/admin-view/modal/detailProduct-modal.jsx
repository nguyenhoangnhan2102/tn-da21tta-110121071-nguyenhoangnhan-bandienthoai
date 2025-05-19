import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText
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
    maxHeight: '90vh',
    overflowY: 'auto'
};

const imageBaseUrl = 'http://localhost:3333/images'; // ✅ chỉnh URL ảnh tùy môi trường của bạn

const ProductDetailModal = ({ open, onClose, product }) => {
    const [data, setData] = useState(null);
    console.log("product", product?.masanpham);

    useEffect(() => {
        if (open && product?.masanpham) {
            fetchData(product.masanpham);
        }
    }, [open, product?.masanpham]);


    const fetchData = async (id) => {
        try {
            const response = await productService.getProductById(id);
            console.log("re", response);
            setData(response);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    if (!data) return null;

    const imageList = data.hinhanh?.split(',') || [];

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h5" gutterBottom>
                    🛍 Chi tiết sản phẩm: {data.tensanpham}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* Ảnh sản phẩm */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {imageList.map((img, idx) => (
                        <Grid item xs={6} sm={4} md={3} key={idx}>
                            <img
                                src={`${imageBaseUrl}/${img}`}
                                alt={`product-${idx}`}
                                style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4 }}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <List>
                            <ListItem>
                                <ListItemText primary="Thương hiệu" secondary={data.tenthuonghieu || '-'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Hệ điều hành" secondary={data.hedieuhanh || '-'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="CPU" secondary={data.cpu || '-'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="GPU" secondary={data.gpu || '-'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Pin" secondary={data.pin || '-'} />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <List>
                            <ListItem>
                                <ListItemText primary="Camera trước" secondary={data.cameratruoc || '-'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Camera sau" secondary={data.camerasau || '-'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Công nghệ màn hình" secondary={data.congnghemanhinh || '-'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Độ phân giải màn hình" secondary={data.dophangiaimanhinh || '-'} />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>

                <Box mt={3}>
                    <Typography variant="subtitle1">📝 Mô tả sản phẩm</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
                        {data.mota || 'Không có mô tả'}
                    </Typography>
                </Box>

                {Array.isArray(data.chiTietSanPham) && (
                    <Box mt={4}>
                        <Typography variant="subtitle1" gutterBottom>
                            📦 Các phiên bản sản phẩm
                        </Typography>
                        <Grid container spacing={2}>
                            {data.chiTietSanPham.map((detail, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Box border="1px solid #ccc" borderRadius={2} p={2}>
                                        {detail.hinhanhchitiet && (
                                            <img
                                                src={`${imageBaseUrl}/${detail.hinhanhchitiet}`}
                                                alt={`variant-${i}`}
                                                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        )}
                                        <Typography variant="body2"><strong>Màu:</strong> {detail.mau}</Typography>
                                        <Typography variant="body2"><strong>Dung lượng:</strong> {detail.dungluong}</Typography>
                                        <Typography variant="body2"><strong>RAM:</strong> {detail.ram}</Typography>
                                        <Typography variant="body2"><strong>Số lượng:</strong> {detail.soluong}</Typography>
                                        <Typography variant="body2"><strong>Giá nhập:</strong> {detail.gianhap}</Typography>
                                        <Typography variant="body2"><strong>Giá bán:</strong> {detail.giaban}</Typography>
                                        <Typography variant="body2"><strong>Khuyến mãi:</strong> {detail.khuyenmai}%</Typography>
                                        <Typography variant="body2"><strong>Giá giảm:</strong> {detail.giagiam}</Typography>
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
