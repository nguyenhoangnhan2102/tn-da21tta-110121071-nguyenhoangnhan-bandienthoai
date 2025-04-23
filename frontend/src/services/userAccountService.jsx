import { toast } from "react-toastify";
import axiosInstance from "../authentication/axiosInstance";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_API_URL;
const apiUser = apiUrl + '/users';

export const getAllUser = async () => {
  try {
    const response = await axiosInstance.get(`${apiUser}`);
    return response.data;
  } catch (error) {
    console.error("Error!!!");
  }
}

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.post(`${apiUser}/profile`);
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
};


export const login = async (account) => {
  try {
    const response = await axiosInstance.post(`${apiUser}/login`, {
      account,
    });
    console.log("response", response);
    if (response.data.EC === 200) {
      Cookies.set("accessToken", response.data.DT.accessToken, {
        expires: 1,
        path: "",
      });
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    toast.error(error.response.data.EM);
  }
};

export const verifyAdmin = async (accessToken) => {
  if (!accessToken) {
    console.log("No access token found");
    return false;
  }
  try {
    const response = await axiosInstance.post(`${apiUrl}/verify-admin`, {
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
};