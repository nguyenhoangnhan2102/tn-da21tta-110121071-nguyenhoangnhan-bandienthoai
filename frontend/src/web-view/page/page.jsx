import { useEffect, useState } from "react";
import productService from "../../services/productService";
import "../style/home.scss";

const imgURL = process.env.REACT_APP_URL_SERVER + "/images";

const Home = () => {
  const [products, setListProduct] = useState([]);

  useEffect(() => {
    fetchListProduct();
  }, []);

  const fetchListProduct = async () => {
    try {
      const response = await productService.getAllProducts();
      setListProduct(response || []);
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  return (
    <div className="home-container">
      <h2>Danh sách sản phẩm</h2>
      <div className="product-list">
        {products.map((product) => {
          const firstVariant = product.chiTietSanPham[0];
          const allDungLuong = [
            ...new Set(product.chiTietSanPham.map((v) => v.dungluong)),
          ];

          return (
            <div className="product-card" key={product.masanpham}>
              <img
                src={`${imgURL}/${firstVariant.hinhanhchitiet}`}
                alt="Ảnh sản phẩm"
              />
              {console.log(imgURL + firstVariant.hinhanhchitiet)}
              <h4>{product.tensanpham}</h4>
              <ul className="dungluong-list">
                {allDungLuong.map((dl, idx) => (
                  <li key={idx}>{dl}</li>
                ))}
              </ul>
              <p className="price">
                {Math.min(
                  ...product.chiTietSanPham.map((v) => Number(v.giaban))
                ).toLocaleString("vi-VN")}
                ₫
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
