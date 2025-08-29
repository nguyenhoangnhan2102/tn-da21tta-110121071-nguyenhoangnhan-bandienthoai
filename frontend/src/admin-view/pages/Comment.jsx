import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import "../style/dashboard.scss";
import commentService from "../../services/commentService";
import CommentModal from "../modal/comment-modal";
const imgURL = process.env.REACT_APP_IMG_URL;
const Comment = () => {
    const [comments, setComments] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const commentsPerPage = 10;
    const [openModal, setOpenModal] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        getAllCommentsData();
    }, []);

    const getAllCommentsData = async () => {
        try {
            const response = await commentService.getAllComments();
            // Parse chitiet JSON thành object
            const parsed = (response || []).map(cmt => ({
                ...cmt,
                chitiet: cmt.chitiet ? JSON.parse(cmt.chitiet) : null
            }));
            setComments(parsed);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };
    console.log("comment", comments);
    const openModalDelete = (comment) => {
        setSelectedComment(comment);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleDeleteComment = async () => {
        try {
            await commentService.deleteComment(selectedComment.madanhgia);
            toast.success("Ẩn bình luận thành công!");
            getAllCommentsData();
            setOpenDelete(false);
        } catch (error) {
            console.error("Error deleting comment:", error);
            setOpenDelete(false);
        }
    };

    const handleApprove = async (comment) => {
        try {
            let data = {
                trangthai: 1,
                sao: comment.sao,
                binhluan: comment.binhluan
            }

            await commentService.updateComment(comment.madanhgia, data);
            setOpenModal(false);
            getAllCommentsData();
        } catch (error) {
            toast.error("Lỗi khi duyệt bình luận");
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleViewDetails = (comment) => {
        setEditingComment(comment);
        setIsViewMode(true);
        setOpenModal(true);
    };

    const handleEdit = (comment) => {
        setEditingComment(comment);
        setIsViewMode(false);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingComment(null);
    };


    const indexOfLast = currentPage * commentsPerPage;
    const indexOfFirst = indexOfLast - commentsPerPage;

    const currentComments = comments
        .filter(
            (c) =>
                c.binhluan &&
                c.binhluan.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(comments.length / commentsPerPage);

    return (
        <>
            {/* Modal xác nhận xóa */}
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>Xác nhận ẩn bình luận</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn ẩn bình luận của "{selectedComment?.hoten}" không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <div
                        onClick={handleCloseDelete}
                        className="btn btn-danger"
                    >
                        Không
                    </div>
                    <div
                        onClick={handleDeleteComment}
                        className="btn btn-success"
                    >
                        Có
                    </div>
                </DialogActions>
            </Dialog>

            <div className="group-header">
                <h2>Danh sách bình luận</h2>
                <div className="filterGroup d-flex">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm nội dung bình luận"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ paddingRight: "30px", position: "relative" }}
                    />
                    <i
                        className="fa-solid fa-magnifying-glass"
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            color: "#000",
                        }}
                    ></i>
                </div>
            </div>

            {/* Bảng bình luận */}
            <table className="table table-hover">
                <thead className="thead-dark">
                    <tr className="table-title">
                        <th scope="col">STT</th>
                        <th scope="col">Người bình luận</th>
                        <th scope="col">Nội dung</th>
                        <th scope="col">Sản phẩm</th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                {console.log("currentComments", currentComments)}
                <tbody>
                    {currentComments && currentComments.length > 0 ? (
                        currentComments.map((comment, index) => (
                            <tr key={comment.madanhgia}>
                                <td>{(currentPage - 1) * commentsPerPage + index + 1}</td>
                                <td>
                                    {comment?.chitiet?.hoten} <br />
                                </td>
                                <td>{comment.binhluan}</td>
                                <td>{comment?.chitiet?.tensanpham}</td>
                                <td>
                                    {comment?.chitiet?.hinhanh ? (
                                        <img
                                            src={`${imgURL}${comment?.chitiet?.hinhanh}`}
                                            alt="Ảnh sản phẩm"
                                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        "Không có ảnh"
                                    )}
                                </td>
                                <td>
                                    {comment.trangthai === 1 ? (
                                        <span className="text-success">Đã duyệt</span>
                                    ) : (
                                        <span className="text-warning">Chờ duyệt</span>
                                    )}
                                </td>
                                <td className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => handleViewDetails(comment)}
                                    >
                                        <i className="fa-regular fa-eye"></i> Xem
                                    </button>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleEdit(comment)}
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i> Sửa
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => openModalDelete(comment)}
                                    >
                                        <i className="fa-solid fa-ban"></i> Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">
                                <h6>Không tìm thấy bình luận</h6>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end admin-pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
                        className={`page-item ${currentPage === totalPages || currentComments.length === 0 ? "disabled" : ""
                            }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages || currentComments.length === 0}
                        >
                            Sau
                        </button>
                    </li>
                </ul>
            </nav>
            <CommentModal
                comment={editingComment}
                open={openModal}
                onClose={handleCloseModal}
                onSave={async (form) => {
                    await handleApprove(form);   // gọi API cập nhật
                    handleCloseModal();          // đóng modal
                }}
                viewMode={isViewMode}
            />

        </>
    );
};

export default Comment;
