/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import ModalManufacturer from "./manufacturer-modal";
import { createManufacturer, getAllManufacturer } from "../../services/manufacturerService";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "95vh", // Đặt chiều cao tối đa để tránh vượt quá màn hình
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Thêm thuộc tính này để có thanh cuộn dọc khi cần
};
const imgURL = process.env.REACT_APP_IMG_URL;

const ModalProduct = ({ product, onSave, open, onClose, isViewOnly = false }) => {
  const [listManufacturer, setListManufacturer] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    mathuonghieu: "",
    tensanpham: "",
    hinhanhchinh: "",
    mau: "",
    dungluong: "",
    ram: "",
    hedieuhanh: "",
    soluong: "",
    gianhap: "",
    giaban: "",
    giagiam: "",
    khuyenmai: "",
    cpu: "",
    gpu: "",
    pin: "",
    cameratruoc: "",
    camerasau: "",
    congnghemanhinh: "",
    dophangiaimanhinh: "",
    mota: "",
    tenthuonghieu: "",
    trangthai: "",
  });

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({
        mathuonghieu: "",
        tensanpham: "",
        hinhanhchinh: "",
        mau: "",
        dungluong: "",
        ram: "",
        hedieuhanh: "",
        soluong: "",
        gianhap: "",
        giaban: "",
        khuyenmai: "",
        cpu: "",
        gpu: "",
        pin: "",
        cameratruoc: "",
        camerasau: "",
        congnghemanhinh: "",
        dophangiaimanhinh: "",
        mota: "",
        tenthuonghieu: "",
        trangthai: 0,
      });
    }
    getAllManufacturerData();
  }, [product]);

  const getAllManufacturerData = async () => {
    try {
      const response = await getAllManufacturer();
      if (response) {
        setListManufacturer(response.DT.activeManufacturer || []); // Đảm bảo rằng `DT` luôn là một mảng
      } else {
        console.error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, hinhanhchinh: file })); // Cập nhật ảnh mới và xóa ảnh cũ
  };

  const imageSrc = form.hinhanhchinh instanceof File
    ? URL.createObjectURL(form.hinhanhchinh)
    : `${imgURL}${form.hinhanhchinh}`;

  const handleSubmit = () => {
    onSave(form);
    setForm({
      mathuonghieu: "",
      tensanpham: "",
      hinhanhchinh: "",
      mau: "",
      dungluong: "",
      ram: "",
      hedieuhanh: "",
      soluong: "",
      gianhap: "",
      giaban: "",
      khuyenmai: "",
      cpu: "",
      gpu: "",
      pin: "",
      cameratruoc: "",
      camerasau: "",
      congnghemanhinh: "",
      dophangiaimanhinh: "",
      mota: "",
      tenthuonghieu: "",
      trangthai: 0,
    });
  };

  const handleSave = async (manufacturer) => {
    try {

      const manufacturerData = {
        ...manufacturer,
      };

      await createManufacturer(manufacturerData); // Gọi API tạo mới
      toast.success("Tạo mới thành công!!!")

      setSelectedManufacturer(null);
      setOpenModal(false);
      getAllManufacturerData(); // Lấy lại danh sách 
    } catch (error) {
      console.error("Error saving hotel:", error);
    }
  };

  const handleCreate = () => {
    setSelectedManufacturer(null);
    setOpenModal(true);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      // hideBackdrop
      >
        <Box sx={modalStyle}>
          <Typography makhachhang="modal-title" variant="h6" component="h2">
            {product ? "Cập nhật" : "Tạo mới"}
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Tên"
            name="tensanpham"
            value={form.tensanpham}
            onChange={handleChange}
            disabled={isViewOnly}
          />
          <div className="d-flex gap-2 align-items-center">
            <FormControl fullWidth margin="normal">
              <InputLabel makhachhang="select-mathuonghieu-label">Thương hiệu</InputLabel>
              <Select
                labelId="select-mathuonghieu-label"
                name="mathuonghieu"
                label="Thương hiệu"
                value={form.mathuonghieu}
                onChange={handleChange}
                disabled={isViewOnly}
              >
                {listManufacturer.map((manufacturer) => (
                  <MenuItem key={manufacturer.mathuonghieu} value={manufacturer.mathuonghieu}>
                    {manufacturer.tenthuonghieu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!isViewOnly && (
              <button className="btn btn-sm btn-success mr-2" onClick={handleCreate} style={{ height: '100%' }}>
                <i className="fa-solid fa-plus"></i>
              </button>
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Hệ điều hành"
              type="text"
              name="hedieuhanh"
              value={form.hedieuhanh}
              onChange={handleChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="d-flex gap-2">
            <TextField
              fullWidth
              margin="normal"
              label="RAM"
              type="text"
              name="ram"
              value={form.ram}
              onChange={handleChange}
              disabled={isViewOnly}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Dung lượng"
              type="text"
              name="dungluong"
              value={form.dungluong}
              onChange={handleChange}
              disabled={isViewOnly}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Pin"
              type="text"
              name="pin"
              value={form.pin}
              onChange={handleChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="d-flex gap-2">
            <TextField
              fullWidth
              margin="normal"
              label="Màu"
              type="text"
              name="mau"
              value={form.mau}
              onChange={handleChange}
              disabled={isViewOnly}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Số lượng"
              type="number"
              name="soluong"
              value={form.soluong}
              onChange={handleChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="d-flex gap-2">
            <TextField
              fullWidth
              margin="normal"
              label="Giá nhập"
              type="number"
              name="gianhap"
              value={form.gianhap}
              onChange={handleChange}
              disabled={isViewOnly}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Giá bán"
              type="number"
              name="giaban"
              value={form.giaban}
              onChange={handleChange}
              disabled={isViewOnly}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Khuyến mãi"
              type="number"
              name="khuyenmai"
              value={form.khuyenmai}
              onChange={handleChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="d-flex gap-2">
            <TextField
              fullWidth
              margin="normal"
              label="CPU"
              type="text"
              name="cpu"
              value={form.cpu}
              onChange={handleChange}
              disabled={isViewOnly}
            />
            <TextField
              fullWidth
              margin="normal"
              label="GPU"
              type="text"
              name="gpu"
              value={form.gpu}
              onChange={handleChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="d-flex gap-2">
            <TextField
              fullWidth
              margin="normal"
              label="Camera trước"
              type="text"
              name="cameratruoc"
              value={form.cameratruoc}
              disabled={isViewOnly}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Camera sau"
              type="text"
              name="camerasau"
              value={form.camerasau}
              onChange={handleChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="d-flex gap-2">
            <TextField
              fullWidth
              margin="normal"
              label="Công nghệ màn hình"
              type="text"
              name="congnghemanhinh"
              value={form.congnghemanhinh}
              onChange={handleChange}
              disabled={isViewOnly}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Độ phân giải màn hình"
              type="text"
              name="dophangiaimanhinh"
              value={form.dophangiaimanhinh}
              onChange={handleChange}
              disabled={isViewOnly}
            />
          </div>
          <TextField
            fullWidth
            margin="normal"
            label="Mô tả"
            type="text"
            name="mota"
            value={form.mota}
            onChange={handleChange}
            disabled={isViewOnly}
            multiline
            rows={4}
          />
          {product && (
            <FormControl fullWidth margin="normal">
              <InputLabel makhachhang="trangthai-label">Trạng thái</InputLabel>
              <Select
                labelId="trangthai-label"
                name="trangthai"
                label="Trạng thái"
                value={form.trangthai}
                onChange={handleChange}
                disabled={isViewOnly}
              >
                <MenuItem value={0}>Hoạt động</MenuItem>
                <MenuItem value={1}>Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          )}
          <img
            src={product && form.hinhanhchinh ? imageSrc : ""}
            alt={form.tensanpham}
            width="100px"
            height="100px"
            style={product ? {} : { display: "none" }} // Ẩn ảnh nếu không phải cập nhật
          />
          {!isViewOnly && (
            <Box sx={{ marginTop: 1, marginBottom: 1 }}>
              <input
                type="file"
                makhachhang="hinhanhchinh"
                name="hinhanhchinh"
                accept="hinhanhchinh/*"
                onChange={handleFileChange}
                required
                style={{
                  width: "100%",
                  padding: "16.5px 14px",
                  fontSize: "1rem",
                  lineHeight: "1.4375em",
                  backgroundColor: "#fff",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  color: "rgba(0, 0, 0, 0.87)",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                onFocus={(e) => (e.target.style.border = "2px solid #3f51b5")}
                onBlur={(e) =>
                  (e.target.style.border = "1px solid rgba(0, 0, 0, 0.23)")
                }
              />
            </Box>
          )}

          <Box mt={2} display="flex" justifyContent="flex-end" gap="5px">
            {!isViewOnly && (
              <button className="btn btn-primary admin-btn" onClick={handleSubmit}>
                <i className="fa-regular fa-floppy-disk" style={{ marginRight: '5px' }}></i>Lưu
              </button>
            )}
            <button className="btn btn-danger admin-btn" onClick={onClose} style={{ width: '15%' }}>
              <i className="fa-solid fa-x" style={{ marginRight: '5px' }}></i>
              Huỷ
            </button>
          </Box>
        </Box>
      </Modal >
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
