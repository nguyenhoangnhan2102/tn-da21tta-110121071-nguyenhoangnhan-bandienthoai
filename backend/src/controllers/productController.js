const pool = require("../config/database");

// Lấy tất cả sản phẩm (chỉ lấy sản phẩm chưa bị xóa)
const getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT sp.*, th.tenthuonghieu 
            FROM SANPHAM sp
            LEFT JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
            WHERE sp.trangthai = 0
            ORDER BY sp.masanpham DESC
        `);

        res.status(200).json({
            EM: "Lấy danh sách sản phẩm thành công",
            EC: 0,
            DT: rows
        });
    } catch (error) {
        res.status(500).json({
            EM: `Lỗi: ${error.message}`,
            EC: -1,
            DT: []
        });
    }
};

const getProductById = async (req, res) => {
    const masanpham = req.params.id;

    try {
        // Lấy thông tin sản phẩm chính
        const [productRows] = await pool.query(`
            SELECT sp.*, th.tenthuonghieu 
            FROM SANPHAM sp
            LEFT JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
            WHERE sp.masanpham = ? AND sp.trangthai = 0
        `, [masanpham]);

        if (productRows.length === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy sản phẩm",
                EC: 0,
                DT: null
            });
        }

        // Lấy danh sách màu - dung lượng - ram - hình chi tiết từ bảng CHITIETSANPHAM
        const [detailRows] = await pool.query(`
            SELECT * FROM CHITIETSANPHAM 
            WHERE masanpham = ? AND trangthai = 0
        `, [masanpham]);

        // Gộp lại kết quả
        const result = {
            ...productRows[0],
            chiTietSanPham: detailRows
        };

        return res.status(200).json({
            EM: "Lấy chi tiết sản phẩm thành công",
            EC: 0,
            DT: result
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi lấy chi tiết sản phẩm: ${error.message}`,
            EC: -1,
            DT: null
        });
    }
};


const createProduct = async (req, res) => {
    const {
        mathuonghieu,
        tensanpham,
        hedieuhanh,
        cpu,
        gpu,
        cameratruoc,
        camerasau,
        congnghemanhinh,
        dophangiaimanhinh,
        pin,
        mota,
        chiTietSanPham,
    } = req.body;

    const uploadedImages = req.files['hinhanh']?.map(file => file.filename) || [];
    const productImages = uploadedImages.join(",");

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Thêm vào bảng SANPHAM
        const [productResult] = await connection.query(
            `INSERT INTO SANPHAM 
        (mathuonghieu, tensanpham, hinhanh, hedieuhanh, cpu, gpu, cameratruoc, camerasau, congnghemanhinh, dophangiaimanhinh, pin, mota)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                mathuonghieu,
                tensanpham,
                productImages,
                hedieuhanh,
                cpu,
                gpu,
                cameratruoc,
                camerasau,
                congnghemanhinh,
                dophangiaimanhinh,
                pin,
                mota,
            ]
        );

        const masanpham = productResult.insertId;
        const detailImages = req.files['hinhanhchitiet'] || [];
        // Thêm vào bảng CHITIETSANPHAM
        for (let i = 0; i < chiTietSanPham.length; i++) {
            const detail = chiTietSanPham[i];
            const detailImage = detailImages[i]?.filename || null;

            await connection.query(
                `INSERT INTO CHITIETSANPHAM
          (masanpham, mau, dungluong, ram, soluong, giaban, gianhap, khuyenmai, trangthai, hinhanhchitiet, giagiam)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    masanpham,
                    detail.mau,
                    detail.dungluong,
                    detail.ram,
                    detail.soluong,
                    detail.giaban,
                    detail.gianhap,
                    detail.khuyenmai || 0,
                    detail.trangthai || 0,
                    detailImage,
                    detail.giagiam,
                ]
            );
        }

        await connection.commit();
        res.status(201).json({
            EM: "Tạo sản phẩm thành công",
            EC: 1,
            DT: [],
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            EM: `Lỗi khi tạo sản phẩm: ${error.message}`,
            EC: -1,
            DT: [],
        });
    } finally {
        connection.release();
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    const masanpham = req.params.id;
    const {
        mathuonghieu,
        tensanpham,
        hinhanh,
        hedieuhanh,
        cpu,
        gpu,
        cameratruoc,
        camerasau,
        congnghemanhinh,
        dophangiaimanhinh,
        pin,
        mota
    } = req.body;

    try {
        const [result] = await pool.query(`
            UPDATE SANPHAM SET 
                mathuonghieu = ?, tensanpham = ?, hinhanh = ?, hedieuhanh = ?,
                cpu = ?, gpu = ?, cameratruoc = ?, camerasau = ?,
                congnghemanhinh = ?, dophangiaimanhinh = ?, pin = ?, mota = ?
            WHERE masanpham = ?`,
            [mathuonghieu, tensanpham, hinhanh, hedieuhanh, cpu, gpu, cameratruoc, camerasau,
                congnghemanhinh, dophangiaimanhinh, pin, mota, masanpham]
        );

        res.status(200).json({
            EM: "Cập nhật sản phẩm thành công",
            EC: 0,
            DT: result
        });
    } catch (error) {
        res.status(500).json({
            EM: `Lỗi cập nhật: ${error.message}`,
            EC: -1,
            DT: []
        });
    }
};

// Xóa mềm sản phẩm
const deleteProduct = async (req, res) => {
    const masanpham = req.params.id;

    try {
        const [result] = await pool.query(
            `UPDATE SANPHAM SET trangthai = 1 WHERE masanpham = ?`,
            [masanpham]
        );

        res.status(200).json({
            EM: "Xóa sản phẩm thành công (trạng thái = 1)",
            EC: 0,
            DT: result
        });
    } catch (error) {
        res.status(500).json({
            EM: `Lỗi xóa sản phẩm: ${error.message}`,
            EC: -1,
            DT: []
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
