import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "../style/dashboard.scss";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import statisticalService from "../../services/statisticalService";

// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardAdmin = () => {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const formattedMonth = (today.getMonth() + 1).toString().padStart(2, "0");
  const formattedYear = today.getFullYear().toString();

  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [selectedMonth, setSelectedMonth] = useState(formattedMonth);
  const [selectedYear, setSelectedYear] = useState(formattedYear);

  useEffect(() => {
    fetchRevenueData();
    fetchTopProducts();
  }, [selectedDate, selectedMonth, selectedYear]);

  const fetchRevenueData = async () => {
    try {
      // 📊 Doanh thu theo ngày
      const resDay = await statisticalService.getRevenueByDay(selectedDate);
      setDailyRevenue(resDay.data);

      // 📊 Doanh thu theo tháng
      const resMonth = await statisticalService.getRevenueByMonth(selectedMonth, selectedYear);
      setMonthlyRevenue(resMonth.data);

      // 📊 Doanh thu theo năm
      const resYear = await statisticalService.getRevenueByYear(selectedYear);
      setYearlyRevenue(resYear.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    }
  };

  const formatCombinedChartData = () => {
    const dailyTotal = dailyRevenue.reduce((sum, item) => sum + parseFloat(item.tong_doanh_thu), 0);
    const monthlyTotal = monthlyRevenue.reduce((sum, item) => sum + parseFloat(item.tong_doanh_thu), 0);
    const yearlyTotal = yearlyRevenue.reduce((sum, item) => sum + parseFloat(item.tong_doanh_thu), 0);

    return {
      labels: ["Ngày", "Tháng", "Năm"],
      datasets: [
        {
          label: `Doanh thu Ngày ${selectedDate}`,
          data: [dailyTotal, 0, 0],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: `Doanh thu Tháng ${selectedMonth}/${selectedYear}`,
          data: [0, monthlyTotal, 0],
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
        {
          label: `Doanh thu Năm ${selectedYear}`,
          data: [0, 0, yearlyTotal],
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const fetchTopProducts = async () => {
    try {
      // ⚠️ API top sản phẩm bán chạy chưa được đưa vào service nên vẫn dùng axios hoặc bổ sung vào service
      const response = await fetch(`${process.env.REACT_APP_API_URL}/revenue/top5-products`);
      const data = await response.json();
      setTopProducts(data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm bán chạy:", error);
    }
  };

  const chartData = {
    labels: topProducts.map(product => product.tensanpham),
    datasets: [
      {
        data: topProducts.map(product => product.tongban),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"
        ]
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <h2>Thống kê doanh thu</h2>

      {/* Bộ lọc */}
      <div className="filter-section">
        <label>
          Chọn ngày:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>

        <label>
          Chọn tháng:
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {[...Array(12)].map((_, i) => {
              const month = (i + 1).toString().padStart(2, "0");
              return <option key={month} value={month}>{month}</option>;
            })}
          </select>
        </label>

        <label>
          Chọn năm:
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Layout biểu đồ */}
      <div className="charts-wrapper">
        <div className="chart-card">
          <h4>Doanh thu tổng hợp</h4>
          <Bar data={formatCombinedChartData()} />
        </div>

        <div className="chart-card chart-card-small">
          <h4>Top 5 sản phẩm bán chạy</h4>
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
