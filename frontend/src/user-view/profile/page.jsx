import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../authentication/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import "../../web-view/style/profile.scss";
import Cookies from "js-cookie"; // Import thư viện js-cookie
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { Button, Modal, Form } from "react-bootstrap";
import ReduxStateExport from "../../redux/redux-state";

const apiUrl = process.env.REACT_APP_API_URL + "/users";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false); // Hiển thị modal
  const [hoten, setHoten] = useState(""); // Lưu thông tin tên
  const [sodienthoai, setSodienthoai] = useState(""); // Lưu số điện thoại
  const [diachi, setDiachi] = useState(""); // Lưu địa chỉ


  const { userInfo } = ReduxStateExport();


  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Hiển thị modal và gán giá trị ban đầu
    setHoten(userInfo.hoten || "");
    setSodienthoai(userInfo.sodienthoai || "");
    setDiachi(userInfo.diachi || "");
    setShow(true);
  };

  const handleSubmit = async () => {
    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10}$/; // Regex kiểm tra số điện thoại chỉ chứa 10 chữ số
    if (!phoneRegex.test(sodienthoai)) {
      toast.error("Số điện thoại phải là số và chứa đúng 10 ký tự.");
      return;
    }

    try {
      const response = await axiosInstance.put(`${apiUrl}/update/${userInfo.makhachhang}`, {
        hoten,
        sodienthoai,
        diachi,
      });

      if (response.data.EC === 200) {
        toast.success(response.data.EM);
        handleClose();
      } else {
        toast.error(response.data.EM);
      }
    } catch (error) {
      toast.error("Xảy ra lỗi khi cập nhật thông tin");
      console.error("Error updating user:", error);
    }
  };

  if (!userInfo) {
    return <div>Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <>
      <section className="profile-section h-100 d-flex">
        <div className="profile-container h-100 d-flex">
          <div className="profile-content container" style={{ height: "75vh", marginBottom: "10px" }}>
            <section className="profile-section">
              <h2 className="profile-section__title">
                <h4>Thông tin tài khoản</h4>
              </h2>
              <p className="profile-section__description">
                Bạn có thể cập nhật Hồ sơ Công khai của mình tại đây và thông tin sẽ tự động đồng bộ ở tất cả các hệ thống.
              </p>
              <div className="d-flex justify-content-end gap-2 my-3">
                <button className="profile-info-box__btn" onClick={handleShow}>
                  Cập nhật
                </button>
              </div>
              <div className="profile-info-box">
                <div className="profile-info-box__item">
                  <span className="profile-info-box__label"><strong>Hình đại diện</strong></span>
                  <img src="/avatar.webp" alt="avatar.webp" width="50px" height="50px" />
                </div>
                <div className="profile-info-box__item">
                  <span className="profile-info-box__label"><strong>Tên hiển thị</strong></span>
                  <span className="profile-info-box__value">{userInfo.hoten || "Chưa cập nhật"}</span>
                </div>
              </div>
            </section>
            <section className="profile-section mt-4">
              <h2 className="profile-section__title">Thông tin cá nhân</h2>
              <div className="profile-info-box">
                <div className="profile-info-box__item">
                  <span className="profile-info-box__label"><strong>Email</strong></span>
                  <span className="profile-info-box__value">{userInfo.email || "Chưa cập nhật"}</span>
                </div>
                <div className="profile-info-box__item">
                  <span className="profile-info-box__label"><strong>Số điện thoại</strong></span>
                  <span className="profile-info-box__value">{userInfo.sodienthoai || "Chưa cập nhật"}</span>
                </div>
                <div className="profile-info-box__item">
                  <span className="profile-info-box__label"><strong>Địa chỉ</strong></span>
                  <span className="profile-info-box__value">{userInfo.diachi || "Chưa cập nhật"}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        className="model-content-profle"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                className="w-100 rounded-3"
                value={hoten}
                onChange={(e) => setHoten(e.target.value)} // Thêm onChange
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={sodienthoai}
                className="w-100 rounded-3"
                onChange={(e) => setSodienthoai(e.target.value)} // Thêm onChange
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                className="w-100 rounded-3"
                value={diachi}
                onChange={(e) => setDiachi(e.target.value)} // Thêm onChange
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant="primary"
            style={{ padding: ".375rem .75rem", width: "70px" }}
            onClick={handleSubmit}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
