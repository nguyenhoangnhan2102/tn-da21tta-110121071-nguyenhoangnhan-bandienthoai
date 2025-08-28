import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "../style/dashboard.scss";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import statisticalService from "../../services/statisticalService";

// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardAdmin = () => {
  // state hiện tại
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]); // 🔹 Thêm state mới

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
    fetchOrderStatus(); // 🔹 Gọi API trạng thái đơn hàng
  }, [selectedDate, selectedMonth, selectedYear]);

  const fetchRevenueData = async () => {
    try {
      const resDay = await statisticalService.getRevenueByDay(selectedDate);
      setDailyRevenue(resDay.data);

      const resMonth = await statisticalService.getRevenueByMonth(selectedMonth, selectedYear);
      setMonthlyRevenue(resMonth.data);

      const resYear = await statisticalService.getRevenueByYear(selectedYear);
      setYearlyRevenue(resYear.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await statisticalService.getTop10Products();
      setTopProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm bán chạy:", error);
    }
  };

  // 🔹 Hàm lấy thống kê đơn hàng theo trạng thái
  const fetchOrderStatus = async () => {
    try {
      const res = await statisticalService.getOrderStatusSummary();
      setOrderStatus(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê trạng thái đơn hàng:", error);
    }
  };

  // 🔹 Biểu đồ Pie cho trạng thái đơn hàng
  const orderStatusChartData = {
    labels: orderStatus.map(item => item.trangthai),
    datasets: [
      {
        data: orderStatus.map(item => item.tong_donhang),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Các chart khác...
  const chartData = {
    labels: topProducts.map(product => product.tensanpham),
    datasets: [
      {
        label: "Số lượng bán",
        data: topProducts.map(product => parseInt(product.tongban)),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"
        ]
      }
    ]
  };

  const orderStatusMap = {
    choxacnhan: { label: "Chờ xác nhận", color: "#FFA500" },   // cam
    danggiao: { label: "Đang giao", color: "#36A2EB" },        // xanh dương
    hoanthanh: { label: "Hoàn thành", color: "#3BEA01" },      // xanh lá
    huy: { label: "Đã hủy", color: "#FF0000" }                 // đỏ
  };

  return (
    <div className="dashboard-container my-5">
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
          <Bar data={{
            labels: ["Ngày", "Tháng", "Năm"],
            datasets: [
              {
                label: `Ngày ${selectedDate}`,
                data: [dailyRevenue.reduce((sum, item) => sum + parseFloat(item.tong_doanh_thu), 0), 0, 0],
                backgroundColor: "rgba(75, 192, 192, 0.6)"
              },
              {
                label: `Tháng ${selectedMonth}/${selectedYear}`,
                data: [0, monthlyRevenue.reduce((sum, item) => sum + parseFloat(item.tong_doanh_thu), 0), 0],
                backgroundColor: "rgba(255, 159, 64, 0.6)"
              },
              {
                label: `Năm ${selectedYear}`,
                data: [0, 0, yearlyRevenue.reduce((sum, item) => sum + parseFloat(item.tong_doanh_thu), 0)],
                backgroundColor: "rgba(153, 102, 255, 0.6)"
              }
            ]
          }} options={{ responsive: true }} />
        </div>

        <div className="chart-card chart-card-small">
          <h4>Top 10 sản phẩm bán chạy</h4>
          <Pie data={chartData} />
        </div>
      </div>
      {/* 🔹 Thống kê trạng thái đơn hàng dạng bảng */}
      <div className="chart-card mt-4">
        <h4>Tổng trạng thái đơn hàng hiện tại</h4>
        <table className="order-status-table">
          <thead>
            <tr>
              <th>Trạng thái</th>
              <th>Tổng đơn</th>
              <th>Tổng tiền (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {orderStatus.map((item, index) => {
              const { label, color } = orderStatusMap[item.trangthai] || { label: item.trangthai, color: "#000" };

              return (
                <tr key={index}>
                  <td>
                    <span style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      marginRight: "8px"
                    }}></span>
                    {label}
                  </td>
                  <td>{item.tong_donhang}</td>
                  <td>{parseFloat(item.tong_tien || 0).toLocaleString("vi-VN")} ₫</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdmin;
