import { toast } from "react-toastify";
import axiosInstance from "../authentication/axiosInstance";

const apiUrl = process.env.REACT_APP_API_URL;
const apiProduct = apiUrl + `/comment`;

const commentService = {
    // Thêm bình luận
    async createComment(data) {
        try {
            const res = await axiosInstance.post(apiProduct, data);
            toast.success("Bình luận thành công!");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi thêm bình luận");
            throw err;
        }
    },

    // Lấy bình luận theo sản phẩm
    async getCommentsByProduct(masanpham) {
        try {
            const res = await axiosInstance.get(`${apiProduct}/${masanpham}`);
            return res.data;
        } catch (err) {
            console.error("Lỗi khi tải bình luận sản phẩm");
            throw err;
        }
    },

    // Cập nhật bình luận
    async updateComment(madanhgia, data) {
        try {
            const res = await axiosInstance.put(`${apiProduct}/${madanhgia}`, data);
            toast.success("Cập nhật bình luận thành công!");
            return res.data;
        } catch (err) {
            toast.error("Lỗi khi cập nhật bình luận");
            throw err;
        }
    },

    // Xóa (ẩn) bình luận
    async deleteComment(madanhgia) {
        try {
            const res = await axiosInstance.delete(`${apiProduct}/${madanhgia}`);
            toast.success("Xóa bình luận thành công!");
            return res.data;
        } catch (err) {
            toast.error("Lỗi khi xóa bình luận");
            throw err;
        }
    },
};

export default commentService;
