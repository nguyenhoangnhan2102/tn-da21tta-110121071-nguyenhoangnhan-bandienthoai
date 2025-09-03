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

// Hàm upload nhiều file
// Cập nhật hàm uploadMultipleFiles trong file fileService.js hoặc tương tự

export const uploadMultipleFiles = async (folderPath, files) => {
    try {
        const formData = new FormData();
        formData.append("folderPath", folderPath);

        // Thêm từng file vào formData
        files.forEach(file => {
            formData.append("files", file);
        });

        const response = await axios.post(
            `${apiUrl}/uploadMultipleFiles`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        // Trích xuất và trả về mảng chỉ chứa tên file
        const fileNames = response.data.uploadedFiles.map(file => file.fileName);
        return fileNames;
    } catch (error) {
        console.error("Upload multiple files error:", error);
        throw error;
    }
};

