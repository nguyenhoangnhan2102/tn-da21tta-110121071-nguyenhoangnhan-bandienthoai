import { Container, Form, Nav, Navbar } from 'react-bootstrap/';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineSmartphone } from "react-icons/md";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import userService from '../../services/userAccountService';
import "../style/header.scss";

const apiUrl = process.env.REACT_APP_API_URL;
const userURL = apiUrl + '/users';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const { isAuthenticated, userInfo } = useSelector((state) => state.auth);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOptionClick = (option) => {
        if (option === "Logout") {
            Cookies.remove("accessToken");
            dispatch(logout());
            navigate("/login");
        } else if (option === "Profile") {
            navigate("/profile");
        } else if (option === "Orders") {
            navigate("/profile/history-order");
        } else if (option === "AdminManagement") {
            navigate("/admin");
        }
        handleClose();
    };

    return (
        <Navbar expand="lg" className="navbar-container">
            <Container fluid className='navbar-content'>
                {/* Logo */}
                <Navbar.Brand as={Link} to="/" className="navbar-logo d-flex align-items-center">
                    <MdOutlineSmartphone style={{ fontSize: "40px", marginRight: "8px" }} />
                    <span className="brand-name">PHONESHOP</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll" className="justify-content-between">

                    {/* Thanh tìm kiếm ở giữa */}
                    <Form className="search-form d-flex mx-auto">
                        <Form.Control
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="me-2"
                            style={{ minWidth: "300px", borderRadius: "20px" }}
                        />
                        <button className="btn-search">
                            <i className="fa-solid fa-search"></i>
                        </button>
                    </Form>

                    {/* Giỏ hàng + Avatar / Đăng nhập */}
                    <div className="header-right d-flex align-items-center">
                        <Link to={`/cart`} className="cart-link">
                            <i className="fa-solid fa-cart-shopping"></i>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <div onClick={handleClick} className="d-flex align-items-center user-info">
                                    <Avatar
                                        sx={{ mr: 1 }}
                                        alt="User Avatar"
                                        src={userInfo?.avatarUrl || "/path/to/avatar.jpg"}
                                    />
                                    <span className="username">{userInfo?.hoten}</span>
                                </div>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => handleOptionClick("Profile")}>Thông tin</MenuItem>
                                    <MenuItem onClick={() => handleOptionClick("Orders")}>Đơn hàng</MenuItem>
                                    {userInfo.role === 1 && (
                                        <MenuItem onClick={() => handleOptionClick("AdminManagement")}>
                                            Quản lý admin
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={() => handleOptionClick("Logout")}>Đăng xuất</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Link to={`/login`} className='button-login'>Đăng nhập</Link>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
};

export default Header;
