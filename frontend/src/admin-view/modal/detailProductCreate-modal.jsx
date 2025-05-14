// import React, { useState } from 'react';
// import { Modal, Box, Grid, TextField, Button } from '@mui/material';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
// };

// const CreateProductDetailModal = ({ open, onClose, onSave }) => {
//   const [detail, setDetail] = useState({
//     mau: '',
//     dungluong: '',
//     ram: '',
//     soluong: '',
//     gianhap: '',
//     giaban: '',
//     khuyenmai: '',
//     hinhanhchitiet: null,
//     giagiam: '',
//   });

//   const handleChange = (field, value) => {
//     const newDetail = { ...detail, [field]: value };

//     const giaban = parseFloat(field === 'giaban' ? value : newDetail.giaban || 0);
//     const khuyenmai = parseFloat(field === 'khuyenmai' ? value : newDetail.khuyenmai || 0);
//     const soluong = parseInt(field === 'soluong' ? value : newDetail.soluong || 0);
//     newDetail.giagiam = (giaban * soluong * khuyenmai) / 100;

//     setDetail(newDetail);
//   };

//   const handleFileChange = (e) => {
//     setDetail({ ...detail, hinhanhchitiet: e.target.files[0] });
//   };

//   const handleSave = () => {
//     onSave(detail); // truyền về form cha
//     onClose();
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={style}>
//         <Grid container spacing={2}>
//           <Grid item xs={6}><TextField fullWidth label="Màu" value={detail.mau} onChange={(e) => handleChange('mau', e.target.value)} /></Grid>
//           <Grid item xs={6}><TextField fullWidth label="Dung lượng" value={detail.dungluong} onChange={(e) => handleChange('dungluong', e.target.value)} /></Grid>
//           <Grid item xs={6}><TextField fullWidth label="RAM" value={detail.ram} onChange={(e) => handleChange('ram', e.target.value)} /></Grid>
//           <Grid item xs={6}><TextField fullWidth label="Số lượng" type="number" value={detail.soluong} onChange={(e) => handleChange('soluong', e.target.value)} /></Grid>
//           <Grid item xs={6}><TextField fullWidth label="Giá nhập" type="number" value={detail.gianhap} onChange={(e) => handleChange('gianhap', e.target.value)} /></Grid>
//           <Grid item xs={6}><TextField fullWidth label="Giá bán" type="number" value={detail.giaban} onChange={(e) => handleChange('giaban', e.target.value)} /></Grid>
//           <Grid item xs={6}><TextField fullWidth label="Khuyến mãi (%)" type="number" value={detail.khuyenmai} onChange={(e) => handleChange('khuyenmai', e.target.value)} /></Grid>
//           <Grid item xs={6}><TextField fullWidth label="Giá giảm" type="number" disabled value={detail.giagiam} /></Grid>
//           <Grid item xs={12}>
//             <Button variant="contained" component="label">Tải ảnh chi tiết
//               <input type="file" hidden accept="image/*" onChange={handleFileChange} />
//             </Button>
//           </Grid>
//           <Grid item xs={12}>
//             <Box display="flex" justifyContent="flex-end" gap={2}>
//               <Button onClick={onClose}>Hủy</Button>
//               <Button onClick={handleSave} variant="contained">Lưu</Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </Modal>
//   );
// };

// export default CreateProductDetailModal;
