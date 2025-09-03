
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Typography,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import "../style/dashboard.scss";
import ModalManufacturer from "../modal/manufacturer-modal";
import { createManufacturer, deleteManufacturer, getAllManufacturer, updateManufacturer } from "../../services/manufacturerService";

const Manufacturer = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isDelete, checkDelete] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
    const manufacturersPerPage = 10; // Số phim hiển thị mỗi trang

    useEffect(() => {
        getAllManufacturerData();
    }, []);

    const getAllManufacturerData = async () => {
        try {
            const response = await getAllManufacturer();
            if (response.EC === 1) {
                setManufacturers(response.DT.allManufacturer);
            } else {
                console.error("Failed to fetch");
            }
        } catch (err) {
            console.error("Error occurred", err);
        }
    };

    const handleCreate = () => {
        setSelectedManufacturer(null);
        setOpenModal(true);
    };

    const handleEdit = (manufacturer) => {
        setSelectedManufacturer(manufacturer);
        setOpenModal(true);
    };

    const handleSave = async (manufacturer) => {
        try {
            const manufacturerData = {
                ...manufacturer,
            };

            if (selectedManufacturer) {
                await updateManufacturer(selectedManufacturer.mathuonghieu, manufacturerData);
                toast.success("Cập nhật thành công!!!");
            } else {
                await createManufacturer(manufacturerData);
                toast.success("Tạo mới thành công!!!");
            }

            setSelectedManufacturer(null);
            setOpenModal(false);
            getAllManufacturerData();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                console.error("Error saving manufacturer:", error);
                toast.error("Có lỗi xảy ra!");
            }
        }
    };


    const openModalDelete = (manufacturer) => {
        checkDelete(true);
        setOpenDelete(true);
        setSelectedManufacturer(manufacturer);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleDeleteManufacturer = async () => {
        try {
            const response = await deleteManufacturer(selectedManufacturer.mathuonghieu);
            if (response.EC === 1) {
                toast.success("Xóa thành công!");
                // Lấy lại danh sách từ server để đảm bảo dữ liệu chính xác
                getAllManufacturerData();
            } else {
                console.error(response.EM);
                alert("Xóa thất bại: " + response.EM);
            }
            setOpenDelete(false);
        } catch (error) {
            console.error("Error deleting category:", error);
            setOpenDelete(false);
        }
    };


    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const indexOfLast = currentPage * manufacturersPerPage;
    const indexOfFirst = indexOfLast - manufacturersPerPage;

    const currentManufacuter = manufacturers
        .filter(
            (manufacturer) =>
                manufacturer.tenthuonghieu && // Kiểm tra tenloai tồn tại trước khi gọi toLowerCase
                manufacturer.tenthuonghieu.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(manufacturers.length / manufacturersPerPage);

    return (
        <>
            <div>
                <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc chắn muốn xóa "{selectedManufacturer?.mathuonghieu}" không?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <div
                            onClick={handleCloseDelete}
                            color="primary"
                            className="btn btn-danger"
                        >
                            Không
                        </div>
                        <div
                            onClick={handleDeleteManufacturer}
                            className="btn btn-success"
                        >
                            Có
                        </div>
                    </DialogActions>
                </Dialog>
                <div className="group-header mt-3">
                    <h2>Danh sách thương hiệu</h2>
                    <div className="filterGroup gap-2 align-items-center d-flex justify-content-end my-3">
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ width: "224px" }}
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
                            <th scope="col">Tên thương hiệu</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Sản phẩm thuộc</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentManufacuter && currentManufacuter.length > 0 ? (
                            currentManufacuter.map((manufacturer, index) => {
                                const isDisabled = manufacturer.trangthaithuonghieu === 1;
                                const products = manufacturer.sanpham ? manufacturer.sanpham.split(',') : [];

                                return (
                                    <tr
                                        key={manufacturer.mathuonghieu}
                                        className={`${isDisabled ? 'opacity-50' : ''}`}
                                    >
                                        <td>{(currentPage - 1) * manufacturersPerPage + index + 1}</td>
                                        <td>{manufacturer.tenthuonghieu || "Không có tên"}</td>
                                        <td>
                                            {manufacturer.trangthaithuonghieu === 0 ? "Hoạt động" : "Không hoạt động"}
                                        </td>
                                        <td>
                                            {products.length > 0 ? (
                                                products.map((product, productIndex) => (
                                                    <span key={productIndex}>{product},<br /></span>
                                                ))
                                            ) : "Không có sản phẩm"}
                                        </td>
                                        <td className="d-flex gap-2" style={{ border: 'none', height: '100%' }}>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleEdit(manufacturer)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i> Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => openModalDelete(manufacturer)}
                                            >
                                                <i className="fa-solid fa-trash"></i> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="12">
                                    <h6>Không tìm thấy sản phẩm</h6>
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
                            className={`page-item ${currentPage === totalPages || currentManufacuter.length === 0 ? "disabled" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages || currentManufacuter.length === 0}
                            >
                                Sau
                            </button>
                        </li>
                    </ul>
                </nav>
            </div >
            <ModalManufacturer
                manufacturer={selectedManufacturer}
                open={openModal}
                onSave={handleSave}
                onClose={() => setOpenModal(false)}
            />
        </>
    )
}

export default Manufacturer;