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
import { toast } from 'react-toastify';
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

// ... Các import như trước

const ProductFormModal = ({ open, onClose, onSave, isView, product, imageBaseUrl }) => {
  const initialFormState = {
    mathuonghieu: '',
    tensanpham: '',
    mau: '',
    dungluong: '',
    ram: '',
    hinhanh: [],
    hedieuhanh: '',
    soluong: '',
    giatien: '',
    cpu: '',
    gpu: '',
    cameratruoc: '',
    camerasau: '',
    congnghemanhinh: '',
    dophangiaimanhinh: '',
    pin: '',
    mota: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [brands, setBrands] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await brandService.getAllBrand();
      setBrands(response?.active || []);
      console.log('Active brands:', response?.active); // debug
    } catch {
      console.error("Lỗi lấy thương hiệu!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => {
      const newFiles = selectedFiles.filter(file =>
        !prevFiles.some(prev => prev.name === file.name && prev.size === file.size)
      );
      return [...prevFiles, ...newFiles];
    });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      files.forEach((file) => {
        formData.append("hinhanh", file);
      });

      if (product) {
        await brandService.updateBrand(product.masanpham, formData);
        toast.success("Cập nhật thành công!")
      } else {
        await brandService.createBrand(formData);
        toast.success("Tạo mới thành công!")
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi tạo sản phẩm");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" component="label">
              Tải ảnh
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
          {files.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Ảnh đã chọn:</Typography>
              <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                {files.map((file, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isView}>
              <InputLabel id="brand-label">Thương hiệu</InputLabel>
              <Select
                labelId="brand-label"
                name="mathuonghieu"
                label="Thương hiệu"
                value={form.mathuonghieu}
                onChange={handleInputChange}
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
            <TextField fullWidth label="Tên sản phẩm" name="tensanpham" value={form.tensanpham} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Màu" name="mau" value={form.mau} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Dung lượng" name="dungluong" value={form.dungluong} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="RAM" name="ram" value={form.ram} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField type="number" fullWidth label="Số lượng" name="soluong" value={form.soluong} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField type="number" fullWidth label="Giá tiền" name="giatien" value={form.giatien} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Hệ điều hành" name="hedieuhanh" value={form.hedieuhanh} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="CPU" name="cpu" value={form.cpu} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="GPU" name="gpu" value={form.gpu} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Camera trước" name="cameratruoc" value={form.cameratruoc} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Camera sau" name="camerasau" value={form.camerasau} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Công nghệ màn hình" name="congnghemanhinh" value={form.congnghemanhinh} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Độ phân giải màn hình" name="dophangiaimanhinh" value={form.dophangiaimanhinh} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Pin" name="pin" value={form.pin} onChange={handleInputChange} disabled={isView} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Mô tả" name="mota" multiline rows={3} value={form.mota} onChange={handleInputChange} disabled={isView} />
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
