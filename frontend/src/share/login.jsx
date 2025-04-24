import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import axiosInstance from '../authentication/axiosInstance';
import "../style/Form.scss";

const apiUrl = process.env.REACT_APP_URL_SERVER;
const userUrl = apiUrl + "/user";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post(`${userUrl}/login`, {
                email,
                password
            });
            const { accessToken, userInfo } = res.data.DT;
            // Dùng Redux để lưu token và user
            dispatch(login({ accessToken, userInfo }));
            console.log("Logged in as:", userInfo);
            navigate("/");
        } catch (err) {
            const msg = err.response?.data?.EM || "Lỗi đăng nhập";
            setErrorMessage(msg);
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        const decoded = jwtDecode(response.credential);
        try {
            const res = await axiosInstance.post(`${userUrl}/login/google`, {
                email: decoded.email,
                hoten: decoded.name
            });

            const { accessToken, userInfo } = res.data.DT;

            dispatch(login({ accessToken, userInfo }));

            console.log("Google login:", userInfo);
            navigate("/");
        } catch (err) {
            console.error("Lỗi Google login", err);
            setErrorMessage("Google đăng nhập thất bại");
        }
    };


    return (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <form className="form-login p-4 m-4 border rounded bg-light" onSubmit={handleSubmit}>
                <h2 className="mb-4 text-center">ĐĂNG NHẬP</h2>
                <div className="text-center d-flex justify-content-center">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => setErrorMessage("Google login failed")}
                    />
                </div>
                <div className="d-flex justify-content-center mt-2 fs-6">Hoặc đăng nhập bằng:</div>
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Tên đăng nhập"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="d-flex justify-content-between align-items-center form-button mt-2">
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#F96F3A', border: 'none' }}>
                        ĐĂNG NHẬP
                    </button>
                    <Link to={`/register`}>Chưa có tài khoản?</Link>
                </div>
            </form>
            <div className='d-lg-block d-none'>
                <img src="/login.png" alt="login" />
            </div>
        </div>
    );
};

export default Login;
