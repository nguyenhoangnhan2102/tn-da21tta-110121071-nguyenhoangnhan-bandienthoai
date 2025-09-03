import React, { useEffect, useRef, useState } from 'react';
import { Container, Form, Nav, Navbar } from 'react-bootstrap/';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineSmartphone } from "react-icons/md";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import userService from '../../services/userAccountService';
import productService from "../../services/productService"; // service chứa getAllProducts
import "../style/header.scss";

const imgURL = process.env.REACT_APP_IMG_URL;

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const { isAuthenticated, userInfo } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null); // ref cho khung search

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    // Xử lý khi gõ search
    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim().length > 0) {
            try {
                const products = await productService.getAllProducts();
                const productList = products?.DT?.activeProducts || products || [];

                const filtered = productList.filter(p =>
                    p.tensanpham.toLowerCase().includes(value.toLowerCase())
                );

                setResults(filtered.slice(0, 5)); // chỉ lấy 5 sản phẩm
                setShowDropdown(true);
            } catch (error) {
                console.error("Search error:", error);
            }
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelectProduct = (product) => {
        setSearchTerm("");
        setShowDropdown(false);
        navigate(`/product/${product.masanpham}`);
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

                    {/* Thanh tìm kiếm */}
                    {/* Thanh tìm kiếm */}
                    <div ref={searchRef} className="search-wrapper mx-auto" style={{ position: "relative" }}>
                        <Form className="search-form d-flex" style={{ position: "relative" }}>
                            <Form.Control
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="me-2"
                                style={{ borderRadius: "20px", minWidth: "500px", paddingRight: "40px" }} // chừa khoảng cho icon
                            />

                            {/* Icon search hoặc clear */}
                            {searchTerm ? (
                                <i
                                    className="fa-solid fa-xmark search-icon"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setResults([]);
                                        setShowDropdown(false);
                                    }}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#666",
                                    }}
                                ></i>
                            ) : (
                                <i
                                    className="fa-solid fa-magnifying-glass search-icon"
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#666",
                                    }}
                                ></i>
                            )}
                        </Form>

                        {showDropdown && results.length > 0 && (
                            <div className="search-dropdown">
                                {results.map(product => (
                                    <>
                                        <Link to={`/product-details/${product.masanpham}`} className="text-decoration-none text-dark">
                                            <div
                                                key={product.masanpham}
                                                className="search-item"
                                                onClick={() => handleSelectProduct(product)}
                                            >

                                                <img
                                                    src={`${imgURL}/${product.hinhanh.split(",")[0]}`}
                                                    alt={product.tensanpham}
                                                    className="search-item-img"
                                                />
                                                <span>{product.tensanpham}</span>
                                                {console.log("product", product)}
                                            </div>
                                        </Link>
                                    </>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Giỏ hàng + Avatar */}
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

                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                    <MenuItem onClick={() => handleOptionClick("Profile")}>Thông tin</MenuItem>
                                    <MenuItem onClick={() => handleOptionClick("Orders")}>Đơn hàng</MenuItem>
                                    {(userInfo.role === 1 || userInfo.role === 2) && (
                                        <MenuItem onClick={() => handleOptionClick("AdminManagement")}>
                                            Quản trị
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
