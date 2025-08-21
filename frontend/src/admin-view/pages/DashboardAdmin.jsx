import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import statisticalService from "../../services/statisticalService";
import '../style/dashboard.scss';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const DashboardAdmin = () => {
  const [type, setType] = useState("day");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await statisticalService.getRevenueByTime({
          type,
          date: type === "day" ? date : undefined,
          month:
            type === "day" && month
              ? month
              : type === "month" && month
                ? new Date(month).getMonth() + 1
                : undefined,
          year:
            type === "day" && date
              ? new Date(date).getFullYear()
              : type === "month" && month
                ? new Date(month).getFullYear()
                : type === "year"
                  ? year
                  : undefined,
        });
        setRevenue(res.data || []);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };
    fetchRevenue();
  }, [type, date, month, year]);

  const chartData = {
    labels:
      type === "day"
        ? revenue.map((item) => new Date(item.ngay).toLocaleDateString("vi-VN"))
        : type === "month"
          ? revenue.map((item) => `${item.thang}/${item.nam}`)
          : revenue.map((item) => item.nam),
    datasets: [
      {
        label:
          type === "day"
            ? "Doanh thu theo ngày"
            : type === "month"
              ? "Doanh thu theo tháng"
              : "Doanh thu theo năm",
        data: revenue.map((item) => item.doanhthu),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#36A2EB",
        pointBorderColor: "#fff",
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Thống kê doanh thu</h1>

      {/* Bộ lọc */}
      <div className="filter-container">
        <label className="filter-label">Chọn kiểu thống kê:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="filter-select"
        >
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>

        {type === "day" && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="filter-input"
          />
        )}

        {type === "month" && (
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="filter-input"
          />
        )}

        {type === "year" && (
          <input
            type="number"
            placeholder="Nhập năm"
            min="2000"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="filter-input"
          />
        )}
      </div>

      {/* Biểu đồ */}
      <div className="chart-container">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default DashboardAdmin;
