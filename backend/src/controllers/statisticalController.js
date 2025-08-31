const connection = require("../config/database");

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
                SUM(ctdh.soluong) AS tong_soluong_ban, 
                SUM(ctdh.soluong * ctdh.dongia) AS tong_doanh_thu
            FROM CHITIETDONHANG ctdh
            JOIN DONHANG dh ON ctdh.madonhang = dh.madonhang
            JOIN SANPHAM sp ON ctdh.masanpham = sp.masanpham
            WHERE DATE(dh.thoigiandat) = ?
              AND dh.trangthai = 'hoanthanh'
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
                SUM(ctdh.soluong) AS tong_soluong_ban, 
                SUM(ctdh.soluong * ctdh.dongia) AS tong_doanh_thu
            FROM CHITIETDONHANG ctdh
            JOIN DONHANG dh ON ctdh.madonhang = dh.madonhang
            JOIN SANPHAM sp ON ctdh.masanpham = sp.masanpham
            WHERE MONTH(dh.thoigiandat) = ? 
              AND YEAR(dh.thoigiandat) = ?
              AND dh.trangthai = 'hoanthanh'
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
                SUM(ctdh.soluong) AS tong_soluong_ban, 
                SUM(ctdh.soluong * ctdh.dongia) AS tong_doanh_thu
            FROM CHITIETDONHANG ctdh
            JOIN DONHANG dh ON ctdh.madonhang = dh.madonhang
            JOIN SANPHAM sp ON ctdh.masanpham = sp.masanpham
            WHERE YEAR(dh.thoigiandat) = ?
              AND dh.trangthai = 'hoanthanh'
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

const Top10Products = async (req, res) => {
    try {
        const query = `
            SELECT 
                sp.masanpham,
                sp.tensanpham,
                sp.hinhanhchinh,
                sp.giaban,
                sp.khuyenmai,
                (sp.giaban - (sp.giaban * sp.khuyenmai / 100)) AS giasaugiam,
                SUM(ct.soluong) AS tongban,
                SUM(ct.soluong * (sp.giaban - (sp.giaban * sp.khuyenmai / 100))) AS doanhthu
            FROM CHITIETDONHANG ct
            JOIN SANPHAM sp ON ct.masanpham = sp.masanpham
            JOIN DONHANG dh ON ct.madonhang = dh.madonhang
            WHERE dh.trangthai = 'hoanthanh'
            GROUP BY sp.masanpham
            HAVING SUM(ct.soluong) > 5
            ORDER BY doanhthu DESC
            LIMIT 10;
        `;

        const [results] = await connection.query(query);

        res.json({
            success: true,
            message: "Top 10 sản phẩm có doanh thu cao nhất",
            data: results
        });
    } catch (error) {
        console.error("Lỗi khi lấy top sản phẩm:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy top sản phẩm" });
    }
};

const OrderStatusSummary = async (req, res) => {
    try {
        const query = `
            SELECT 
                trangthai, 
                COUNT(*) AS tong_donhang,
                SUM(tongtien) AS tong_tien
            FROM DONHANG
            GROUP BY trangthai;
        `;

        const [results] = await connection.query(query);

        return res.json({
            success: true,
            message: "Thống kê số lượng đơn hàng theo trạng thái",
            data: results
        });
    } catch (error) {
        console.error("Lỗi lấy thống kê đơn hàng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thống kê đơn hàng"
        });
    }
};

// API 1: Tổng doanh thu (chỉ tính đơn hàng hoanthanh)
const TotalRevenue = async (req, res) => {
    try {
        const query = `
            SELECT COALESCE(SUM(tongtien), 0) AS tong_doanh_thu
            FROM DONHANG
            WHERE trangthai = 'hoanthanh';
        `;

        const [results] = await connection.query(query);

        return res.json({
            success: true,
            message: "Tổng doanh thu (đơn hàng hoàn thành)",
            data: results[0]
        });
    } catch (error) {
        console.error("Lỗi khi lấy tổng doanh thu:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy tổng doanh thu"
        });
    }
};

// API 2: Tổng sản phẩm đã bán (chỉ tính đơn hàng hoanthanh)
const TotalProducts = async (req, res) => {
    try {
        const query = `
            SELECT COALESCE(SUM(ctdh.soluong), 0) AS tong_san_pham_ban
            FROM CHITIETDONHANG ctdh
            JOIN DONHANG dh ON ctdh.madonhang = dh.madonhang
            WHERE dh.trangthai = 'hoanthanh';
        `;

        const [results] = await connection.query(query);

        return res.json({
            success: true,
            message: "Tổng số sản phẩm đã bán (đơn hàng hoàn thành)",
            data: results[0]
        });
    } catch (error) {
        console.error("Lỗi khi lấy tổng sản phẩm bán:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy tổng sản phẩm đã bán"
        });
    }
};

const TotalUsers = async (req, res) => {
    try {
        const query = `
            SELECT COUNT(*) AS tong_nguoi_dung
            FROM NGUOIDUNG;
        `;

        const [results] = await connection.query(query);

        return res.json({
            success: true,
            message: "Tổng số người dùng trong hệ thống",
            data: results[0]
        });
    } catch (error) {
        console.error("Lỗi khi lấy tổng số người dùng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy tổng số người dùng"
        });
    }
};

// Thống kê toàn bộ người dùng
const UserStatistics = async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(*) AS tong_nguoi_dung,
                SUM(CASE WHEN role = 0 THEN 1 ELSE 0 END) AS tong_khach_hang,
                SUM(CASE WHEN role = 1 THEN 1 ELSE 0 END) AS tong_quan_tri,
                SUM(CASE WHEN role = 2 THEN 1 ELSE 0 END) AS tong_nhan_vien,
                SUM(CASE WHEN trangthai = 1 THEN 1 ELSE 0 END) AS nguoi_dung_bi_khoa
            FROM NGUOIDUNG;
        `;

        const [results] = await connection.query(query);

        return res.json({
            success: true,
            message: "Thống kê người dùng trong hệ thống",
            data: results[0]
        });
    } catch (error) {
        console.error("Lỗi khi thống kê người dùng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi thống kê người dùng"
        });
    }
};


module.exports = {
    RevenueByDay,
    RevenueByMonth,
    RevenueByYear,
    Top10Products,
    OrderStatusSummary,
    TotalRevenue,
    TotalProducts,
    TotalUsers,
    UserStatistics,
};
