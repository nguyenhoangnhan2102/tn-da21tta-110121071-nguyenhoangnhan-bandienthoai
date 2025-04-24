import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Modal, Box } from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '../authentication/axiosInstance';
import '../style/Form.scss';

const apiUrl = process.env.REACT_APP_URL_SERVER;
const userUrl = apiUrl + "/user";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        hoten: ""
    });
    const [rePassword, setRePassword] = useState("");
    const [otp, setOtp] = useState("");
    const [openOtpModal, setOpenOtpModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            return toast.error("Vui lòng nhập email trước");
        }

        try {
            const response = await axiosInstance.post(`${userUrl}/send-otp`, {
                email: formData.email,
            });

            if (response.data.EC === 1) {
                toast.success("Đã gửi OTP đến email!");
                setOpenOtpModal(true);
            } else {
                toast.error(response.data.EM);
            }
        } catch (error) {
            toast.error("Lỗi khi gửi OTP");
        }
    };

    const handleVerifyOtpAndRegister = async () => {
        try {
            const checkRes = await axiosInstance.post(`${userUrl}/check-otp`, {
                email: formData.email,
                otp,
            });

            if (checkRes.data.EC === 1) {
                if (rePassword !== formData.password) {
                    return toast.error("Mật khẩu không trùng khớp");
                }

                const dataToSubmit = {
                    ...formData,
                    hoten: formData.hoten || formData.email,
                };

                const res = await axiosInstance.post(`${userUrl}/register`, dataToSubmit);

                if (res.data.EC === 1) {
                    toast.success("Đăng ký thành công!");
                    setFormData({ email: "", password: "", hoten: "" });
                    setRePassword("");
                    setOtp("");
                    setOpenOtpModal(false);
                    navigate("/login");
                } else {
                    toast.error(res.data.EM);
                }
            } else {
                toast.error(checkRes.data.EM);
            }
        } catch (error) {
            toast.error("Lỗi xác minh OTP");
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <div className='d-lg-block d-sm-none'>
                <img src="/login.png" alt="login.png" />
            </div>
            <form className="form-register p-4 border rounded bg-light">
                <h2 className="mb-4 text-center">ĐĂNG KÝ</h2>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Họ tên"
                    type="text"
                    name="hoten"
                    value={formData.hoten}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Nhập lại mật khẩu"
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                />

                <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        style={{ backgroundColor: '#F96F3A', border: 'none' }}
                        onClick={handleSendOtp}
                    >
                        Đăng ký
                    </button>
                    <Link
                        to="/login"
                    >
                        Đã có tài khoản
                    </Link>
                </div>
            </form>
            {/* MODAL nhập mã OTP */}
            <Modal
                open={openOtpModal}
                onClose={() => setOpenOtpModal(false)}
            >
                <Box sx={style}>
                    <h5 className="text-center mb-3">Nhập mã OTP</h5>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                        className="btn btn-success mt-3 w-100"
                        onClick={handleVerifyOtpAndRegister}
                    >
                        Xác nhận và Đăng ký
                    </button>
                </Box>
            </Modal>
        </div>
    );
};

export default Register;
