import React, { useState, useEffect } from "react";
import DynamicTable from "../../share/dynamicTable-component";
import { Button } from "@mui/material";
import productService from "../../services/productService";
import ProductDetailModal from "../modal/detailProduct-modal";
import AddIcon from '@mui/icons-material/Add';
import ProductModal from "../modal/product-modal";
import ProductFormModal from "../modal/product-modal";

const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;

const ProductComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState({});
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [product, setProduct] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editting, setEditing] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const response = await productService.getAllProducts();
    console.log("response", response)
    setProduct(response || []);
  };

  // Hàm tìm kiếm dữ liệu
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
  // Hàm lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
  const filteredData = product.filter((item) => {
    const searchLower = searchTerm.toLowerCase();

    const matchSearch = item.tensanpham &&
      item.tensanpham.toLowerCase().includes(searchLower);

    const matchFilter = Object.entries(filterValue).every(([key, value]) =>
      value ? item[key] === value : true
    );
    return matchSearch && matchFilter;
  });


  // Sắp xếp dữ liệu
  const sortedData = filteredData.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // const handleDeleteUser = async (id) => {
  //   if (id) {
  //     const response = await productService.deleteProducts(id);
  //     if (response) {
  //       fetchProduct();
  //     }
  //   }
  // };

  //data của dữ liệu
  const columns = [
    // { key: "masanpham", label: "ID" },
    { key: "tensanpham", label: "Tên" },
    { key: "hinhanh", label: "Hình ảnh", isImage: true },
    { key: "hedieuhanh", label: "Hệ điều hành" },
    { key: "tenthuonghieu", label: "Thương hiệu" },
    // { key: "cpu", label: "CPU" },
    // { key: "gpu", label: "Tên" },
    // { key: "cameratruoc", label: "Tên" },
    // { key: "camerasau", label: "Tên" },
    // { key: "congnghemanhinh", label: "Tên" },
    // { key: "dophangiaimanhinh", label: "Tên" },
    // { key: "pin", label: "Tên" },
  ];
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Danh sách sản phẩm</h2>

      {/* Giao diện tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />

      {/* Giao diện lọc động */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
        >
          <AddIcon /> Thêm sản phẩm
        </Button>
      </div>
      {/* Hiển thị table với dữ liệu đã lọc và sắp xếp */}
      <DynamicTable
        columns={columns}
        data={sortedData}
        onEdit={(id) => {
          const selectedUser = sortedData.find((u) => u.id === id);
          setEditing(selectedUser);
          setShowModal(true);
        }}
        showViewButton={true}
        onView={(id) => {
          const selected = sortedData.find((item) => item.id === id);
          setSelectedProduct(selected);
          setShowViewModal(true);
        }}

      // onDelete={(id) => {
      //   if (window.confirm("Bạn có chắc muốn xóa user này?")) {
      //     handleDeleteUser(id);
      //   }
      // }}
      />
      <ProductFormModal
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        onSave={() => { }}
        product={selectedProduct}
        isView={true}
      />

      <ProductFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {
          fetchProduct();
          setShowModal(false); // 👈 Đóng modal sau khi lưu
        }}
        product={editting} // 👈 Thêm dòng này
        isView={false}
      />
    </div>
  );
};

export default ProductComponent;
