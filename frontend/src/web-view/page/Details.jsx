import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axiosInstance from "../../authentication/axiosInstance";
import Cookies from "js-cookie";
import "../style/Details.scss";
import { useAuth } from "../../authentication/AuthContext";

const apiUrl = process.env.REACT_APP_API_URL;
const apiProductUrl = apiUrl + '/products';
const imgURL = process.env.REACT_APP_IMG_URL;

const ProductDetails = () => {
    const [productdetails, setProductDetails] = useState([]);
    const { masanpham } = useParams();
    const [inforUser, setInforUser] = useState({});
    const [showDetails, setShowDetails] = useState(true);
    const [showDetailsCamera, setShowDetailsCamera] = useState(true);
    const [selectedColor, setSelectedColor] = useState('');
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fecthProductDetails();
        getUserInfoUser();
    }, [masanpham]);

    const getUserInfoUser = () => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                setInforUser(decodedToken || {});
            } catch (error) {
                console.error("Error decoding JWT:", error);
            }
        } else {
            console.log("No Access Token found in Cookie");
        }
    };

    const fecthProductDetails = async () => {
        if (masanpham) {
            try {
                const response = await axiosInstance.get(`${apiProductUrl}/${masanpham}`);
                setProductDetails(response.data.DT);
                console.log("setProductDetails", response.data.DT);

                // Mặc định chọn màu đầu tiên nếu có màu sắc
                if (response.data.DT.danhsachmamau && response.data.DT.danhsachmamau.length > 0) {
                    setSelectedColor(response.data.DT.danhsachmamau[0]);
                }
            } catch (err) {
                console.error("Error occurred", err);
            }
        }
    };

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        const { makhachhang } = inforUser;
        const { masanpham } = productdetails;
        const mamau = selectedColor;

        if (!makhachhang || !masanpham || !mamau) {
            toast.warning("Vui lòng chọn màu!!!.");
            return;
        }

        const soluong = 1;
        const gia = productdetails.giasanpham;

        try {
            const response = await axiosInstance.post(`${apiUrl}/cart`, {
                makhachhang,
                masanpham,
                mamau,
                soluong,
                gia,
            });

            if (response.status === 201) {
                toast.success("Sản phẩm đã được thêm vào giỏ hàng");
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng");
            }
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.message === "Sản phẩm đã tồn tại trong giỏ hàng"
            ) {
                toast.warning("Sản phẩm đã tồn tại trong giỏ hàng");
            } else {
                toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
        }
    };

    const handleBuyNow = async () => {
        if (!isLoggedIn) {
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        const { makhachhang } = inforUser;
        const { masanpham } = productdetails;
        const mamau = selectedColor;

        if (!makhachhang || !masanpham || !mamau) {
            toast.warning("Vui lòng chọn màu!!!.");
            return;
        }

        const soluong = 1;
        const gia = productdetails.giasanpham;

        try {
            const response = await axiosInstance.post(`${apiUrl}/cart`, {
                makhachhang,
                masanpham,
                mamau,
                soluong,
                gia,
            });

            if (response.status === 201) {
                navigate("/cart");
            } else {
                toast.error("Không thể mua sản phẩm");
            }
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.message === "Sản phẩm đã tồn tại trong giỏ hàng"
            ) {
                toast.warning("Sản phẩm đã tồn tại trong giỏ hàng");
            } else {
                toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
        }
    };

    if (!productdetails || Object.keys(productdetails).length === 0) {
        return <div>Loading...</div>;
    }

    const handleColorChange = (color) => {
        setSelectedColor(color); // Cập nhật khi chọn màu
        console.log("selectedColor", color);
    };

    return (
        <div className="container mt-3 product-details">
            <div className="row d-flex">
                <div className="d-flex mb-3 align-items-center">
                    <h3 className="me-2">
                        {productdetails.tensanpham}
                    </h3>
                    <label className="badge bg-warning text-dark d-flex align-items-center">
                        Chỉ có tại Shopphone
                    </label>
                </div>
                <div className="col-md-8">
                    <div className="d-flex justify-content-center main-image">
                        <img
                            src={`${imgURL}${productdetails.hinhanhchinh}`}
                            alt={productdetails.tensanpham}
                            width="350px"
                            height="350px"
                        />
                    </div>
                    <div className="d-flex my-4 product-color">
                        {productdetails.danhsachmamau &&
                            productdetails.danhsachmamau.map((colorId, index) => (
                                <div className="row" key={index}>
                                    <div className="my-2 d-flex me-2">
                                        <input
                                            type="radio"
                                            id={`color-${index}`}
                                            name="productColor"
                                            value={parseInt(colorId)}
                                            checked={selectedColor === parseInt(colorId)}
                                            onChange={() => handleColorChange(parseInt(colorId))}
                                            style={{
                                                marginRight: '10px',
                                            }}
                                        />
                                        <img
                                            src={`${imgURL}${productdetails.danhsachmausacsanpham.split(',')[index]}`}
                                            alt={`Màu sản phẩm ${index + 1}`}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                marginRight: '10px',
                                                borderRadius: '5px',
                                                border: '1px solid #ccc',
                                                padding: '5px',
                                                cursor: 'pointer' // Thêm con trỏ để dễ nhận diện là có thể click
                                            }}
                                            onClick={() => handleColorChange(parseInt(colorId))} // Cập nhật màu khi click vào ảnh
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="my-4 p-3 commit">
                        <h5>Shopphone cam kết</h5>
                        <ul className="row">
                            <li className="col-6 my-2"><i className="fa-solid fa-box-open col-1"></i>
                                1 đổi 1 trong 30 ngày đối với sản phẩm lỗi
                            </li>
                            <li className="col-6 my-2"><i className="fa-solid fa-rotate col-1"></i>
                                Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Ốp lưng, Cáp Type C, Củ sạc nhanh rời đầu Type A
                            </li>
                            <hr />
                            <li className="col-6 my-2"><i className="fa-solid fa-shield col-1"></i>
                                Bảo hành chính hãng điện thoại 1 năm tại các trung tâm bảo hành hãng
                            </li>
                        </ul>
                    </div>
                    <div className="description my-4">
                        <label>{productdetails.tensanpham}</label> {productdetails.motasanpham}
                    </div>
                </div>
                <div className="mb-4 col-md-4 product-info" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px' }}>
                    <button
                        className="mt-3 btn-show d-flex justify-content-between align-items-center"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        Cấu hình & Bộ nhớ
                        {showDetails ? (
                            <i className="fa-solid fa-caret-up"></i>
                        ) : (
                            <i className="fa-solid fa-caret-down"></i>
                        )}
                    </button>
                    {showDetails && (
                        <div className="feature-list">
                            <div className="feature-list_details">
                                <strong>Hệ điều hành:</strong>
                                <p> {productdetails.hedieuhanh}</p>
                            </div>
                            <hr />
                            <div className="feature-list_details">
                                <strong>Chip xử lý (CPU):</strong>
                                <p> {productdetails.cpu}</p>
                            </div>
                            <hr />
                            <div className="feature-list_details">
                                <strong>Chip đồ họa (GPU):</strong>
                                <p>{productdetails.gpu}</p>
                            </div>
                            <hr />
                            <div className="feature-list_details">
                                <strong>RAM:</strong>
                                <p>{productdetails.ram}</p>
                            </div>
                            <hr />
                            <div className="feature-list_details">
                                <strong>Dung lượng:</strong>
                                <p>{productdetails.dungluong}</p>
                            </div>
                            <hr />
                            <div className="feature-list_details">
                                <strong>Pin:</strong>
                                <p>{productdetails.pin}</p>
                            </div>
                            <hr />
                        </div>
                    )}
                    <button
                        className="my-3 btn-show d-flex justify-content-between align-items-center"
                        onClick={() => setShowDetailsCamera(!showDetailsCamera)}
                    >
                        Camera & Màn hình
                        {showDetailsCamera ? (
                            <i className="fa-solid fa-caret-up"></i>
                        ) : (
                            <i className="fa-solid fa-caret-down"></i>
                        )}
                    </button>
                    {showDetailsCamera && (
                        <div className="feature-list">
                            <div className="feature-list_details">
                                <strong>Độ phân giải camera sau:</strong>
                                <p>{productdetails.camerasau}</p>
                            </div>
                            <hr />
                            <div className="feature-list_details">
                                <strong>Độ phân giải camera trước:</strong>
                                <p>{productdetails.cameratruoc}</p>
                            </div>
                            <hr />
                            <div className="feature-list_details">
                                <strong>Công nghệ màn hình:</strong>
                                <p> {productdetails.gpu}</p>
                            </div >
                            <hr />
                            <div className="feature-list_details">
                                <strong>Độ phân giải màn hình:</strong>
                                <p>{productdetails.ram}</p>
                            </div>
                            <hr />
                        </div>
                    )}
                    <div className="btn-buy d-flex gap-2">
                        <button className="btn btn-secondary button-cart col-6" onClick={() => handleAddToCart()}>
                            <i className="fa-solid fa-cart-shopping"></i>
                            <p>Thêm vào giỏ</p>
                        </button>

                        <button className="btn btn-primary button-buy col-6" onClick={() => handleBuyNow()}>
                            Mua ngay
                        </button>
                    </div>
                    <div className="contact">
                        Gọi đặt mua <strong>1900 232 460</strong> (8:00 - 21:00)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
