import { Container, Form, Nav, Navbar } from 'react-bootstrap/';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineSmartphone } from "react-icons/md";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { useAuth } from '../../authentication/AuthContext';
import axiosInstance from '../../authentication/axiosInstance';
import Cookies from "js-cookie";
import '../style.scss';

const apiUrl = process.env.REACT_APP_API_URL;
const userURL = apiUrl + '/users';

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [UserData, setUserData] = useState("");
    const { isLoggedIn, logoutIs } = useAuth();
    const location = useLocation();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            fetchProfileUser();
        }
    }, [isLoggedIn]);

    const fetchProfileUser = async () => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                const decodedToken = jwtDecode(token);
                const response = await axiosInstance.post(`${userURL}/profile`, { makhachhang: decodedToken.makhachhang });
                if (response.data.EC === 200) {
                    setUserData(response.data.DT[0]);
                } else {
                    toast.error("Đã xảy ra lỗi");
                }
            } else {
                navigate("/login");
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleOptionClick = (option) => {
        if (option === "Logout") {
            Cookies.remove("accessToken", { path: "", expires: 1 });
            logoutIs();
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
        <>
            <Navbar expand="lg" className="navbar-container">
                <Container fluid className='navbar-content'>
                    <Navbar className='navbar-logo'>
                        <Link
                            to={`/`}
                            className="d-flex align-items-center text-decoration-none fst-italic"
                            style={{ fontSize: "25px", fontWeight: 'bold', color: 'black' }}>
                            <MdOutlineSmartphone style={{ fontSize: "50px" }} />
                            SHOPPHONE
                        </Link>
                    </Navbar>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse makhachhang="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                        </Nav>
                        <Form className="d-flex align-items-center justify-content-center">
                            <Link
                                to={`/cart`}
                                className="text-decoration-none text-dark button-cart "
                                style={{ border: 'none', backgroundColor: 'none' }}
                            >
                                <i
                                    className="fa-solid fa-cart-shopping me-4 d-flex align-items-center justify-content-center"
                                    style={{ fontSize: "25px", cursor: 'pointer' }}>
                                </i>
                            </Link>
                            {isLoggedIn ? (
                                <>
                                    {UserData ? (
                                        <>
                                            <li className="header-avata d-flex align-items-center">
                                                <p onClick={handleClick} title="User Dropdown" className="d-flex justify-content-center">
                                                    <Avatar
                                                        sx={{ mr: 2 }}
                                                        alt="User Avatar"
                                                        src="/path/to/avatar.jpg"
                                                    />
                                                    <span className="w-100 username">
                                                        {UserData.hoten}
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
                                                {UserData.role === 1 && (
                                                    <MenuItem onClick={() => handleOptionClick("AdminManagement")}>
                                                        Quản lý admin
                                                    </MenuItem>
                                                )}
                                                <MenuItem onClick={() => handleOptionClick("Logout")}>
                                                    Đăng xuất
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    ) : (
                                        <>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="nav navbar-right col-3 w-75">
                                        <Link to={`/login`} className='button-login text-dark'>Đăng nhập</Link>
                                    </div>
                                </>
                            )}
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar >
        </>
    );
};

export default Header;
