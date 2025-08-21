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

    // 📊 Doanh thu theo ngày
    getRevenueByDay: async (date) => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/day`, {
                params: { ngay: date }   // yyyy-MM-dd
            });
            return res.data;
        } catch (error) {
            console.error("Error getRevenueByDay:", error);
            throw error;
        }
    },

    // 📊 Doanh thu theo tháng
    getRevenueByMonth: async (month, year) => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/month`, {
                params: { thang: month, nam: year }   // month: 1-12, year: yyyy
            });
            return res.data;
        } catch (error) {
            console.error("Error getRevenueByMonth:", error);
            throw error;
        }
    },

    // 📊 Doanh thu theo năm
    getRevenueByYear: async (year) => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/year`, {
                params: { nam: year }
            });
            return res.data;
        } catch (error) {
            console.error("Error getRevenueByYear:", error);
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
