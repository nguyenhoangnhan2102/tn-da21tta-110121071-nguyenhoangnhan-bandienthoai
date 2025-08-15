// profile/page.jsx
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../../authentication/axiosInstance";
import ReduxStateExport from "../../redux/redux-state";
import "./profile.scss";

const apiUrl = process.env.REACT_APP_API_URL + "/users";

export default function Profile() {
  const [show, setShow] = useState(false);
  const [hoten, setHoten] = useState("");
  const [sodienthoai, setSodienthoai] = useState("");
  const [diachi, setDiachi] = useState("");
  const { userInfo } = ReduxStateExport();

  const handleShow = () => {
    setHoten(userInfo.hoten || "");
    setSodienthoai(userInfo.sodienthoai || "");
    setDiachi(userInfo.diachi || "");
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(sodienthoai)) {
      toast.error("Số điện thoại phải có 10 số.");
      return;
    }

    try {
      const res = await axiosInstance.put(`${apiUrl}/update/${userInfo.makhachhang}`, {
        hoten,
        sodienthoai,
        diachi,
      });

      if (res.data.EC === 200) {
        toast.success(res.data.EM);
        handleClose();
      } else {
        toast.error(res.data.EM);
      }
    } catch {
      toast.error("Lỗi khi cập nhật thông tin");
    }
  };

  if (!userInfo) return <div>Không tìm thấy thông tin</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <h4>Thông tin tài khoản</h4>
        <Button variant="outline-primary" size="sm" onClick={handleShow}>
          Cập nhật
        </Button>
      </div>

      <div className="profile-card">
        <div className="profile-item">
          <strong>Hình đại diện:</strong>
          <img src="/avatar.webp" alt="avatar" className="avatar" />
        </div>
        <div className="profile-item">
          <strong>Tên hiển thị:</strong> {userInfo.hoten || "Chưa cập nhật"}
        </div>
      </div>

      <h5 className="mt-4">Thông tin cá nhân</h5>
      <div className="profile-card">
        <div className="profile-item">
          <strong>Email:</strong> {userInfo.email || "Chưa cập nhật"}
        </div>
        <div className="profile-item">
          <strong>Số điện thoại:</strong> {userInfo.sodienthoai || "Chưa cập nhật"}
        </div>
        <div className="profile-item">
          <strong>Địa chỉ:</strong> {userInfo.diachi || "Chưa cập nhật"}
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên</Form.Label>
              <Form.Control value={hoten} onChange={(e) => setHoten(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control value={sodienthoai} onChange={(e) => setSodienthoai(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control value={diachi} onChange={(e) => setDiachi(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Đóng</Button>
          <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
