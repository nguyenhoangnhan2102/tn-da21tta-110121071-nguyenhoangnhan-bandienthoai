const connection = require("../config/database");

// Doanh thu theo ngày/tháng/năm (dùng query type=day|month|year)
// Doanh thu theo ngày/tháng/năm (có thể lọc theo ngày/tháng/năm cụ thể)
const revenueByTime = async (req, res) => {
    try {
        const { type, date, month, year } = req.query; // type = "day" | "month" | "year"

        let groupBy = "DATE(dh.thoigiandat)";
        let label = "ngay";
        let whereClause = "dh.trangthai = 'hoanthanh'";

        // Nếu lọc theo ngày cụ thể
        if (date) {
            whereClause += ` AND DATE(dh.thoigiandat) = '${date}'`;
        }

        // Nếu lọc theo tháng cụ thể (vd: month=7&year=2025)
        if (month && year) {
            whereClause += ` AND MONTH(dh.thoigiandat) = ${month} AND YEAR(dh.thoigiandat) = ${year}`;
        }

        // Nếu lọc theo năm cụ thể
        if (year && !month) {
            whereClause += ` AND YEAR(dh.thoigiandat) = ${year}`;
        }

        if (type === "month") {
            groupBy = "YEAR(dh.thoigiandat), MONTH(dh.thoigiandat)";
            label = "thang";
        } else if (type === "year") {
            groupBy = "YEAR(dh.thoigiandat)";
            label = "nam";
        }

        const [rows] = await connection.query(`
            SELECT ${groupBy} AS ${label}, SUM(dh.tongtien) AS doanhthu
            FROM DONHANG dh
            WHERE ${whereClause}
            GROUP BY ${groupBy}
            ORDER BY MIN(dh.thoigiandat) ASC
        `);

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const RevenueByDay = async (req, res) => {
    try {
        const { ngay } = req.query;

        if (!ngay) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp ngày thống kê (YYYY-MM-DD)"
            });
        }

        const query = `
            SELECT 
                sp.masanpham, 
                sp.tensanpham, 
                SUM(cthd.soluongSP) AS tong_soluong_ban, 
                SUM(cthd.soluongSP * cthd.giatienSP) AS tong_doanh_thu
            FROM CHITIETHOADON cthd
            JOIN HOADON hd ON cthd.mahoadon = hd.mahoadon
            JOIN SANPHAM sp ON cthd.masanpham = sp.masanpham
            WHERE DATE(hd.ngaylap) = ?
            AND hd.trangthaihoadon = 1
            GROUP BY sp.masanpham, sp.tensanpham
            ORDER BY tong_doanh_thu DESC;
        `;

        const [results] = await connection.query(query, [ngay]);

        return res.json({
            success: true,
            message: `Doanh thu sản phẩm ngày ${ngay}`,
            data: results
        });
    } catch (error) {
        console.error("Lỗi lấy thống kê doanh thu:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thống kê doanh thu"
        });
    }
};

const RevenueByMonth = async (req, res) => {
    try {
        const { thang, nam } = req.query;

        if (!thang || !nam) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp tháng và năm thống kê (YYYY-MM)"
            });
        }

        const query = `
            SELECT 
                sp.masanpham, 
                sp.tensanpham, 
                SUM(cthd.soluongSP) AS tong_soluong_ban, 
                SUM(cthd.soluongSP * cthd.giatienSP) AS tong_doanh_thu
            FROM CHITIETHOADON cthd
            JOIN HOADON hd ON cthd.mahoadon = hd.mahoadon
            JOIN SANPHAM sp ON cthd.masanpham = sp.masanpham
            WHERE MONTH(hd.ngaylap) = ? AND YEAR(hd.ngaylap) = ?
            AND hd.trangthaihoadon = 1
            GROUP BY sp.masanpham, sp.tensanpham
            ORDER BY tong_doanh_thu DESC;
        `;

        const [results] = await connection.query(query, [thang, nam]);

        return res.json({
            success: true,
            message: `Doanh thu sản phẩm tháng ${thang}-${nam}`,
            data: results
        });
    } catch (error) {
        console.error("Lỗi lấy thống kê doanh thu theo tháng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thống kê doanh thu theo tháng"
        });
    }
};

const RevenueByYear = async (req, res) => {
    try {
        const { nam } = req.query;

        if (!nam) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp năm thống kê (YYYY)"
            });
        }

        const query = `
            SELECT 
                sp.masanpham, 
                sp.tensanpham, 
                SUM(cthd.soluongSP) AS tong_soluong_ban, 
                SUM(cthd.soluongSP * cthd.giatienSP) AS tong_doanh_thu
            FROM CHITIETHOADON cthd
            JOIN HOADON hd ON cthd.mahoadon = hd.mahoadon
            JOIN SANPHAM sp ON cthd.masanpham = sp.masanpham
            WHERE YEAR(hd.ngaylap) = ?
            AND hd.trangthaihoadon = 1
            GROUP BY sp.masanpham, sp.tensanpham
            ORDER BY tong_doanh_thu DESC;
        `;

        const [results] = await connection.query(query, [nam]);

        return res.json({
            success: true,
            message: `Doanh thu sản phẩm năm ${nam}`,
            data: results
        });
    } catch (error) {
        console.error("Lỗi lấy thống kê doanh thu theo năm:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thống kê doanh thu theo năm"
        });
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
    revenueByPayment,
    RevenueByDay,
    RevenueByMonth,
    RevenueByYear,
};
