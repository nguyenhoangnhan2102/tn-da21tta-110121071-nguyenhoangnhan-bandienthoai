import { toast } from "react-toastify";
import axiosInstance from "../authentication/axiosInstance";

const apiUrl = process.env.REACT_APP_URL_SERVER;
const apiBrand = apiUrl + `/brand`;

const brandService = {
    // Lấy tất cả thương hiệu (trạng thái = 0)
    getAllBrand: async () => {
        try {
            const response = await axiosInstance.get(apiBrand);
            return response.data.DT;
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách thương hiệu");
            console.error("getAllBrand error:", error.message);
            return [];
        }
    },

    // Tạo thương hiệu mới
    createBrand: async (tenthuonghieu) => {
        try {
            const response = await axiosInstance.post(apiBrand, { tenthuonghieu });
            if (response.data.EC === 1) {
                toast.success(response.data.EM);
                return true;
            } else {
                toast.error(response.data.EM);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi tạo thương hiệu");
            console.error("createBrand error:", error.message);
            return false;
        }
    },

    // Cập nhật thương hiệu
    updateBrand: async (mathuonghieu, tenthuonghieu) => {
        try {
            const response = await axiosInstance.put(`${apiBrand}/${mathuonghieu}`, {
                tenthuonghieu,
            });
            if (response.data.EC === 1) {
                toast.success(response.data.EM);
                return true;
            } else {
                toast.error(response.data.EM);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật thương hiệu");
            console.error("updateBrand error:", error.message);
            return false;
        }
    },

    // Xóa mềm thương hiệu
    deleteBrand: async (mathuonghieu) => {
        try {
            const response = await axiosInstance.delete(`${apiBrand}/${mathuonghieu}`);
            if (response.data.EC === 1) {
                toast.success(response.data.EM);
                return true;
            } else {
                toast.error(response.data.EM);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xóa thương hiệu");
            console.error("deleteBrand error:", error.message);
            return false;
        }
    },
};

export default brandService;
