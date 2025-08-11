import { toast } from "react-toastify";
import axiosInstance from "../authentication/axiosInstance";

const apiUrl = process.env.REACT_APP_URL_SERVER;
const apiProduct = apiUrl + `/product`;

const productService = {
    // Lấy tất cả sản phẩm (trạng thái = 0)
    getAllProducts: async () => {
        try {
            const response = await axiosInstance.get(`${apiProduct}`);
            return response.data;
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    },

    // Lấy sản phẩm theo masanpham
    getProductById: async (product) => {
        try {
            const response = await axiosInstance.get(`${apiProduct}/${product.masanpham}`);
            return response.data;
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    },

    // Tạo sản phẩm mới (bao gồm chi tiết màu - dung lượng)
    createProduct: async (product) => {
        try {
            const response = await axiosInstance.post(`${apiProduct}`, product);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (masanpham, product) => {
        try {
            const response = await axiosInstance.put(`${apiProduct}/${masanpham}`, product);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa mềm sản phẩm (chỉ đổi trạng thái)
    deleteProduct: async (masanpham) => {
        try {
            const response = await axiosInstance.delete(`${apiProduct}/${masanpham}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi xóa sản phẩm có makhachhang = ${masanpham}:`, error);
            throw error;
        }
    },
};

export default productService;
