import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/product.scss';
import {
  Typography,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from 'react-toastify';
import { uploadMultipleFiles, uploadSingleFile } from "../../services/fileService";
import ModalProduct from "../modal/product-modal";
import ProductDetailModal from "../modal/detailProduct-modal";
import { getAllManufacturer } from "../../services/manufacturerService";
import productService from "../../services/productService";

const imgURL = process.env.REACT_APP_IMG_URL;
console.log("imgURL", imgURL)
const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [manufacturers, setListManufacturer] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [oldImgUrl, setImgUrl] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [isDelete, checkDelete] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 10;

  useEffect(() => {
    getAllProductData();
    getAllManufacturerData();
  }, []);

  const getAllProductData = async () => {
    try {
      const response = await productService.getAllProducts();
      if (response.EC === 1) {
        const sortedProducts = response.DT.queryActiveAdmin.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProducts(sortedProducts);
      } else {
        console.error("Lỗi tìm kiếm sản phẩm");
      }
    } catch (err) {
      console.error("Đã xảy ra lỗi", err);
    }
  };

  const getAllManufacturerData = async () => {
    try {
      const response = await getAllManufacturer();
      if (response.EC === 1) {
        setListManufacturer(response.DT.activeManufacturer);
      } else {
        console.error("Failed to fetch");
      }
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setOpenModal(true);
    setIsViewOnly(false); // Chế độ nhập dữ liệu
  };

  const handleViewDetails = (product) => {
    setImgUrl(product.hinhanh);
    setSelectedProduct(product);
    setIsViewOnly(true); // Chế độ nhập dữ liệu
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    console.log("pro", product)
    setImgUrl(product.hinhanh);
    setSelectedProduct(product);
    setIsViewOnly(false); // Chế độ nhập dữ liệu
    setOpenModal(true);
  };

  // ... (code handleSave đã sửa trước đó)
  const handleSave = async (product) => {
    try {
      let imageUrls = Array.isArray(oldImgUrl) ? oldImgUrl : [];
      let fileToUpload = product.hinhanh;

      if (Array.isArray(fileToUpload) && fileToUpload.every(file => file instanceof File)) {
        // uploadMultipleFiles bây giờ trả về mảng tên file
        const newFileNames = await uploadMultipleFiles("image_product", fileToUpload);
        // Gộp mảng các tên file mới vào mảng các tên file cũ
        imageUrls = [...imageUrls, ...newFileNames];
      }

      // Chuyển mảng URL thành chuỗi ngăn cách bằng dấu phẩy
      const hinhanhString = imageUrls.join(",");

      const productData = {
        ...product,
        hinhanh: hinhanhString,
      };

      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.masanpham, productData);
        toast.success("Cập nhật thành công!!!");
      } else {
        await productService.createProduct(productData);
        toast.success("Tạo mới thành công!!!");
      }

      setSelectedProduct(null);
      setOpenModal(false);
      getAllProductData();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Lỗi khi lưu sản phẩm.");
    }
  };

  const openModalDelete = (product) => {
    checkDelete(true);
    setOpenDelete(true);
    setSelectedProduct(product);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await productService.deleteProduct(selectedProduct.masanpham);
      if (response.EC === 1) {
        toast.success("Xóa thành công!");
        getAllProductData();
      } else {
        console.log(response.EM);
      }
      setOpenDelete(false);
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert("Đã xảy ra lỗi khi xóa sản phẩm.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterByManufacturer = (e) => {
    setSelectedManufacturer(e.target.value);
    setCurrentPage(1);
  };


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = products
    .filter((product) => {
      const matchesSearchTerm = product.tensanpham.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesManufacturer = selectedManufacturer
        ? product.tenthuonghieu === selectedManufacturer
        : true;
      return matchesSearchTerm && matchesManufacturer;
    })
    .slice(indexOfFirstProduct, indexOfLastProduct);


  const totalPages = Math.ceil(products.length / productsPerPage);
  console.log("currentProducts", currentProducts)
  return (
    <>
      <div>
        <Dialog open={openDelete} onClose={handleCloseDelete}>
          <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa "{selectedProduct?.tensanpham}" không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <div
              onClick={handleCloseDelete}
              color="primary"
              className="btn btn-danger"
            >
              <i className="fa-solid fa-x"></i> Không
            </div>
            <div
              onClick={handleDeleteProduct}
              className="btn btn-success"
            >
              <i className="fa-solid fa-check"></i> Có
            </div>
          </DialogActions>
        </Dialog>
        <div className="group-header mt-3">
          <h2>Danh sách sản phẩm</h2>
          <div className="d-flex gap-2 justify-content-end align-items-center my-3">
            <div className="filterGroup" style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={handleSearch}
                style={{ paddingRight: '30px' }} // Chừa khoảng trống cho icon
              />
              <i
                className="fa-solid fa-magnifying-glass"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#000'
                }}
              ></i>
            </div>
            <div>
              <select
                value={selectedManufacturer}
                onChange={handleFilterByManufacturer}
                className="form-select"
              >
                <option value="">Thương hiệu</option>
                {manufacturers && manufacturers.map((manu, index) => (
                  <option key={index} value={manu.tenthuonghieu}>{manu.tenthuonghieu}</option>
                ))}
              </select>

            </div>
            <div className="btn-header-table">
              <button className="btn btn-sm btn-success mr-2" onClick={handleCreate}>
                <i className="fa-solid fa-plus"></i> Thêm
              </button>
            </div>
          </div>
        </div>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr className="table-title">
              <th scope="col">STT</th>
              <th scope="col">Tên</th>
              <th scope="col">Thương hiệu</th>
              <th scope="col">Sale (%)</th>
              <th scope="col">Giá</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Hệ điều hành</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <tr key={product.masanpham}>
                  {console.log("product", product)}
                  <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                  <td>{product.tensanpham || "Không có tên"}</td>
                  <td>{product.tenthuonghieu || "Không có thể loại"}</td>
                  <td>{product.khuyenmai || 0}</td>
                  <td>
                    {product.giasaugiam
                      ? Number(product.giasaugiam).toLocaleString("vi-VN", {
                        minimumFractionDigits: 0,
                      }) + "đ"
                      : 0 + "đ"}
                  </td>
                  <td>{product.soluong || 0}</td>
                  <td>{product.hedieuhanh || "Không có giá"}</td>
                  <td>{product.trangthai === 0 ? "Đã duyệt" : "Chưa duyệt"}</td>
                  <td>
                    {product.hinhanh && (
                      <img
                        width="70px"
                        height="70px"
                        // Tách chuỗi bằng dấu phẩy và lấy phần tử đầu tiên
                        src={`${imgURL}${product?.hinhanh?.split(',')[0]}`}
                        alt={product.tensanpham || "Hình ảnh sản phẩm"}
                      />
                    )}
                  </td>
                  <td className="d-flex align-items-center justify-content-between gap-1 func-button" style={{ border: 'none' }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleViewDetails(product)}
                    >
                      <i className="fa-regular fa-eye"></i> Xem
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(product)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => openModalDelete(product)}
                    >
                      <i className="fa-solid fa-trash"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center' }}>
                  <h6>Không tìm thấy</h6>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-end admin-pagination">
            <li
              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages || currentProducts.length === 0 ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || currentProducts.length === 0}
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <ModalProduct
        product={selectedProduct}
        open={openModal}
        onSave={handleSave}
        onClose={() => setOpenModal(false)}
        isViewOnly={isViewOnly}
      />
      <ProductDetailModal
        product={selectedProduct}
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
      />
    </>
  );
};

export default ProductComponent;
