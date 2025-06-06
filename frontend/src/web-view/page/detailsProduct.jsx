import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/productService";
import "../style/detailsProduct.scss";

const imgURL = process.env.REACT_APP_URL_SERVER + "/images";

const ProductDetail = () => {
    const { masanpham } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        fetchProductDetail();
    }, [masanpham]);

    const fetchProductDetail = async () => {
        const data = await productService.getProductById(masanpham);
        console.log("data", data);
        if (data) {
            setProduct(data?.result || {});
            setSelectedVariant(data?.result?.chiTietSanPham?.[0] || {});
        }
    };

    const handleSelectVariant = (dungluong) => {
        const variant = product.chiTietSanPham.find((v) => v.dungluong === dungluong);
        setSelectedVariant(variant);
    };

    if (!product || !selectedVariant) return <div>Đang tải chi tiết...</div>;

    const allDungLuong = [...new Set(product.chiTietSanPham.map((v) => v.dungluong))];

    return (
        <div className="product-detail-container">
            <h2>{product.tensanpham}</h2>
            <div className="detail-wrapper">
                <img
                    src={`${imgURL}/${selectedVariant.hinhanhchitiet}`}
                    alt={`Ảnh ${selectedVariant.dungluong}`}
                    className="detail-image"
                />
                <div className="detail-info">
                    <div className="dungluong-list">
                        {allDungLuong.map((dl, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectVariant(dl)}
                                className={selectedVariant.dungluong === dl ? "active" : ""}
                            >
                                {dl}
                            </button>
                        ))}
                    </div>

                    <p>
                        <b>Giá:</b>{" "}
                        {selectedVariant.giagiam > 0 ? (
                            <>
                                <span className="line-through">
                                    {Number(selectedVariant.giaban).toLocaleString("vi-VN")}₫
                                </span>{" "}
                                <span className="highlight">
                                    {Number(selectedVariant.giagiam).toLocaleString("vi-VN")}₫
                                </span>
                            </>
                        ) : (
                            <span className="highlight">
                                {Number(selectedVariant.giaban).toLocaleString("vi-VN")}₫
                            </span>
                        )}
                    </p>
                    <p><b>RAM:</b> {selectedVariant.ram}</p>
                    <p><b>Dung lượng:</b> {selectedVariant.dungluong}</p>
                    <p><b>Màu sắc:</b> {selectedVariant.mau}</p>
                    <p><b>Hệ điều hành:</b> {product.hedieuhanh}</p>
                    <p><b>CPU:</b> {product.cpu}</p>
                    <p><b>GPU:</b> {product.gpu}</p>
                    <p><b>Camera:</b> Trước {product.cameratruoc} - Sau {product.camerasau}</p>
                    <p><b>Mô tả:</b> {product.mota}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
