import axiosInstance from "../authentication/axiosInstance";

const apiUrl = process.env.REACT_APP_API_URL;
const apiStatistical = apiUrl + `/statistical`;

const statisticalService = {
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

    // 🔝 Top 10 sản phẩm bán chạy nhất
    getTop10Products: async () => {
        try {
            const res = await axiosInstance.get(`${apiStatistical}/top10-products`);
            return res.data;
        } catch (error) {
            console.error("Error getTop10Products:", error);
            throw error;
        }
    },
};

export default statisticalService;
