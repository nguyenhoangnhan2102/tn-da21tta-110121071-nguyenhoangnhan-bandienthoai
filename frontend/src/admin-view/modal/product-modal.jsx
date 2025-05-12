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
  maxHeight: '90vh',
  overflowY: 'auto',
  width: 800,
};

const ProductFormModal = ({ open, onClose, isView, product, onSubmit }) => {
  const initialFormState = {
    mathuonghieu: '',
    tensanpham: '',
    hinhanh: [],
    hedieuhanh: '',
    ram: '',
    cpu: '',
    gpu: '',
    cameratruoc: '',
    camerasau: '',
    congnghemanhinh: '',
    dophangiaimanhinh: '',
    pin: '',
    mota: '',
    chiTietSanPham: [{ mau: '', dungluong: '', soluong: '', gia: '' }],
  };

  const [form, setForm] = useState(initialFormState);
  const [previewImages, setPreviewImages] = useState([]);
  const [brands, setBrands] = useState([]);

  // Giả lập danh sách thương hiệu, bạn có thể thay bằng API gọi danh sách thương hiệu
  useEffect(() => {
    const fetchBrands = async () => {
      // Thay bằng API thực tế nếu có
      const mockBrands = [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Samsung' },
        { id: 3, name: 'Xiaomi' },
      ];
      setBrands(mockBrands);
    };
    fetchBrands();
  }, []);

  // Load dữ liệu sản phẩm khi chỉnh sửa/xem
  useEffect(() => {
    if (product) {
      setForm({
        mathuonghieu: product.mathuonghieu || '',
        tensanpham: product.tensanpham || '',
        hinhanh: product.hinhanh || [],
        hedieuhanh: product.hedieuhanh || '',
        ram: product.ram || '',
        cpu: product.cpu || '',
        gpu: product.gpu || '',
        cameratruoc: product.cameratruoc || '',
        camerasau: product.camerasau || '',
        congnghemanhinh: product.congnghemanhinh || '',
        dophangiaimanhinh: product.dophangiaimanhinh || '',
        pin: product.pin || '',
        mota: product.mota || '',
        chiTietSanPham: product.chiTietSanPham || [{ mau: '', dungluong: '', soluong: '', gia: '' }],
      });
      setPreviewImages(product.hinhanh || []);
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
    setPreviewImages((prev) => [...prev, ...newImages]);
    setForm((prev) => ({ ...prev, hinhanh: [...prev.hinhanh, ...files] }));
  };

  const handleRemoveImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      hinhanh: prev.hinhanh.filter((_, i) => i !== index),
    }));
  };

  const handleDetailChange = (index, field, value) => {
    setForm((prev) => {
      const newDetails = [...prev.chiTietSanPham];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return { ...prev, chiTietSanPham: newDetails };
    });
  };

  const addDetail = () => {
    setForm((prev) => ({
      ...prev,
      chiTietSanPham: [...prev.chiTietSanPham, { mau: '', dungluong: '', soluong: '', gia: '' }],
    }));
  };

  const removeDetail = (index) => {
    setForm((prev) => ({
      ...prev,
      chiTietSanPham: prev.chiTietSanPham.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
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
          {isView ? 'Xem chi tiết sản phẩm' : product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </Typography>

        <Grid container spacing={2}>
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
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
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

          <Grid item xs={12}>
            <Typography variant="subtitle1" mt={2} mb={1}>
              Chi tiết sản phẩm
            </Typography>
            {form.chiTietSanPham.map((detail, index) => (
              <Grid container spacing={1} key={index} alignItems="center" mb={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Màu"
                    value={detail.mau}
                    onChange={(e) => handleDetailChange(index, 'mau', e.target.value)}
                    disabled={isView}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Dung lượng"
                    value={detail.dungluong}
                    onChange={(e) => handleDetailChange(index, 'dungluong', e.target.value)}
                    disabled={isView}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Số lượng"
                    type="number"
                    value={detail.soluong}
                    onChange={(e) => handleDetailChange(index, 'soluong', e.target.value)}
                    disabled={isView}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Giá"
                    type="number"
                    value={detail.gia}
                    onChange={(e) => handleDetailChange(index, 'gia', e.target.value)}
                    disabled={isView}
                  />
                </Grid>
                {!isView && (
                  <Grid item xs={12} sm={2}>
                    <IconButton onClick={() => removeDetail(index)} disabled={form.chiTietSanPham.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
            {!isView && (
              <Button startIcon={<AddIcon />} onClick={addDetail}>
                Thêm chi tiết
              </Button>
            )}
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
  );
};

export default ProductFormModal;