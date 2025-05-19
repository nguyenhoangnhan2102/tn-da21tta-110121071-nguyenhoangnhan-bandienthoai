import React from 'react';
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

const ProductDetailModal = ({ open, onClose, product }) => {
    // if (!product) return null;
    console.log("product", product)
    return (
        <div>dsad</div>
        // <Modal open={open} onClose={onClose}>
        //     <Box sx={style}>
        //         <Typography variant="h5" gutterBottom>
        //             🛍 Chi tiết sản phẩm: {product.tensanpham}
        //         </Typography>

        //         <Divider sx={{ mb: 2 }} />

        //         {/* Ảnh sản phẩm */}
        //         {/* Ảnh sản phẩm */}
        //         <Grid container spacing={2}>
        //             <Grid item xs={12} sm={6}>
        //                 <List>
        //                     <ListItem>
        //                         <ListItemText primary="Thương hiệu" secondary={product.tenthuonghieu || '-'} />
        //                     </ListItem>
        //                     <ListItem>
        //                         <ListItemText primary="Hệ điều hành" secondary={product.hedieuhanh || '-'} />
        //                     </ListItem>
        //                     <ListItem>
        //                         <ListItemText primary="CPU" secondary={product.cpu || '-'} />
        //                     </ListItem>
        //                     <ListItem>
        //                         <ListItemText primary="GPU" secondary={product.gpu || '-'} />
        //                     </ListItem>
        //                     <ListItem>
        //                         <ListItemText primary="Pin" secondary={product.pin || '-'} />
        //                     </ListItem>
        //                 </List>
        //             </Grid>

        //             <Grid item xs={12} sm={6}>
        //                 <List>
        //                     <ListItem>
        //                         <ListItemText primary="Camera trước" secondary={product.cameratruoc || '-'} />
        //                     </ListItem>
        //                     <ListItem>
        //                         <ListItemText primary="Camera sau" secondary={product.camerasau || '-'} />
        //                     </ListItem>
        //                     <ListItem>
        //                         <ListItemText primary="Công nghệ màn hình" secondary={product.congnghemanhinh || '-'} />
        //                     </ListItem>
        //                     <ListItem>
        //                         <ListItemText primary="Độ phân giải màn hình" secondary={product.dophangiaimanhinh || '-'} />
        //                     </ListItem>
        //                 </List>
        //             </Grid>
        //         </Grid>

        //         {/* Mô tả */}
        //         <Box mt={3}>
        //             <Typography variant="subtitle1">📝 Mô tả sản phẩm</Typography>
        //             <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
        //                 {product.mota || 'Không có mô tả'}
        //             </Typography>
        //         </Box>

        //         {/* Chi tiết biến thể */}
        //         {Array.isArray(product.chiTietSanPham) && (
        //             <Box mt={4}>
        //                 <Typography variant="subtitle1" gutterBottom>
        //                     📦 Các phiên bản sản phẩm
        //                 </Typography>
        //                 <Grid container spacing={2}>
        //                     {product.chiTietSanPham.map((detail, i) => (
        //                         <Grid item xs={12} sm={6} md={4} key={i}>
        //                             <Box border="1px solid #ccc" borderRadius={2} p={2}>
        //                                 {detail.hinhanhchitiet && (
        //                                     <img
        //                                         src={`${imageBaseUrl}/${detail.hinhanhchitiet}`}
        //                                         alt={`variant-${i}`}
        //                                         style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 4 }}
        //                                     />
        //                                 )}
        //                                 <Typography variant="body2"><strong>Màu:</strong> {detail.mau}</Typography>
        //                                 <Typography variant="body2"><strong>Dung lượng:</strong> {detail.dungluong}</Typography>
        //                                 <Typography variant="body2"><strong>RAM:</strong> {detail.ram}</Typography>
        //                                 <Typography variant="body2"><strong>Số lượng:</strong> {detail.soluong}</Typography>
        //                                 <Typography variant="body2"><strong>Giá nhập:</strong> {detail.gianhap}</Typography>
        //                                 <Typography variant="body2"><strong>Giá bán:</strong> {detail.giaban}</Typography>
        //                                 <Typography variant="body2"><strong>Khuyến mãi:</strong> {detail.khuyenmai}%</Typography>
        //                                 <Typography variant="body2"><strong>Giá giảm:</strong> {detail.giagiam}</Typography>
        //                             </Box>
        //                         </Grid>
        //                     ))}
        //                 </Grid>
        //             </Box>
        //         )}
        //     </Box>
        // </Modal>
    );
};

export default ProductDetailModal;
