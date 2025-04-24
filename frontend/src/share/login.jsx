import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import "../style/Form.scss";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const handleGoogleLoginSuccess = (response) => {
        console.log('Google login success', response);
        // Xử lý logic login với Google ở đây
    };

    const handleGoogleLoginFailure = (response) => {
        console.log('Google login failed', response);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic đăng nhập tại đây
        console.log('Đăng nhập:', { email, password });
    };

    return (
        // <Container className="mt-5">
        //     <Row className="justify-content-center">
        //         <Col md={6}>
        //             <h3 className="text-center">Đăng Nhập</h3>
        //             <Form onSubmit={handleSubmit}>
        //                 <Form.Group controlId="formEmail">
        //                     <TextField
        //                         label="Email"
        //                         variant="outlined"
        //                         fullWidth
        //                         required
        //                         value={email}
        //                         onChange={(e) => setEmail(e.target.value)}
        //                         className="mb-3"
        //                     />
        //                 </Form.Group>
        //                 <Form.Group controlId="formPassword">
        //                     <TextField
        //                         label="Mật khẩu"
        //                         type="password"
        //                         variant="outlined"
        //                         fullWidth
        //                         required
        //                         value={password}
        //                         onChange={(e) => setPassword(e.target.value)}
        //                         className="mb-3"
        //                     />
        //                 </Form.Group>
        //                 <Button variant="primary" type="submit" className="w-100 mb-3">
        //                     Đăng Nhập
        //                 </Button>
        //             </Form>

        //             <div className="text-center">
        //                 <GoogleLogin
        //                     clientId="YOUR_GOOGLE_CLIENT_ID"
        //                     buttonText="Đăng nhập với Google"
        //                     onSuccess={handleGoogleLoginSuccess}
        //                     onFailure={handleGoogleLoginFailure}
        //                     cookiePolicy="single_host_origin"
        //                 />
        //             </div>
        //         </Col>
        //     </Row>
        // </Container>
        <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <div className='d-lg-block d-none'>
                <img src="/login.png" alt="login.png" />
            </div>
            <form className="form-login p-4 m-4 border rounded bg-light" /*onSubmit={handleSubmit}*/>
                <h2 className="mb-4 text-center">ĐĂNG NHẬP</h2>
                <div className="text-center d-flex justify-content-center">
                    <GoogleLogin
                        clientId="YOUR_GOOGLE_CLIENT_ID"
                        buttonText="Đăng nhập với Google"
                        onSuccess={handleGoogleLoginSuccess}
                        onFailure={handleGoogleLoginFailure}
                        cookiePolicy="single_host_origin"
                    />
                </div>
                <div className="d-flex justify-content-center mt-2 fs-6">
                    Hoặc đăng nhập bằng:
                </div>
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Tên đăng nhập"
                    name="email"
                // value={formData.email}
                // onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Mật khẩu"
                    name="password"
                    type="password"
                // value={formData.password}
                // onChange={handleChange}
                />
                <div className="d-flex justify-content-between align-items-center form-button mt-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ backgroundColor: '#F96F3A', border: 'none' }}
                    >
                        ĐĂNG NHẬP
                    </button>
                    <Link
                        to={`/register`}
                        variant="link"
                        style={{ color: 'blue', textDecoration: 'none' }}
                    >
                        Chưa có tài khoản?
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
