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
            navigate("/orders");
        } else if (option === "AdminManagement") {
            navigate("/admin");
        }
        handleClose();
    };

    return (
        <Navbar expand="lg" className="navbar-container">
            <Container fluid className='navbar-content'>
                <Navbar className='navbar-logo'>
                    <Link
                        to={`/`}
                        className="d-flex align-items-center text-decoration-none fst-italic"
                        style={{ fontSize: "25px", fontWeight: 'bold', color: 'black' }}>
                        <MdOutlineSmartphone style={{ fontSize: "50px" }} />
                        PHONESHOP
                    </Link>
                </Navbar>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll />
                    <Form className="d-flex align-items-center justify-content-center">
                        <Link
                            to={`/cart`}
                            className="text-decoration-none text-dark button-cart"
                            style={{ border: 'none', backgroundColor: 'transparent' }}
                        >
                            <i
                                className="fa-solid fa-cart-shopping me-4 d-flex align-items-center justify-content-center"
                                style={{ fontSize: "25px", cursor: 'pointer' }}>
                            </i>
                        </Link>
                        {isAuthenticated ? (
                            userInfo && (
                                <>
                                    <li className="header-avata d-flex align-items-center">
                                        <p onClick={handleClick} title="User Dropdown" className="d-flex justify-content-center">
                                            <Avatar
                                                sx={{ mr: 2 }}
                                                alt="User Avatar"
                                                src={userInfo?.avatarUrl || "/path/to/avatar.jpg"}
                                            />
                                            <span className="w-100 username">
                                                {userInfo?.hoten}
                                            </span>
                                        </p>
                                    </li>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        style={{ marginLeft: '0', marginTop: '10px' }}
                                    >
                                        <MenuItem onClick={() => handleOptionClick("Profile")}>
                                            Thông tin
                                        </MenuItem>
                                        <MenuItem onClick={() => handleOptionClick("Orders")}>
                                            Đơn hàng
                                        </MenuItem>
                                        {userInfo.role === 1 && (
                                            <MenuItem onClick={() => handleOptionClick("AdminManagement")}>
                                                Quản lý admin
                                            </MenuItem>
                                        )}
                                        <MenuItem onClick={() => handleOptionClick("Logout")}>
                                            Đăng xuất
                                        </MenuItem>
                                    </Menu>
                                </>
                            )
                        ) : (
                            <div className="nav navbar-right col-3 w-75">
                                <Link to={`/login`} className='button-login text-dark'>Đăng nhập</Link>
                            </div>
                        )}
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
