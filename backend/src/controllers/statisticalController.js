const connection = require("../config/database");

// Doanh thu theo ngày/tháng/năm (dùng query type=day|month|year)
const revenueByTime = async (req, res) => {
    try {
        const { type } = req.query; // "day" | "month" | "year"
        let groupBy = "DATE(dh.thoigiandat)";
        let label = "ngay";

        if (type === "month") {
            groupBy = "MONTH(dh.thoigiandat), YEAR(dh.thoigiandat)";
            label = "thang";
        } else if (type === "year") {
            groupBy = "YEAR(dh.thoigiandat)";
            label = "nam";
        }

        const [rows] = await connection.query(`
      SELECT ${groupBy} AS ${label}, SUM(dh.tongtien) AS doanhthu
      FROM DONHANG dh
      WHERE dh.trangthai = 'hoanthanh'
      GROUP BY ${groupBy}
      ORDER BY MIN(dh.thoigiandat) ASC
    `);

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Doanh thu theo sản phẩm
const revenueByProduct = async (req, res) => {
    try {
        const [rows] = await connection.query(`
      SELECT ctdh.masanpham, ctdh.tensanpham,
             SUM(ctdh.soluong) AS tong_soluong,
             SUM(ctdh.dongia * ctdh.soluong) AS doanhthu
      FROM CHITIETDONHANG ctdh
      JOIN DONHANG dh ON ctdh.madonhang = dh.madonhang
      WHERE dh.trangthai = 'hoanthanh'
      GROUP BY ctdh.masanpham, ctdh.tensanpham
      ORDER BY doanhthu DESC
    `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Doanh thu theo thương hiệu
const revenueByBrand = async (req, res) => {
    try {
        const [rows] = await connection.query(`
      SELECT th.tenthuonghieu,
             SUM(ctdh.soluong * ctdh.dongia) AS doanhthu
      FROM CHITIETDONHANG ctdh
      JOIN SANPHAM sp ON ctdh.masanpham = sp.masanpham
      JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
      JOIN DONHANG dh ON dh.madonhang = ctdh.madonhang
      WHERE dh.trangthai = 'hoanthanh'
      GROUP BY th.tenthuonghieu
      ORDER BY doanhthu DESC
    `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Doanh thu theo khách hàng
const revenueByCustomer = async (req, res) => {
    try {
        const [rows] = await connection.query(`
      SELECT nd.manguoidung, nd.hoten,
             SUM(dh.tongtien) AS doanhthu
      FROM DONHANG dh
      JOIN NGUOIDUNG nd ON dh.manguoidung = nd.manguoidung
      WHERE dh.trangthai = 'hoanthanh'
      GROUP BY nd.manguoidung, nd.hoten
      ORDER BY doanhthu DESC
    `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Doanh thu theo hình thức thanh toán
const revenueByPayment = async (req, res) => {
    try {
        const [rows] = await connection.query(`
      SELECT tt.hinhthucthanhtoan,
             SUM(dh.tongtien) AS doanhthu
      FROM THANHTOAN tt
      JOIN DONHANG dh ON tt.madonhang = dh.madonhang
      WHERE dh.trangthai = 'hoanthanh' AND tt.trangthai = 'dathanhtoan'
      GROUP BY tt.hinhthucthanhtoan
    `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    revenueByTime,
    revenueByProduct,
    revenueByBrand,
    revenueByCustomer,
    revenueByPayment
};
