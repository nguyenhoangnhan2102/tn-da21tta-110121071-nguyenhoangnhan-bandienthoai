import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axiosInstance from "../../authentication/axiosInstance";
import Cookies from "js-cookie";
import "../style/Details.scss";
import { useAuth } from "../../authentication/AuthContext";

const apiUrl = process.env.REACT_APP_API_URL;
const apiProductUrl = apiUrl + '/product';
const imgURL = process.env.REACT_APP_IMG_URL;

const ProductDetails = () => {
    const [productdetails, setProductDetails] = useState([]);
    const { masanpham } = useParams();
    const [inforUser, setInforUser] = useState({});
    const [showDetails, setShowDetails] = useState(true);
    const [showDetailsCamera, setShowDetailsCamera] = useState(true);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 👉 state cho bình luận
    const [comments, setComments] = useState([]);
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");

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
            } catch (err) {
                console.error("Error occurred", err);
            }
        }
    };
    console.log("inforUser", inforUser)
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        const manguoidung = inforUser?.manguoidung; // lấy trực tiếp
        const masanpham = productdetails?.masanpham;
        const soluong = 1;

        try {
            const response = await axiosInstance.post(`${apiUrl}/cart`, {
                manguoidung,
                masanpham,
                soluong
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

        const { manguoidung } = inforUser?.manguoidung;
        const { masanpham } = productdetails;

        const soluong = 1;

        try {
            const response = await axiosInstance.post(`${apiUrl}/cart`, {
                manguoidung,
                masanpham,
                soluong,
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

    return (
        <div className="container mt-3 product-details">
            <div className="row d-flex">
                <div className="d-flex mb-3 align-items-center">
                    <h3 className="me-2">
                        {productdetails.tensanpham} {productdetails.ram}/{productdetails.dungluong}
                    </h3>
                    <label className="badge bg-warning text-dark d-flex align-items-center">
                        Chỉ có tại Phoneshop
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
                    {/* ================== PHẦN BÌNH LUẬN ================== */}
                    <div className="comment-box mt-5">
                        <h4 className="mb-3">Đánh giá & Bình luận</h4>

                        {/* Form viết bình luận */}
                        <div className="comment-form mb-4">
                            <input
                                type="text"
                                placeholder="Tiêu đề"
                                className="comment-input"
                            />
                            <div className="rating my-2">
                                ★★★★☆ (Rating)
                            </div>
                            <textarea
                                placeholder="Nhập nội dung bình luận..."
                                className="comment-textarea"
                                rows="3"
                            ></textarea>
                            <button className="btn btn-primary mt-2">
                                Gửi bình luận
                            </button>
                        </div>

                        {/* Danh sách bình luận */}
                        <div className="comment-list">
                            <div className="comment-item">
                                <div className="comment-header d-flex justify-content-between">
                                    <strong>Nguyễn Văn A</strong>
                                    <span className="rating">★★★★★</span>
                                </div>
                                <p className="m-0 fw-bold">Sản phẩm rất tốt</p>
                                <p>Mình đã dùng được 1 tuần, pin trâu và chạy mượt.</p>
                            </div>

                            <div className="comment-item">
                                <div className="comment-header d-flex justify-content-between">
                                    <strong>Trần Thị B</strong>
                                    <span className="rating">★★★★☆</span>
                                </div>
                                <p className="m-0 fw-bold">Ổn trong tầm giá</p>
                                <p>Máy đẹp, chụp ảnh ok, nhưng sạc hơi lâu.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-4 col-md-4 product-info" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px' }}>
                    <div className="product-price mb-3">
                        {/* Giá bán gốc (có gạch ngang nếu có khuyến mãi) */}
                        <span
                            className={`me-2 ${productdetails.khuyenmai ? "text-decoration-line-through text-muted" : "text-danger fw-bold"}`}
                        >
                            {Number(productdetails.giaban)?.toLocaleString("vi-VN")}₫
                        </span>

                        {/* Nếu có khuyến mãi thì hiện giá sau giảm + % */}
                        {productdetails.khuyenmai > 0 && (
                            <>
                                <span className="text-danger fw-bold me-2">
                                    {Number(productdetails.giasaugiam)?.toLocaleString("vi-VN")}₫
                                </span>
                                <span className="text-success m-0">
                                    -{productdetails.khuyenmai}%
                                </span>
                            </>
                        )}
                    </div>
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
                            {console.log("productdetails", productdetails)}
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
