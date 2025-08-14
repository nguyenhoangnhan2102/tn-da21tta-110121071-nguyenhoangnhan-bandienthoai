import { Link } from "react-router-dom";
import Carouseles from "../../share/component/Carousel";
import "../style/Home.scss";
import { useEffect, useState } from "react";
import productService from "../../services/productService";
import { getAllManufacturer } from "../../services/manufacturerService";

const imgURL = process.env.REACT_APP_IMG_URL;

const Home = () => {
  const [products, setListProduct] = useState([]);
  const [manufacturers, setListManufacturer] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [visibleCount, setVisibleCount] = useState(8); // Số lượng sản phẩm hiển thị ban đầu
  console.log("products", products)
  useEffect(() => {
    fetchListProduct();
    fetchListManufacturer();
  }, []);

  const fetchListProduct = async () => {
    try {
      const response = await productService.getAllProducts();
      if (response.EC === 1) {
        setListProduct(response.DT.activeProducts);
      } else {
        console.error("Failed to fetch");
      }
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  const fetchListManufacturer = async () => {
    try {
      const response = await getAllManufacturer();
      if (response.EC === 1) {
        setListManufacturer(response.DT.allManufacturer);
      } else {
        console.error("Failed to fetch");
      }
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedManufacturer
      ? item.tenthuonghieu === selectedManufacturer
      : true;

    const matchesSearch = item.tensanpham
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesPrice = (() => {
      if (selectedPriceRange === "under5") return item.giaban < 5000000;
      if (selectedPriceRange === "5to10")
        return item.giaban >= 5000000 && item.giaban <= 10000000;
      if (selectedPriceRange === "10to15")
        return item.giaban > 10000000 && item.giaban <= 15000000;
      if (selectedPriceRange === "above15") return item.giaban > 15000000;
      return true;
    })();

    return matchesCategory && matchesSearch && matchesPrice;
  });

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10); // Tăng số lượng sản phẩm hiển thị thêm 10
  };

  return (
    <>
      <Carouseles />
      <div className="container product-container my-4">
        <div className="d-flex gap-3 my-4">
          <div className="col-2 mt-4 ms-4">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ marginLeft: '18px' }}
            />
          </div>
          <div className="col-2 mt-4 ms-3">
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="form-select"
            >
              <option value="">Tất cả thương hiệu</option>
              {manufacturers &&
                manufacturers.map((manu, index) => (
                  <option key={index} value={manu.tenthuonghieu}>
                    {manu.tenthuonghieu}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-2 mt-4 ms-3">
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="form-select"
            >
              <option value="">Tất cả giá</option>
              <option value="under5">Dưới 5 triệu</option>
              <option value="5to10">5 - 10 triệu</option>
              <option value="10to15">10 - 15 triệu</option>
              <option value="above15">Trên 15 triệu</option>
            </select>
          </div>
        </div>

        <div className="product-list">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.slice(0, visibleCount).map((product, index) => (
              <Link
                to={`/product-details/${product.masanpham}`}
                className="text-decoration-none "
                key={product.masanpham}
              >
                <div className="product-card">
                  <img
                    src={`${imgURL}${product.hinhanhchinh}`}
                    className="product-image"
                    alt={product.tensanpham || "Hình ảnh sản phẩm"}
                  />
                  <h3 className="product-name">{product.tensanpham}</h3>
                  <p className="product-specs">
                    {product.ram} / {product.dungluong}
                  </p>
                  <p className="product-price">
                    {Number(product.giaban).toLocaleString("vi-VN")}<sup><u>đ</u></sup>
                  </p>
                  <button className="buy-now-button">Mua ngay</button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-12">"Không có sản phẩm"</div>
          )}
        </div>
        {visibleCount < filteredProducts.length && (
          <div className="text-center">
            <div
              className="pb-4"
              style={{ fontSize: '18px', cursor: 'pointer' }}
              onClick={handleShowMore}
            >
              Xem thêm
              <i className="fa-solid fa-caret-down ms-2"></i>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
