import axiosInstance from "../authentication/axiosInstance";
const apiUrl = process.env.REACT_APP_API_URL;
const apiManufacturer = apiUrl + "/manufactureres";

export const getAllManufacturer = async () => {
    try {
        const response = await axiosInstance.get(`${apiManufacturer}`);
        return response.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
};

export const createManufacturer = async (manufacturer) => {
    try {
        const response = await axiosInstance.post(`${apiManufacturer}`, manufacturer);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateManufacturer = async (mathuonghieu, manufacturer) => {
    try {
        const response = await axiosInstance.put(`${apiManufacturer}/${mathuonghieu}`, manufacturer);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteManufacturer = async (mathuonghieu) => {
    console.log("mathuonghieu", mathuonghieu)
    try {
        const response = await axiosInstance.delete(`${apiManufacturer}/${mathuonghieu}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting manufacturer with makhachhang ${mathuonghieu}:`, error);
        throw error;
    }
};