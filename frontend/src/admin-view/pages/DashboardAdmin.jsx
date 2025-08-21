import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
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
  const [revenueStats, setRevenueStats] = useState({
    daily: [],
    monthly: [],
    yearly: [],
  });

  useEffect(() => {
    const fetchRevenueStats = async () => {
      try {
        const dailyRes = await statisticalService.getRevenueByTime("day");
        const monthlyRes = await statisticalService.getRevenueByTime("month");
        const yearlyRes = await statisticalService.getRevenueByTime("year");

        setRevenueStats({
          daily: dailyRes.data,
          monthly: monthlyRes.data,
          yearly: yearlyRes.data,
        });
      } catch (error) {
        console.error("Error fetching revenue stats:", error);
      }
    };

    fetchRevenueStats();
  }, []);

  // 📊 Biểu đồ doanh thu gộp
  const combinedChartData = {
    labels: [
      ...revenueStats.daily.map((item) =>
        new Date(item.ngay).toLocaleDateString("vi-VN")
      ),
      ...revenueStats.monthly.map(
        (item) => `${item.thang}/${item.nam || ""}`
      ),
      ...revenueStats.yearly.map((item) => item.nam),
    ],
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: revenueStats.daily.map((item) => item.doanhthu),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Doanh thu theo tháng",
        data: revenueStats.monthly.map((item) => item.doanhthu),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Doanh thu theo năm",
        data: revenueStats.yearly.map((item) => item.doanhthu),
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Thống kê doanh thu</h1>
      <Line data={combinedChartData} />
    </div>
  );
};

export default DashboardAdmin;
