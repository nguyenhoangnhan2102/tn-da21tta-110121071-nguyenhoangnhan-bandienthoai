import axiosInstance from "../authentication/axiosInstance";

const apiUrl = process.env.REACT_APP_API_URL;
const apiStatistical = apiUrl + `/statistical`;

const statisticalService = {
    // 📊 Doanh thu theo thời gian (ngày / tháng / năm)
    getRevenueByTime: async ({ type = "day", date, month, year }) => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/revenue/time`, {
                params: { type, date, month, year }
            });
            return res.data;
        } catch (error) {
            console.error("Error getRevenueByTime:", error);
            throw error;
        }
    },

    // 📊 Doanh thu theo sản phẩm
    getRevenueByProduct: async () => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/revenue/product`);
            return res.data;
        } catch (error) {
            console.error("Error getRevenueByProduct:", error);
            throw error;
        }
    },

    // 📊 Doanh thu theo thương hiệu
    getRevenueByBrand: async () => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/revenue/brand`);
            return res.data;
        } catch (error) {
            console.error("Error getRevenueByBrand:", error);
            throw error;
        }
    },

    // 📊 Doanh thu theo khách hàng
    getRevenueByCustomer: async () => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/revenue/customer`);
            return res.data;
        } catch (error) {
            console.error("Error getRevenueByCustomer:", error);
            throw error;
        }
    },

    // 📊 Doanh thu theo hình thức thanh toán
    getRevenueByPayment: async () => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/revenue/payment`);
            return res.data;
        } catch (error) {
            console.error("Error getRevenueByPayment:", error);
            throw error;
        }
    }
};

export default statisticalService;
