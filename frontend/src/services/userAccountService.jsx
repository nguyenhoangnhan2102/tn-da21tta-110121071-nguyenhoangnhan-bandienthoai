import { toast } from "react-toastify";
import axiosInstance from "../authentication/axiosInstance";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_URL_SERVER;
const apiUser = apiUrl + '/user';

const userService = {
  getAllUser: async () => {
    try {
      const response = await axiosInstance.get(`${apiUser}`);
      return response.data;
    } catch (error) {
      console.error("Error!!!");
    }
  },

  getUserProfile: async () => {
    try {
      const response = await axiosInstance.post(`${apiUser}/manguoidung`);
      if (response.data.EC === 200) {
        return response.data.DT; // Trả về thông tin người dùng
      } else {
        toast.error(response.data.EM); // Hiển thị thông báo lỗi
        return null;
      }
    } catch (error) {
      toast.error("Xảy ra lỗi khi lấy thông tin người dùng");
      console.error("Error in getUserProfile:", error.message);
      return null;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(`${apiUser}/login`, {
        email, password,
      });
      return response.data.DT;
    } catch (error) {
      toast.error(error.response.data.EM);
    }
  },

  loginGoogleUser: async (email, hoten) => {
    try {
      const res = await axiosInstance.post(`${apiUser}/login/google`, { email, hoten });
      return res.data.DT;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post(`${apiUser}/logout`);
      if (response.data.message) {
        toast.success(response.data.message); // Thông báo thành công nếu có
      }
      return true;
    } catch (error) {
      toast.error("Đăng xuất thất bại");
      console.error("Error during logout:", error);
      return false;
    }
  },

  verifyAdmin: async (accessToken) => {
    if (!accessToken) {
      console.log("No access token found");
      return false;
    }
    try {
      const response = await axiosInstance.post(`${apiUser}/verify-admin`, {
        token: accessToken,
      });

      if (response.data.DT.isAdmin) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },
}

export default userService;