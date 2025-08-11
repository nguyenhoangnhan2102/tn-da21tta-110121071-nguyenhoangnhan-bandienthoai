/* eslint-disable no-useless-catch */
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
// Hàm upload file
export const uploadSingleFile = async (imageUrl, folderPath, file) => {
    try {
        const formData = new FormData();

        // Thêm các trường vào formData
        formData.append("imgName", imageUrl); // Thêm makhachhang
        formData.append("folderPath", folderPath); // Thêm folderPath
        formData.append("file", file); // Thêm file (file ở đây là đối tượng file từ input)

        // Gửi formData qua POST request
        const response = await axios.post(`${apiUrl}/uploadSingleFile`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Đặt Content-Type cho multipart
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};
