import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DynamicTable from "../../share/dynamicTable-component";
import productService from "../../services/productService";
import ProductFormModal from "../modal/product-modal";
import ProductDetailModal from "../modal/detailProduct-modal";
import { toast } from "react-toastify";

const API_IMG_URL = process.env.REACT_APP_URL_SERVER + "/images";

const ProductComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState({});
  const [sortColumn, setSortColumn] = useState("masanpham");
  const [sortOrder, setSortOrder] = useState("asc");

  const [products, setProducts] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response || []);
      console.log("response".response)
    } catch (error) {
      toast.error("Lỗi tải danh sách sản phẩm");
    }
  };

  // Mở modal thêm/sửa sản phẩm
  const openFormModal = (product = null) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  // Đóng modal thêm/sửa
  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingProduct(null);
  };

  // Mở modal xem chi tiết
  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  // Đóng modal xem chi tiết
  const closeDetailModal = () => {
    setSelectedProduct(null);
    setShowDetailModal(false);
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Đóng modal xác nhận xóa
  const closeDeleteModal = () => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };

  // Xác nhận xóa sản phẩm
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const success = await productService.deleteProduct(productToDelete.masanpham);
    if (success) {
      toast.success("Xóa sản phẩm thành công");
      fetchProducts();
    } else {
      toast.error("Xóa sản phẩm thất bại");
    }
    closeDeleteModal();
  };

  // Tìm kiếm + lọc (nếu có)
  const filteredProducts = products.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = item.tensanpham?.toLowerCase().includes(searchLower);
    const matchFilter = Object.entries(filterValue).every(([key, value]) =>
      value ? item[key] === value : true
    );
    return matchSearch && matchFilter;
  });

  // Sắp xếp
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Map thêm trường hiển thị trạng thái và id
  const displayProducts = sortedProducts.map((item) => ({
    ...item,
    id: item.masanpham,
    trangthaiText: item.trangthai === 0 ? "Hoạt động" : "Không hoạt động",
  }));

  const columns = [
    { key: "masanpham", label: "ID" },
    { key: "tensanpham", label: "Tên" },
    { key: "hinhanh", label: "Hình ảnh", isImage: true },
    { key: "hedieuhanh", label: "Hệ điều hành" },
    { key: "tenthuonghieu", label: "Thương hiệu" },
    { key: "trangthaiText", label: "Trạng thái" },
  ];

  const handleSave = async (product) => {
    try {
      const productData = {
        ...product
      };
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.masanpham, productData); // Gọi API cập nhật
        toast.success("Cập nhật thành công!!!")

      } else {
        await productService.createProduct(productData); // Gọi API tạo mới
        toast.success("Tạo mới thành công!!!")
      }
      setSelectedProduct(null);
      setShowFormModal(false);
      fetchProducts(); // Lấy lại danh sách 
    } catch (error) {
      console.error("Error saving hotel:", error);
    }
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        📋 Danh sách sản phẩm
      </Typography>

      <Box sx={{ mb: 2 }}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
      </Box>

      <Box sx={{ mb: 2, textAlign: "right" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openFormModal(null)}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <DynamicTable
        columns={columns}
        data={displayProducts}
        onEdit={(id) => {
          const p = displayProducts.find((x) => x.masanpham === id);
          openFormModal(p);
        }}
        onView={(id) => {
          const p = displayProducts.find((x) => x.masanpham === id);
          openDetailModal(p);
        }}
        onDelete={(id) => {
          const p = displayProducts.find((x) => x.masanpham === id);
          openDeleteModal(p);
        }}
        showViewButton={true}
      />

      {/* Modal thêm/sửa sản phẩm */}
      {showFormModal && (
        <ProductFormModal
          open={showFormModal}
          onClose={closeFormModal}
          onSave={handleSave}
          product={editingProduct}
          isView={false}
          imageBaseUrl={API_IMG_URL}
        />
      )}

      {/* Modal xem chi tiết sản phẩm */}
      {showDetailModal && (
        <ProductDetailModal
          open={showDetailModal}
          onClose={closeDetailModal}
          product={selectedProduct}
          isView={true}
          imageBaseUrl={API_IMG_URL}
        />
      )}

      {/* Modal xác nhận xóa sản phẩm */}
      <Dialog open={deleteModalOpen} onClose={closeDeleteModal}>
        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa sản phẩm{" "}
            <strong>{productToDelete?.tensanpham}</strong> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Xóa
          </Button>
          <Button onClick={closeDeleteModal} variant="outlined" color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductComponent;
