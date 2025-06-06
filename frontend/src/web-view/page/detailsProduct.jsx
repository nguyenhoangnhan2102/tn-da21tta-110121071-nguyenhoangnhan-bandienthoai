import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/productService";
import "../style/detailsProduct.scss";

const imgURL = process.env.REACT_APP_URL_SERVER + "/images";

const ProductDetail = () => {
    const { masanpham } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedDungLuong, setSelectedDungLuong] = useState("");
    const [selectedMau, setSelectedMau] = useState("");
    const [showDetails, setShowDetails] = useState(true);
    const [showDetailsCamera, setShowDetailsCamera] = useState(true);

    useEffect(() => {
        fetchProductDetail();
    }, [masanpham]);

    const fetchProductDetail = async () => {
        const data = await productService.getProductById(masanpham);
        console.log("data", data);
        if (data) {
            const productData = data?.result || {};
            const firstVariant = productData?.chiTietSanPham?.[0] || {};
            setProduct(productData);
            setSelectedVariant(firstVariant);
            setSelectedDungLuong(firstVariant.dungluong);
            setSelectedMau(firstVariant.mau);
        }
    };

    useEffect(() => {
        if (!product) return;
        const matched = product.chiTietSanPham.find(
            (v) => v.dungluong === selectedDungLuong && v.mau === selectedMau
        );
        if (matched) setSelectedVariant(matched);
    }, [selectedDungLuong, selectedMau]);

    if (!product || !selectedVariant) return <div>Đang tải chi tiết...</div>;

    return (
        <div className="container mt-3 product-details">
            <div className="row d-flex">
                <div className="d-flex mb-3 align-items-center">
                    <h3 className="me-2">{product.tensanpham}</h3>
                </div>
                <div className="col-md-8">
                    <div className="d-flex justify-content-center main-image">
                        <img
                            src={`${imgURL}/${selectedVariant.hinhanhchitiet}`}
                            alt={product.tensanpham}
                            width="350px"
                            height="350px"
                        />
                    </div>
                    <div className="my-4 p-3 commit">
                        <h5>Phoneshop cam kết</h5>
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
                        <label>{product.tensanpham}</label> {product.mota}
                    </div>
                </div>
                <div className="mb-4 col-md-4 product-info" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px' }}>
                    <div className="my-3">
                        <label><strong>Dung lượng:</strong></label>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {product.dsDungLuong.map((dl, idx) => (
                                <button
                                    key={idx}
                                    className={`btn ${selectedDungLuong === dl ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setSelectedDungLuong(dl)}
                                >
                                    {dl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="my-3">
                        <label><strong>Màu sắc:</strong></label>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {product.dsMauSac.map((color, idx) => (
                                <button
                                    key={idx}
                                    className={`btn ${selectedMau === color ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setSelectedMau(color)}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="my-2">
                        {selectedVariant?.giagiam > 0 ? (
                            <>
                                <p style={{ textDecoration: "line-through", color: "#999" }}>
                                    {Number(selectedVariant.giaban).toLocaleString("vi-VN")}₫
                                </p>
                                <p style={{ color: "#e91e63", fontWeight: "bold", fontSize: "20px" }}>
                                    {Number(selectedVariant.giagiam).toLocaleString("vi-VN")}₫
                                </p>
                            </>
                        ) : (
                            <p style={{ color: "#e91e63", fontWeight: "bold", fontSize: "20px" }}>
                                {Number(selectedVariant.giaban).toLocaleString("vi-VN")}₫
                            </p>
                        )}
                    </div>

                    <button
                        className="mt-3 btn-show d-flex justify-content-between align-items-center"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        Cấu hình & Bộ nhớ
                        <i className={`fa-solid ${showDetails ? "fa-caret-up" : "fa-caret-down"}`}></i>
                    </button>
                    {showDetails && (
                        <div className="feature-list">
                            <div className="feature-list_details"><strong>Hệ điều hành:</strong><p>{product.hedieuhanh}</p></div>
                            <hr />
                            <div className="feature-list_details"><strong>CPU:</strong><p>{product.cpu}</p></div>
                            <hr />
                            <div className="feature-list_details"><strong>GPU:</strong><p>{product.gpu}</p></div>
                            <hr />
                            <div className="feature-list_details"><strong>RAM:</strong><p>{selectedVariant.ram}</p></div>
                            <hr />
                            <div className="feature-list_details"><strong>Dung lượng:</strong><p>{selectedVariant.dungluong}</p></div>
                            <hr />
                            <div className="feature-list_details"><strong>Pin:</strong><p>{product.pin}</p></div>
                            <hr />
                        </div>
                    )}

                    <button
                        className="my-3 btn-show d-flex justify-content-between align-items-center"
                        onClick={() => setShowDetailsCamera(!showDetailsCamera)}
                    >
                        Camera & Màn hình
                        <i className={`fa-solid ${showDetailsCamera ? "fa-caret-up" : "fa-caret-down"}`}></i>
                    </button>
                    {showDetailsCamera && (
                        <div className="feature-list">
                            <div className="feature-list_details"><strong>Camera sau:</strong><p>{product.camerasau}</p></div>
                            <hr />
                            <div className="feature-list_details"><strong>Camera trước:</strong><p>{product.cameratruoc}</p></div>
                            <hr />
                            <div className="feature-list_details"><strong>Công nghệ màn hình:</strong><p>{product.congnghemanhinh}</p></div>
                            <hr />
                            <div className="feature-list_details"><strong>Độ phân giải màn hình:</strong><p>{product.dophangiaimanhinh}</p></div>
                            <hr />
                        </div>
                    )}

                    <div className="btn-buy d-flex gap-2">
                        <button className="btn btn-secondary button-cart col-6">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <p>Thêm vào giỏ</p>
                        </button>
                        <button className="btn btn-primary button-buy col-6">
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

export default ProductDetail;
