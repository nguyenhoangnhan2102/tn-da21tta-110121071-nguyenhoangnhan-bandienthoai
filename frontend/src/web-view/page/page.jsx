import { useEffect, useState } from "react";
import productService from "../../services/productService";
import "../style/home.scss";
import { useNavigate } from "react-router-dom";

const imgURL = process.env.REACT_APP_URL_SERVER + "/images";

const Home = () => {
  const [products, setListProduct] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchListProduct();
  }, []);

  const fetchListProduct = async () => {
    try {
      const response = await productService.getAllProducts();
      setListProduct(response || []);

      // Mặc định chọn biến thể đầu tiên của mỗi sản phẩm
      const defaultSelections = {};
      (response || []).forEach((product) => {
        defaultSelections[product.masanpham] = product.chiTietSanPham[0];
      });
      setSelectedVariants(defaultSelections);
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  const handleSelectVariant = (productId, dungluong) => {
    const product = products.find((p) => p.masanpham === productId);
    const variant = product.chiTietSanPham.find((v) => v.dungluong === dungluong);
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };
  console.log("products", products);

  return (
    <div className="home-container">
      <h2>Danh sách sản phẩm</h2>
      <div className="product-list">
        {products.map((product) => {
          const selectedVariant = selectedVariants[product.masanpham] || product.chiTietSanPham[0];
          const allDungLuong = [...new Set(product.chiTietSanPham.map((v) => v.dungluong))];

          return (
            <div
              className="product-card"
              key={product.masanpham}
              onClick={() => navigate(`/san-pham/${product.masanpham}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="image-wrapper">
                {selectedVariant.khuyenmai > 0 && (
                  <div className="discount-badge">-{selectedVariant.khuyenmai}%</div>
                )}
                <img
                  src={`${imgURL}/${selectedVariant.hinhanhchitiet}`}
                  alt={`Ảnh ${selectedVariant.dungluong}`}
                />
              </div>

              <h4>
                {product.tensanpham} {selectedVariant.dungluong}
              </h4>

              <ul className="dungluong-list">
                {allDungLuong.map((dl, idx) => (
                  <li
                    key={idx}
                    className={selectedVariant.dungluong === dl ? "active" : ""}
                    style={{
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      background: selectedVariant.dungluong === dl ? "#1976d2" : "#eee",
                      color: selectedVariant.dungluong === dl ? "#fff" : "#000",
                      marginRight: "6px",
                      display: "inline-block",
                    }}
                    onClick={() => handleSelectVariant(product.masanpham, dl)}
                  >
                    {dl}
                  </li>
                ))}
              </ul>

              <p className="price">
                {selectedVariant.giagiam > 0 ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "#999", marginRight: "8px" }}>
                      {Number(selectedVariant.giaban).toLocaleString("vi-VN")}₫
                    </span>
                    <span style={{ color: "#e91e63", fontWeight: "bold" }}>
                      {Number(selectedVariant.giagiam).toLocaleString("vi-VN")}₫
                    </span>
                  </>
                ) : (
                  <span style={{ color: "#e91e63", fontWeight: "bold" }}>
                    {Number(selectedVariant.giaban).toLocaleString("vi-VN")}₫
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
