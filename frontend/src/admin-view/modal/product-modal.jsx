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
import DeleteIcon from '@mui/icons-material/Delete';
import productService from '../../services/productService';
import { toast } from 'react-toastify';
import { ReactSortable } from 'react-sortablejs';
import brandService from '../../services/brandService';

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
  console.log("product", product);
  useEffect(() => {
    fetchBrands();

    if (product) {
      setForm({
        mathuonghieu: product.mathuonghieu || '',
        tensanpham: product.tensanpham || '',
        mau: product.mau || '',
        dungluong: product.dungluong || '',
        ram: product.ram || '',
        hedieuhanh: product.hedieuhanh || '',
        soluong: product.soluong || '',
        giatien: product.giatien || '',
        cpu: product.cpu || '',
        gpu: product.gpu || '',
        cameratruoc: product.cameratruoc || '',
        camerasau: product.camerasau || '',
        congnghemanhinh: product.congnghemanhinh || '',
        dophangiaimanhinh: product.dophangiaimanhinh || '',
        pin: product.pin || '',
        mota: product.mota || '',
      });

      // Load ảnh cũ
      if (product.hinhanh) {
        const imageFilenames = product.hinhanh.split(',');
        const imageFiles = imageFilenames.map(filename => ({
          name: filename,
          preview: `${imageBaseUrl}/${filename}`, // sử dụng url ảnh từ server
          isOld: true, // flag để biết là ảnh cũ
        }));
        setFiles(imageFiles);
      }
    } else {
      setForm(initialFormState);
      setFiles([]);
    }
  }, [product]);


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
        if (!file.isOld) {
          formData.append("hinhanh", file); // chỉ gửi file mới
        }
      });

      if (product) {
        const res = await productService.updateProduct(product.masanpham, formData);
        console.log(res);
        toast.success("Cập nhật thành công!");
      } else {
        await productService.createProduct(formData);
        toast.success("Tạo mới thành công!")
      }
      onSave(form);
      onClose();
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
              <ReactSortable
                list={files}
                setList={setFiles}
                animation={150}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 8,
                  overflowX: 'auto', // cho phép cuộn ngang nếu vượt chiều rộng
                  padding: 4,
                }}
              >
                {files.map((file, index) => (
                  <Box
                    key={file.name + file.size}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid #ccc',
                      flex: '0 0 auto', // ảnh không bị co lại
                    }}
                  >
                    <img
                      src={file.preview || URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.7)', color: '#fff' },
                      }}
                      onClick={() => {
                        setFiles((prev) => prev.filter((_, i) => i !== index));
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </ReactSortable>
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
