import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../web-view/style/profile.scss";
import { Button, Modal, Form } from "react-bootstrap";
import ReduxStateExport from "../../redux/redux-state";
import userService from "../../services/userAccountService";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/authSlice";

export default function Profile() {
  const [show, setShow] = useState(false);
  const [hoten, setHoten] = useState("");
  const [sodienthoai, setSodienthoai] = useState("");
  const [diachi, setDiachi] = useState("");
  const dispatch = useDispatch();
  const { userInfo } = ReduxStateExport();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setHoten(userInfo.hoten || "");
    setSodienthoai(userInfo.sodienthoai || "");
    setDiachi(userInfo.diachi || "");
    setShow(true);
  };
  console.log("userInfo", userInfo)
  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(sodienthoai)) {
      toast.error("Số điện thoại phải là số và chứa đúng 10 ký tự.");
      return;
    }

    const result = await userService.updateUserById_User(userInfo.manguoidung, {
      hoten,
      sodienthoai,
      diachi,
    });

    if (result) {
      // ✅ Update lại Redux store với thông tin mới
      dispatch(setUserInfo({
        ...userInfo,
        hoten,
        sodienthoai,
        diachi,
      }));

      handleClose();
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
      <Modal show={show} onHide={handleClose} backdrop="static" className="model-content-profle">
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                value={hoten}
                onChange={(e) => setHoten(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={sodienthoai}
                onChange={(e) => setSodienthoai(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={diachi}
                onChange={(e) => setDiachi(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
