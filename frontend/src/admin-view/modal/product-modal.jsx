import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import brandService from '../../services/brandService';
import productService from '../../services/productService';
// import CreateProductDetailModal from './detailProductCreate-modal';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxWidth: '90%',
  maxHeight: '98vh',
  overflowY: 'auto',
  width: 1100,
};

const ProductFormModal = ({ open, onClose, onSave, isView, product, imageBaseUrl }) => {
  const initialFormState = {
    mathuonghieu: '',
    tensanpham: '',
    hinhanh: [],
    hedieuhanh: '',
    cpu: '',
    gpu: '',
    cameratruoc: '',
    camerasau: '',
    congnghemanhinh: '',
    dophangiaimanhinh: '',
    pin: '',
    mota: '',
    chiTietSanPham: [{ mau: '', dungluong: '', ram: '', soluong: '', gianhap: '', giaban: '', hinhanh: null }],
  };

  const [form, setForm] = useState(initialFormState);
  const [previewImages, setPreviewImages] = useState([]);
  // const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [brands, setBrands] = useState([]);

  // Giả lập danh sách thương hiệu, bạn có thể thay bằng API gọi danh sách thương hiệu
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const response = await brandService.getAllBrand();
    setBrands(response || []);
  };

  // Load dữ liệu sản phẩm khi chỉnh sửa/xem
  useEffect(() => {
    if (product) {
      const imageArray = typeof product.hinhanh === 'string'
        ? product.hinhanh.split(',').map((img) => `${imageBaseUrl}/${img.trim()}`)
        : product.hinhanh;

      const chiTietSanPhamArray = Array.isArray(product.chiTietSanPham) && product.chiTietSanPham.length > 0
        ? product.chiTietSanPham.map(detail => ({
          mau: detail.mau || '',
          dungluong: detail.dungluong || '',
          ram: detail.ram || '',
          soluong: detail.soluong || '',
          gianhap: detail.gianhap || '',
          giaban: detail.giaban || '',
          khuyenmai: detail.khuyenmai || '',
          giagiam: detail.giagiam || '',
          hinhanhchitiet: detail.hinhanhchitiet
            ? `${imageBaseUrl}/${detail.hinhanhchitiet}`
            : null,
        }))
        : [{
          mau: '',
          dungluong: '',
          ram: '',
          soluong: '',
          gianhap: '',
          giaban: '',
          khuyenmai: '',
          giagiam: '',
          hinhanhchitiet: null,
        }];

      setForm({
        mathuonghieu: product.mathuonghieu || '',
        tensanpham: product.tensanpham || '',
        hinhanh: product.hinhanh || [],
        hedieuhanh: product.hedieuhanh || '',
        cpu: product.cpu || '',
        gpu: product.gpu || '',
        cameratruoc: product.cameratruoc || '',
        camerasau: product.camerasau || '',
        congnghemanhinh: product.congnghemanhinh || '',
        dophangiaimanhinh: product.dophangiaimanhinh || '',
        pin: product.pin || '',
        mota: product.mota || '',
        chiTietSanPham: chiTietSanPhamArray
      });

      setPreviewImages(imageArray || []);
    } else {
      setForm(initialFormState);
      setPreviewImages([]);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(newImages);
    setForm((prev) => ({ ...prev, hinhanh: files }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setForm((prev) => ({
      ...prev,
      hinhanh: prev.hinhanh.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleDetailChange = (index, field, value) => {
    setForm((prev) => {
      const newDetails = [...prev.chiTietSanPham];
      const detail = { ...newDetails[index], [field]: value };

      // Tự động tính giagiam khi giaban hoặc khuyenmai thay đổi
      const giaban = parseFloat(field === 'giaban' ? value : detail.giaban || 0);
      const khuyenmai = parseFloat(field === 'khuyenmai' ? value : detail.khuyenmai || 0);
      detail.giagiam = (giaban * khuyenmai) / 100;

      newDetails[index] = detail;
      return { ...prev, chiTietSanPham: newDetails };
    });
  };

  const addDetail = () => {
    setForm((prev) => ({
      ...prev,
      chiTietSanPham: [...prev.chiTietSanPham, {
        mau: '',
        dungluong: '',
        ram: '',
        soluong: '',
        gianhap: '',
        giaban: '',
        khuyenmai: '',
        hinhanh: null,
        giagiam: '',
      }]
    }));
  };

  const removeDetail = (index) => {
    setForm((prev) => ({
      ...prev,
      chiTietSanPham: prev.chiTietSanPham.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Thông tin sản phẩm chính
    formData.append('mathuonghieu', form.mathuonghieu);
    formData.append('tensanpham', form.tensanpham);
    formData.append('hedieuhanh', form.hedieuhanh);
    formData.append('cpu', form.cpu);
    formData.append('gpu', form.gpu);
    formData.append('cameratruoc', form.cameratruoc);
    formData.append('camerasau', form.camerasau);
    formData.append('congnghemanhinh', form.congnghemanhinh);
    formData.append('dophangiaimanhinh', form.dophangiaimanhinh);
    formData.append('pin', form.pin);
    formData.append('mota', form.mota);

    // Ảnh sản phẩm chính (nhiều ảnh)
    form.hinhanh.forEach((file) => {
      formData.append('hinhanh', file); // backend dùng upload.array('hinhanh')
    });

    // Chi tiết sản phẩm (dạng mảng)
    form.chiTietSanPham.forEach((detail, index) => {
      formData.append(`chiTietSanPham[${index}][mau]`, detail.mau);
      formData.append(`chiTietSanPham[${index}][dungluong]`, detail.dungluong);
      formData.append(`chiTietSanPham[${index}][ram]`, detail.ram);
      formData.append(`chiTietSanPham[${index}][soluong]`, detail.soluong);
      formData.append(`chiTietSanPham[${index}][gianhap]`, detail.gianhap);
      formData.append(`chiTietSanPham[${index}][giaban]`, detail.giaban);
      formData.append(`chiTietSanPham[${index}][khuyenmai]`, detail.khuyenmai || 0);
      formData.append(`chiTietSanPham[${index}][giagiam]`, detail.giagiam || 0);

      if (detail.hinhanhchitiet) {
        formData.append('hinhanhchitiet', detail.hinhanhchitiet); // chỉ dùng chung 1 tên field!
      }
    });
    try {
      // Gửi lên server
      const success = await productService.createProduct(formData);
      if (success) {
        onSave(form);
        onClose(); // đóng modal nếu thành công
      }
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  // const handleSaveDetail = (newDetail) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     chiTietSanPham: [...prev.chiTietSanPham, newDetail]
  //   }));
  // };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" mb={2}>
            {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="contained" component="label" disabled={isView}>
                Tải ảnh
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
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
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {!isView && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isView}>
                <InputLabel id="brand-label">Thương hiệu</InputLabel>
                <Select
                  labelId="brand-label"
                  name="mathuonghieu"
                  value={form.mathuonghieu}
                  label="Thương hiệu"
                  onChange={handleChange}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand.mathuonghieu} value={brand.mathuonghieu}>
                      {brand.tenthuonghieu}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                name="tensanpham"
                value={form.tensanpham}
                onChange={handleChange}
                disabled={isView}
                required
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


            {/* Chi tiết sản phẩm */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" mt={2} mb={1}>Chi tiết sản phẩm</Typography>
              {form.chiTietSanPham.map((detail, index) => (
                <Grid container spacing={2} key={index} alignItems="center" mb={2}>
                  <Grid item xs={12}>
                    <Button variant="contained" component="label" disabled={isView}>
                      Tải ảnh chi tiết
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleDetailChange(index, 'hinhanhchitiet', e.target.files[0])}
                      />
                    </Button>
                    {detail.hinhanhchitiet && (
                      <Box mt={2} position="relative" width={100} height={100} borderRadius={2} overflow="hidden" border="1px solid #ccc">
                        <img
                          src={
                            typeof detail.hinhanhchitiet === "string"
                              ? detail.hinhanhchitiet // ảnh từ server
                              : URL.createObjectURL(detail.hinhanhchitiet) // ảnh vừa chọn
                          }
                          alt={`detail-${index}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        {!isView && (
                          <IconButton
                            size="small"
                            onClick={() => handleDetailChange(index, 'hinhanhchitiet', null)} // Xóa ảnh
                            sx={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              bgcolor: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="Màu" value={detail.mau} onChange={(e) => handleDetailChange(index, 'mau', e.target.value)} disabled={isView} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="Dung lượng" value={detail.dungluong} onChange={(e) => handleDetailChange(index, 'dungluong', e.target.value)} disabled={isView} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="RAM" value={detail.ram} onChange={(e) => handleDetailChange(index, 'ram', e.target.value)} disabled={isView} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="Số lượng" value={detail.soluong} onChange={(e) => handleDetailChange(index, 'soluong', e.target.value)} disabled={isView} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="Giá nhập" type="number" value={detail.gianhap} onChange={(e) => handleDetailChange(index, 'gianhap', e.target.value)} disabled={isView} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="Giá bán" type="number" value={detail.giaban} onChange={(e) => handleDetailChange(index, 'giaban', e.target.value)} disabled={isView} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Khuyến mãi"
                      type="number"
                      value={detail.khuyenmai}
                      onChange={(e) => handleDetailChange(index, 'khuyenmai', e.target.value)}
                      disabled={isView}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Giá giảm"
                      type="number"
                      value={detail.giagiam}
                      disabled
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  {!isView && (
                    <Grid>
                      <IconButton onClick={() => removeDetail(index)} disabled={form.chiTietSanPham.length === 1}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              ))}
              {!isView && <Button startIcon={<AddIcon />} onClick={addDetail}>Thêm chi tiết</Button>}
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            {!isView && (
              <Button variant="contained" onClick={handleSubmit}>
                Lưu
              </Button>
            )}
            <Button variant="outlined" color="error" onClick={onClose}>
              Huỷ
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* <CreateProductDetailModal
      open={detailModalOpen}
      onClose={() => setDetailModalOpen(false)}
      onSave={handleSaveDetail}
    /> */}
    </>
  );
};

export default ProductFormModal;