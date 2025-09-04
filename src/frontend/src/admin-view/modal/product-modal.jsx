/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  TextField,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import ModalManufacturer from "./manufacturer-modal";
import { createManufacturer, getAllManufacturer } from "../../services/manufacturerService";
import ReduxStateExport from "../../redux/redux-state";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
  maxHeight: "95vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const imgURL = process.env.REACT_APP_IMG_URL;

const defaultForm = {
  mathuonghieu: "",
  tensanpham: "",
  hinhanh: "",
  mau: "",
  dungluong: "",
  ram: "",
  hedieuhanh: "",
  soluong: "",
  gianhap: "",
  giaban: "",
  khuyenmai: 0,
  cpu: "",
  gpu: "",
  pin: "",
  cameratruoc: "",
  camerasau: "",
  congnghemanhinh: "",
  dophangiaimanhinh: "",
  mota: "",
  tenthuonghieu: "",
  trangthai: 1,
};

const ModalProduct = ({ product, onSave, open, onClose, isViewOnly = false }) => {
  const [listManufacturer, setListManufacturer] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const { userInfo } = ReduxStateExport();
  console.log("product", product)
  // Fetch manufacturer
  const getAllManufacturerData = useCallback(async () => {
    try {
      const response = await getAllManufacturer();
      if (response?.DT) {
        setListManufacturer(response.DT.activeManufacturer || []);
      }
    } catch (error) {
      console.error("Error fetching manufacturer", error);
    }
  }, []);

  // Reset form khi mở modal
  // ...
  // Reset form khi mở modal
  useEffect(() => {
    // Tạo một bản sao của product hoặc defaultForm
    const initialForm = { ...(product || defaultForm) };

    // Nếu hinhanh là chuỗi (từ DB), chuyển nó thành mảng
    if (typeof initialForm.hinhanh === 'string' && initialForm.hinhanh) {
      initialForm.hinhanh = initialForm?.hinhanh?.split(',');
    } else {
      initialForm.hinhanh = []; // Đảm bảo luôn là mảng rỗng nếu không có
    }

    setForm(initialForm);
    getAllManufacturerData();
  }, [product, getAllManufacturerData]);
  // ...

  // Tính giá sau khuyến mãi
  useEffect(() => {
    const giaban = parseFloat(form.giaban) || 0;
    const khuyenmai = parseFloat(form.khuyenmai) || 0;
    setFinalPrice(giaban - (giaban * khuyenmai) / 100);
  }, [form.giaban, form.khuyenmai]);

  // Handle form
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu là gianhap hoặc giaban thì chỉ giữ số
    if (name === "gianhap" || name === "giaban") {
      // Loại bỏ tất cả ký tự không phải số
      const numericValue = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    // Lấy toàn bộ danh sách các tệp tin đã chọn
    const files = e.target.files;

    // Chuyển đổi FileList thành một mảng và cập nhật state 'hinhanh'
    setForm((prev) => ({
      ...prev,
      hinhanh: [...files],
    }));
  };

  const handleSubmit = () => {
    onSave(form);
    setForm(defaultForm);
  };

  // Manufacturer modal
  const handleSave = async (manufacturer) => {
    try {
      await createManufacturer(manufacturer);
      toast.success("Tạo mới thành công!!!");
      setSelectedManufacturer(null);
      setOpenModal(false);
      getAllManufacturerData();
    } catch (error) {
      console.error("Error saving manufacturer:", error);
    }
  };

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }
    // Nếu là một đối tượng File mới được chọn
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    // Nếu là một chuỗi URL từ server
    if (typeof image === 'string') {
      return `${imgURL}${image}`;
    }
    return "";
  };

  const imageUrls = (() => {
    if (typeof form.hinhanh === 'string' && form.hinhanh) {
      // Nếu là chuỗi, tách ra thành mảng và map
      return form?.hinhanh?.split(',').map(name => getImageUrl(name));
    }
    if (Array.isArray(form.hinhanh)) {
      // Nếu là mảng, map như bình thường
      return form.hinhanh.map(file => getImageUrl(file));
    }
    return [];
  })();

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6">
            {product ? "Cập nhật" : "Tạo mới"}
          </Typography>

          {/* Tên sản phẩm */}
          <TextField
            fullWidth
            margin="normal"
            label="Tên"
            name="tensanpham"
            value={form.tensanpham}
            onChange={handleChange}
            disabled={isViewOnly}
          />
          {console.log(form)}
          {/* Ảnh sản phẩm */}
          {imageUrls.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 1 }}>
              {imageUrls.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={form.tensanpham}
                  width="100"
                  height="100"
                  style={{ borderRadius: '8px', objectFit: 'cover' }}
                />
              ))}
            </Box>
          )}
          {!isViewOnly && (
            <Box sx={{ my: 1 }}>
              <input
                type="file"
                name="hinhanh"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                style={{
                  width: "100%",
                  padding: "16.5px 14px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                }}
              />
            </Box>
          )}

          {/* Thương hiệu + HĐH */}
          <div className="d-flex gap-2 align-items-center">
            <FormControl fullWidth margin="normal">
              <InputLabel>Thương hiệu</InputLabel>
              <Select
                name="mathuonghieu"
                value={form.mathuonghieu}
                label="Thương hiệu"
                onChange={handleChange}
                disabled={isViewOnly}
              >
                {listManufacturer.map((m) => (
                  <MenuItem key={m.mathuonghieu} value={m.mathuonghieu}>
                    {m.tenthuonghieu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!isViewOnly && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  setSelectedManufacturer(null);
                  setOpenModal(true);
                }}
                style={{ height: "100%" }}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Hệ điều hành"
              name="hedieuhanh"
              value={form.hedieuhanh}
              onChange={handleChange}
              disabled={isViewOnly}
            />
          </div>

          {/* Các trường nhóm */}
          <div className="d-flex gap-2">
            <TextField fullWidth margin="normal" label="RAM" name="ram" value={form.ram} onChange={handleChange} disabled={isViewOnly} />
            <TextField fullWidth margin="normal" label="Dung lượng" name="dungluong" value={form.dungluong} onChange={handleChange} disabled={isViewOnly} />
            <TextField fullWidth margin="normal" label="Pin" name="pin" value={form.pin} onChange={handleChange} disabled={isViewOnly} />
          </div>

          <div className="d-flex gap-2">
            <TextField fullWidth margin="normal" label="Màu" name="mau" value={form.mau} onChange={handleChange} disabled={isViewOnly} />
            <TextField fullWidth margin="normal" label="Số lượng" type="number" name="soluong" value={form.soluong} onChange={handleChange} disabled={isViewOnly} />
            <TextField fullWidth margin="normal" label="Giá nhập" type="text" name="gianhap" value={form.gianhap ? Number(form.gianhap).toLocaleString("vi-VN") : ""} onChange={handleChange} disabled={isViewOnly} InputProps={{
              endAdornment: <InputAdornment position="end">đ</InputAdornment>,
            }} />
          </div>

          <div className="d-flex gap-2">
            <TextField fullWidth margin="normal" label="Giá bán" type="text" name="giaban" value={form.giaban ? Number(form.giaban).toLocaleString("vi-VN") : ""} onChange={handleChange} disabled={isViewOnly}
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }} />
            <TextField
              fullWidth
              margin="normal"
              label="Giá sau khuyến mãi"
              value={finalPrice.toLocaleString("vi-VN")} // chỉ hiển thị
              disabled={isViewOnly}
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }}
            />
            <TextField fullWidth margin="normal" label="Khuyến mãi (%)" type="number" name="khuyenmai" value={form.khuyenmai} onChange={handleChange} disabled={isViewOnly} />
          </div>

          <div className="d-flex gap-2">
            <TextField fullWidth margin="normal" label="CPU" name="cpu" value={form.cpu} onChange={handleChange} disabled={isViewOnly} />
            <TextField fullWidth margin="normal" label="GPU" name="gpu" value={form.gpu} onChange={handleChange} disabled={isViewOnly} />
          </div>

          <div className="d-flex gap-2">
            <TextField fullWidth margin="normal" label="Camera trước" name="cameratruoc" value={form.cameratruoc} onChange={handleChange} disabled={isViewOnly} />
            <TextField fullWidth margin="normal" label="Camera sau" name="camerasau" value={form.camerasau} onChange={handleChange} disabled={isViewOnly} />
          </div>

          <div className="d-flex gap-2">
            <TextField fullWidth margin="normal" label="Công nghệ màn hình" name="congnghemanhinh" value={form.congnghemanhinh} onChange={handleChange} disabled={isViewOnly} />
            <TextField fullWidth margin="normal" label="Độ phân giải màn hình" name="dophangiaimanhinh" value={form.dophangiaimanhinh} onChange={handleChange} disabled={isViewOnly} />
          </div>

          <TextField
            fullWidth
            margin="normal"
            label="Mô tả"
            name="mota"
            value={form.mota}
            onChange={handleChange}
            disabled={isViewOnly}
            multiline
            rows={4}
          />

          {/* {product && ( */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="trangthai"
              value={form.trangthai}
              onChange={handleChange}
              disabled={isViewOnly || userInfo?.role === 2} // ✅ chỉ 1 dòng
              label="Trạng thái"
            >
              <MenuItem value={1}>Chưa duyệt</MenuItem>
              <MenuItem value={0}>Duyệt</MenuItem>
            </Select>
          </FormControl>
          {/* )} */}

          <Box mt={2} display="flex" justifyContent="flex-end" gap="5px">
            {userInfo?.role === 1 && form.trangthai === 1 && (
              <button
                className="btn btn-success admin-btn"
                onClick={() => {
                  const approvedForm = { ...form, trangthai: 0 };
                  onSave(approvedForm);
                  setForm(defaultForm);
                }}
              >
                <i className="fa-solid fa-check me-1"></i>Duyệt
              </button>
            )}
            {!isViewOnly && (
              <button className="btn btn-primary admin-btn" onClick={handleSubmit}>
                <i className="fa-regular fa-floppy-disk me-1"></i>Lưu
              </button>
            )}
            <button className="btn btn-danger admin-btn" onClick={onClose}>
              <i className="fa-solid fa-x me-1"></i>Huỷ
            </button>
          </Box>
        </Box>
      </Modal>

      {/* Modal thêm thương hiệu */}
      <ModalManufacturer
        manufacturer={selectedManufacturer}
        open={openModal}
        onSave={handleSave}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default ModalProduct;
