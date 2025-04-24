import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import axiosInstance from '../authentication/axiosInstance';
import "../style/Form.scss";

const apiUrl = process.env.REACT_APP_API_URL;
const userUrl = apiUrl + "/users"

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        hoten: "",
        sodienthoai: "",
        diachi: "",
    });
    const [rePassword, setRePassword] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (rePassword === formData.password) {
    //         const dataToSubmit = {
    //             ...formData,
    //             hoten: formData.hoten || formData.email,
    //         };

    //         try {
    //             const response = await axiosInstance.post(`${userUrl}/register`, dataToSubmit);
    //             console.log(response.data);
    //             if (response.data.EC === 1) {
    //                 toast.success("Đăng ký thành công!!!");
    //                 setFormData({
    //                     email: "",
    //                     password: "",
    //                     hoten: "",
    //                     sodienthoai: "",
    //                     diachi: "",
    //                 });
    //                 setRePassword("");
    //                 navigate("/login");
    //             }
    //         } catch (error) {
    //             console.error("Error registering user:", error);
    //             setMessage("Error registering user");
    //         }
    //     } else {
    //         toast.error("Mật khẩu không trùng khớp");
    //     }
    // };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <form className="form-register p-4 border rounded bg-light" /*onSubmit={handleSubmit}*/>
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
                <div className="d-flex justify-content-between align-items-center gap-4 form-button mt-2">
                    <button
                        className='btn btn-primary button-register'
                        type="submit"
                    >
                        ĐĂNG KÝ
                    </button>
                    <Link
                        to={`/login`}
                        className='button-login'
                        variant="link"
                    >
                        Đã có tài khoản
                    </Link>
                </div>
            </form>
            <div className='d-lg-block d-sm-none'>
                <img src="/login.png" alt="login.png" />
            </div>
        </div>
    );
};

export default Register;