/* ModalProduct.jsx */
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import brandService from "../../services/brandService";

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

const initForm = {
  mathuonghieu: "",
  tensanpham: "",
  mau: "",
  dungluong: "",
  ram: "",
  hedieuhanh: "",
  soluong: 0,
  gianhap: 0,
  giaban: 0,
  giagiam: 0,
  khuyenmai: "",
  cpu: "",
  gpu: "",
  cameratruoc: "",
  camerasau: "",
  congnghemanhinh: "",
  dophangiaimanhinh: "",
  pin: "",
  mota: "",
  trangthai: 0,
};

export default function ModalProduct({ open, onClose, onSave }) {
  const [form, setForm] = useState(initForm);
  const [images, setImages] = useState([]);             // ⬅️ chứa File[]
  const [brands, setBrands] = useState([]);

  /* ─────────────────────────────────── Lấy danh sách brand ─────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await brandService.getAllBrand();
        setBrands(res?.active ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Không lấy được danh sách thương hiệu");
      }
    })();
  }, []);

  /* ─────────────────────────────────── Handlers ─────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));              // có thể chọn lại để thay
  };

  const handleSubmit = () => {
    /* Front-end validate nhanh */
    if (!form.tensanpham.trim()) {
      toast.warning("Tên sản phẩm không được để trống");
      return;
    }
    if (images.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }

    /* Chuẩn bị FormData khớp API */
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach((file) => fd.append("hinhanh", file));     // ⬅️ nhiều file

    onSave(fd);   // callback từ cha (thường sẽ gọi service POST)
    setForm(initForm);
    setImages([]);
  };

  /* ─────────────────────────────────── Helpers ─────────────────────────────────── */
  const imagePreviews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  );

  /* ─────────────────────────────────── UI ─────────────────────────────────── */
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-product-title">
      <Box sx={modalStyle}>
        <Typography id="modal-product-title" variant="h6" mb={2}>
          Tạo mới sản phẩm
        </Typography>

        {/* TÊN + THƯƠNG HIỆU + MÀU */}
        <TextField
          label="Tên sản phẩm"
          fullWidth
          margin="normal"
          name="tensanpham"
          value={form.tensanpham}
          onChange={handleChange}
        />

        <Stack direction="row" spacing={2} mb={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="brand-label">Thương hiệu</InputLabel>
            <Select
              labelId="brand-label"
              label="Thương hiệu"
              name="mathuonghieu"
              value={form.mathuonghieu}
              onChange={handleChange}
            >
              {brands.map((b) => (
                <MenuItem key={b.mathuonghieu} value={b.mathuonghieu}>
                  {b.tenthuonghieu}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Màu sắc"
            name="mau"
            value={form.mau}
            onChange={handleChange}
          />
        </Stack>

        {/* GIÁ & SỐ LƯỢNG */}
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Giá nhập"
            type="number"
            fullWidth
            margin="normal"
            name="gianhap"
            value={form.gianhap}
            onChange={handleChange}
          />
          <TextField
            label="Giá bán"
            type="number"
            fullWidth
            margin="normal"
            name="giaban"
            value={form.giaban}
            onChange={handleChange}
          />
          <TextField
            label="Giá giảm"
            type="number"
            fullWidth
            margin="normal"
            name="giagiam"
            value={form.giagiam}
            onChange={handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2} mb={2}>

          <TextField
            label="Khuyến mãi"
            type="number"
            fullWidth
            margin="normal"
            name="khuyenmai"
            value={form.khuyenmai}
            onChange={handleChange}
          />
          <TextField
            label="Số lượng"
            type="number"
            fullWidth
            margin="normal"
            name="soluong"
            value={form.soluong}
            onChange={handleChange}
          />
        </Stack>

        {/* THÔNG SỐ KỸ THUẬT (CPU, GPU,…) */}
        <Stack direction="row" spacing={2} mb={2}>
          <TextField label="CPU" fullWidth margin="normal" name="cpu" value={form.cpu} onChange={handleChange} />
          <TextField label="GPU" fullWidth margin="normal" name="gpu" value={form.gpu} onChange={handleChange} />
        </Stack>

        <Stack direction="row" spacing={2} mb={2}>
          <TextField label="RAM" fullWidth margin="normal" name="ram" value={form.ram} onChange={handleChange} />
          <TextField label="Dung lượng" fullWidth margin="normal" name="dungluong" value={form.dungluong} onChange={handleChange} />
        </Stack>

        <Stack direction="row" spacing={2} mb={2}>
          <TextField label="Camera trước" fullWidth margin="normal" name="cameratruoc" value={form.cameratruoc} onChange={handleChange} />
          <TextField label="Camera sau" fullWidth margin="normal" name="camerasau" value={form.camerasau} onChange={handleChange} />
        </Stack>

        <Stack direction="row" spacing={2} mb={2}>
          <TextField label="Công nghệ MH" fullWidth margin="normal" name="congnghemanhinh" value={form.congnghemanhinh} onChange={handleChange} />
          <TextField label="Độ phân giải MH" fullWidth margin="normal" name="dophangiaimanhinh" value={form.dophangiaimanhinh} onChange={handleChange} />
        </Stack>

        <TextField
          label="Pin"
          fullWidth
          margin="normal"
          name="pin"
          value={form.pin}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="trangthai-label">Trạng thái</InputLabel>
          <Select
            labelId="trangthai-label"
            label="Trạng thái"
            name="trangthai"
            value={form.trangthai}
            onChange={handleChange}
          >
            <MenuItem value={0}>Hoạt động</MenuItem>
            <MenuItem value={1}>Không hoạt động</MenuItem>
          </Select>
        </FormControl>


        {/* MÔ TẢ */}
        <TextField
          label="Mô tả"
          multiline
          rows={3}
          fullWidth
          margin="normal"
          name="mota"
          value={form.mota}
          onChange={handleChange}
        />

        {/* UPLOAD NHIỀU ẢNH */}
        <Box mt={2}>
          <input
            type="file"
            name="hinhanh"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ marginBottom: 8 }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {imagePreviews.map((src, i) => (
              <img key={i} src={src} alt="preview" width={80} height={80} style={{ objectFit: "cover", borderRadius: 4 }} />
            ))}
          </Stack>
        </Box>

        {/* ACTIONS */}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Lưu
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
