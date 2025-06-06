import { toast } from "react-toastify";
import axiosInstance from "../authentication/axiosInstance";

const apiUrl = process.env.REACT_APP_URL_SERVER;
const apiProduct = apiUrl + `/product`;

const productService = {
    // Lấy tất cả sản phẩm
    getAllProducts: async () => {
        try {
            const response = await axiosInstance.get(apiProduct);
            return response.data.DT;
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách sản phẩm");
            console.error("getAllProducts error:", error.message);
            return [];
        }
    },

    // Lấy sản phẩm theo masanpham
    getProductById: async (masanpham) => {
        try {
            const response = await axiosInstance.get(`${apiProduct}/${masanpham}`);
            return response.data.DT;
        } catch (error) {
            toast.error("Lỗi khi lấy chi tiết sản phẩm");
            console.error("getProductById error:", error.message);
            return null;
        }
    },

    // Tạo sản phẩm mới (bao gồm các biến thể dung lượng và màu sắc)
    createProduct: async (formData) => {
        try {
            const response = await axiosInstance.post(apiProduct, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.EC === 1) {
                toast.success(response.data.EM);
                return true;
            } else {
                toast.error(response.data.EM);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi tạo sản phẩm");
            console.error("createProduct error:", error.message);
            return false;
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (masanpham, formData) => {
        try {
            const response = await axiosInstance.put(`${apiProduct}/${masanpham}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.EC === 0) {
                toast.success(response.data.EM);
                return true;
            } else {
                toast.error(response.data.EM);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật sản phẩm");
            console.error("updateProduct error:", error.message);
            return false;
        }
    },

    // Xóa mềm sản phẩm (chỉ đổi trạng thái)
    deleteProduct: async (masanpham) => {
        try {
            const response = await axiosInstance.delete(`${apiProduct}/${masanpham}`);
            if (response.data.EC === 1) {
                toast.success(response.data.EM);
                return true;
            } else {
                toast.error(response.data.EM);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm");
            console.error("deleteProduct error:", error.message);
            return false;
        }
    },
};

export default productService;
