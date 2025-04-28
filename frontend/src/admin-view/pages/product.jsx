import React, { useState, useEffect } from "react";
import DynamicTable from "../../share-component/dynamicTable-component";
import DynamicSearchSort from "../../share-component/dynamicSearchSort";
import productService from "../../services/product-service";
import ProductModalMui from "../modal/product-modal";
import { Button } from "@mui/material";

const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;
const ProductComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState({});
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [product, setProduct] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [searchTerm]);

  const formatDateFolder = (isoDate) => {
    const date = new Date(isoDate);

    const pad = (n) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
  };

  const fetchProduct = async () => {
    const search = searchTerm;
    const response = await productService.getProducts({ search });
    const ProductWithImageUrl = response.listData.map((product) => {
      let imageArray = [];
      const folderName = product.createdAt
        ? new Date(product.createdAt)
          .toISOString()
          .split(".")[0] // Lấy phần trước dấu "."
          .replace(/[-:]/g, "") // Xóa dấu "-" và ":"
        : "unknown-date";
      console.log("sdlahdl;ádasd", folderName);
      try {
        imageArray = product.image ? JSON.parse(product.image) : [];
      } catch (err) {
        console.error("Lỗi parse ảnh:", err);
      }

      return {
        ...product,
        imageUrl:
          imageArray.length > 0
            ? `${API_URL}/uploads/product/${folderName}/${imageArray[0]}`
            : null,
        image: imageArray.length > 0 ? imageArray : null,
        linkCreate: folderName,
      };
    });

    console.log("ProductWithImageUrl;sdasd", ProductWithImageUrl);
    setProduct(ProductWithImageUrl || []);
  };

  // Hàm tìm kiếm dữ liệu
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
  const filteredData = product.filter((item) => {
    const matchSearch = Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  // List data cho C_SortList
  const listData = [
    {
      key: "name",
      value: filterValue.name || "",
      listSelect: Array.from(new Set(product.map((u) => u.name))).map(
        (name) => ({
          id: name,
          name,
        })
      ),
    },
  ];

  // Hàm thay đổi bộ lọc
  const handleFilterChange = (updatedListData) => {
    const updatedFilterValue = updatedListData.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    setFilterValue(updatedFilterValue); // Cập nhật giá trị bộ lọc
  };

  //hàm tạo và cập nhật

  const handleDeleteUser = async (id) => {
    if (id) {
      const response = await productService.deleteProducts(id);
      if (response) {
        fetchProduct();
      }
    }
  };

  //data của dữ liệu
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "tên danh mục" },
    { key: "imageUrl", label: "hình ảnh", isImage: true },
    { key: "createdAt", label: "ngày tạo" },
    { key: "updatedAt", label: "ngày cập nhật" },
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
      <DynamicSearchSort
        initialListData={listData}
        label="Chọn danh mục"
        onCategoryChange={(newCategory) => console.log(newCategory)} // Xử lý thay đổi danh mục (nếu có)
        onChange={handleFilterChange} // Cập nhật bộ lọc khi người dùng chọn
      />
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
            setEditingUser(null);
            setShowModal(true);
          }}
        >
          ➕ Thêm sản phẩm
        </Button>
      </div>
      {/* Hiển thị table với dữ liệu đã lọc và sắp xếp */}
      <DynamicTable
        columns={columns}
        data={sortedData}
        onEdit={(id) => {
          const selectedUser = sortedData.find((u) => u.id === id);
          setEditingUser(selectedUser);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm("Bạn có chắc muốn xóa user này?")) {
            handleDeleteUser(id);
          }
        }}
      />
      <ProductModalMui
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => fetchProduct()}
        initialData={editingUser}
      />
    </div>
  );
};

export default ProductComponent;
