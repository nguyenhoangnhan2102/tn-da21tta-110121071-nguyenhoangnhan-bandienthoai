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
    trangthai: 0,
    mota: '',
    chiTietSanPham: [
      {
        dungluong: '',
        ram: '',
        mausac: [
          {
            mau: '',
            giaban: '',
            gianhap: '',
            giagiam: '',
            khuyenmai: '',
            trangthai: 0,
            soluong: '',
            hinhanhchitiet: null,
          }
        ]
      }
    ]
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

      const originalImages = typeof product.hinhanh === 'string'
        ? product.hinhanh.split(',').map((img) => img.trim())
        : product.hinhanh || [];

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
        // hinhanh: product.hinhanh || [],
        hinhanh: originalImages, // 👈 không phải preview link mà là tên gốc để giữ state
        hedieuhanh: product.hedieuhanh || '',
        cpu: product.cpu || '',
        gpu: product.gpu || '',
        cameratruoc: product.cameratruoc || '',
        camerasau: product.camerasau || '',
        congnghemanhinh: product.congnghemanhinh || '',
        dophangiaimanhinh: product.dophangiaimanhinh || '',
        pin: product.pin || '',
        // trangthai: product.trangthai !== undefined ? product.trangthai : 0,
        trangthai: product.trangthai === "Hoạt động" ? 0
          : product.trangthai === "Không hoạt động" ? 1
            : Number(product.trangthai) || 0,
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

  const handleDungLuongChange = (dlIndex, field, value) => {
    const updated = [...form.chiTietSanPham];
    updated[dlIndex][field] = value;
    setForm({ ...form, chiTietSanPham: updated });
  };

  const handleMauChange = (dlIndex, msIndex, field, value) => {
    const updated = [...form.chiTietSanPham];
    updated[dlIndex].mausac[msIndex][field] = value;

    // Nếu field là 'giaban' hoặc 'khuyenmai' thì tính giá giảm
    const { giaban, khuyenmai } = updated[dlIndex].mausac[msIndex];
    if (field === 'giaban' || field === 'khuyenmai') {
      const gia = parseFloat(field === 'giaban' ? value : giaban);
      const km = parseFloat(field === 'khuyenmai' ? value : khuyenmai);
      if (!isNaN(gia) && !isNaN(km)) {
        updated[dlIndex].mausac[msIndex].giagiam = gia - (gia * km / 100);
      }
    }

    setForm({ ...form, chiTietSanPham: updated });
  };

  const addMau = (dlIndex) => {
    const updated = [...form.chiTietSanPham];
    updated[dlIndex].mausac.push({
      mau: '', giaban: '', gianhap: '', giagiam: '', khuyenmai: '', trangthai: 0, soluong: '', hinhanhchitiet: null
    });
    setForm({ ...form, chiTietSanPham: updated });
  };

  const addDungLuong = () => {
    setForm((prev) => ({
      ...prev,
      chiTietSanPham: [...prev.chiTietSanPham, {
        dungluong: '',
        ram: '',
        mausac: [{
          mau: '', giaban: '', gianhap: '', giagiam: '', khuyenmai: '', trangthai: 0, soluong: '', hinhanhchitiet: null
        }]
      }]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Danh sách File vừa upload
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...newPreviews]); // Gộp ảnh preview

    setForm((prev) => ({
      ...prev,
      hinhanh: [...prev.hinhanh, ...files], // Gộp vào mảng hinhanh (File[])
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setForm((prev) => ({
      ...prev,
      hinhanh: prev.hinhanh.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // 1. Ảnh đại diện (ảnh chính)
    form.hinhanh.forEach((file) => {
      if (file instanceof File) {
        formData.append("hinhanh", file);
      }
    });

    // 2. Các trường cơ bản
    [
      "mathuonghieu", "tensanpham", "hedieuhanh", "cpu", "gpu",
      "cameratruoc", "camerasau", "congnghemanhinh", "dophangiaimanhinh",
      "pin", "trangthai", "mota"
    ].forEach((key) => {
      formData.append(key, form[key]);
    });

    // 3. Chuẩn bị chi tiết sản phẩm
    const dungluongList = form.chiTietSanPham.map((dl) => {
      const colors = dl.mausac.map((ms) => {
        // Ảnh chi tiết - nếu là file thì thêm vào formData
        if (ms.hinhanhchitiet instanceof File) {
          const fileName = `${ms.mau}_${Date.now()}_${ms.hinhanhchitiet.name}`;
          formData.append("hinhanhchitiet", ms.hinhanhchitiet, fileName);
          return {
            ...ms,
            hinhanhchitiet: fileName, // Gửi tên ảnh vào JSON để backend nhận biết
          };
        } else {
          return {
            ...ms,
            hinhanhchitiet: ms.hinhanhchitiet, // Trường hợp cập nhật, giữ nguyên chuỗi
          };
        }
      });

      return {
        dungluong: dl.dungluong,
        ram: dl.ram,
        colors,
      };
    });

    // 4. Thêm danh sách dung lượng và màu sắc (dưới dạng JSON)
    formData.append("dungluongList", JSON.stringify(dungluongList));

    try {
      const success = product
        ? await productService.updateProduct(product.masanpham, formData)
        : await productService.createProduct(formData);

      toast.success(product ? 'Cập nhật thành công!' : 'Tạo sản phẩm thành công!');
      if (success) {
        onSave(form);
        onClose();
      }
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      toast.error("Đã có lỗi xảy ra.");
    }
  };

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

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Hệ điều hành"
                name="hedieuhanh"
                value={form.hedieuhanh}
                onChange={handleChange}
                disabled={isView}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CPU"
                name="cpu"
                value={form.cpu}
                onChange={handleChange}
                disabled={isView}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isView}>
                <InputLabel id="trangthai-label">Trạng thái</InputLabel>
                <Select
                  labelId="trangthai-label"
                  name="trangthai"
                  value={form.trangthai}
                  label="Trạng thái"
                  onChange={handleChange}
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
                name="mota"
                value={form.mota}
                onChange={handleChange}
                disabled={isView}
                multiline
                rows={3}
              />
            </Grid>
            <Typography variant="subtitle1" mt={2} mb={1}>Chi tiết sản phẩm</Typography>
            {form.chiTietSanPham.map((dlItem, dlIndex) => (
              <Box key={dlIndex} border="1px solid #ddd" p={2} mb={2} borderRadius={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Dung lượng" value={dlItem.dungluong}
                      onChange={(e) => handleDungLuongChange(dlIndex, 'dungluong', e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="RAM" value={dlItem.ram}
                      onChange={(e) => handleDungLuongChange(dlIndex, 'ram', e.target.value)} />
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" mt={2}>Các màu sắc:</Typography>
                {dlItem.mausac.map((ms, msIndex) => (
                  <Grid container spacing={2} key={msIndex} alignItems="center" mt={1}>
                    <Grid item xs={12}>
                      <Button variant="contained" component="label">
                        Ảnh chi tiết
                        <input type="file" hidden accept="image/*"
                          onChange={(e) =>
                            handleMauChange(dlIndex, msIndex, 'hinhanhchitiet', e.target.files[0])
                          }
                        />
                      </Button>
                      {ms.hinhanhchitiet && (
                        <Box mt={1}>
                          <img
                            src={typeof ms.hinhanhchitiet === "string"
                              ? ms.hinhanhchitiet
                              : URL.createObjectURL(ms.hinhanhchitiet)}
                            alt="ảnh"
                            style={{ width: 100, height: 100, objectFit: 'cover' }}
                          />
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      <TextField fullWidth label="Màu" value={ms.mau}
                        onChange={(e) => handleMauChange(dlIndex, msIndex, 'mau', e.target.value)} />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField fullWidth label="Số lượng"
                        value={ms.soluong}
                        onChange={(e) => handleMauChange(dlIndex, msIndex, 'soluong', e.target.value)} />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Giá bán"
                        value={ms.giaban}
                        onChange={(e) => handleMauChange(dlIndex, msIndex, 'giaban', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Giá nhập"
                        value={ms.gianhap}
                        onChange={(e) => handleMauChange(dlIndex, msIndex, 'gianhap', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField fullWidth label="Khuyến mãi (%)"
                        value={ms.khuyenmai}
                        onChange={(e) => handleMauChange(dlIndex, msIndex, 'khuyenmai', e.target.value)} />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        label="Giá giảm"
                        value={ms.giagiam}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
                ))}
                <Button size="small" onClick={() => addMau(dlIndex)} startIcon={<AddIcon />}>
                  Thêm màu
                </Button>
              </Box>
            ))}

            <Button onClick={addDungLuong} startIcon={<AddIcon />}>
              Thêm dung lượng mới
            </Button>
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
    </>
  );
};

export default ProductFormModal;