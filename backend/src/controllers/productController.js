const pool = require("../config/database");

// Lấy tất cả sản phẩm (chỉ lấy sản phẩm chưa bị xóa)
const getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM SANPHAM WHERE trangthai = 0");
        return res.status(200).json({
            EM: "Lấy tất cả sản phẩm thành công",
            EC: 1,
            DT: rows,
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi server: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
    const { masanpham } = req.params;
    try {
        const [rows] = await pool.query(
            "SELECT * FROM SANPHAM WHERE masanpham = ? AND trangthai = 0",
            [masanpham]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy sản phẩm",
                EC: 0,
                DT: [],
            });
        }
        return res.status(200).json({
            EM: "Lấy sản phẩm thành công",
            EC: 1,
            DT: rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi server: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

// Tạo sản phẩm (cho phép nhiều hình ảnh lưu dạng JSON chuỗi)
const createProduct = async (req, res) => {
    const {
        mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, ram,
        congnghemanhinh, dophangiai, cameratruoc, camerasau, pin
    } = req.body;

    const images = req.files?.map(file => file.filename); // từ multer
    const hinhanh = images?.length > 0 ? JSON.stringify(images) : null;

    try {
        const [result] = await pool.query(
            `INSERT INTO SANPHAM 
            (mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, ram, congnghemanhinh, dophangiai, cameratruoc, camerasau, pin, hinhanh)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, ram, congnghemanhinh, dophangiai, cameratruoc, camerasau, pin, hinhanh]
        );

        return res.status(201).json({
            EM: "Tạo sản phẩm thành công",
            EC: 1,
            DT: { masanpham: result.insertId },
        });
    } catch (error) {
        return res.status(400).json({
            EM: `Lỗi khi tạo sản phẩm: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    const { masanpham } = req.params;
    const {
        mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, ram,
        congnghemanhinh, dophangiai, cameratruoc, camerasau, pin
    } = req.body;

    const images = req.files?.map(file => file.filename); // dùng multer để lấy ảnh
    const hinhanh = images?.length > 0 ? JSON.stringify(images) : null;

    try {
        const [result] = await pool.query(
            `UPDATE SANPHAM SET 
            mathuonghieu = ?, tensanpham = ?, hedieuhanh = ?, cpu = ?, gpu = ?, ram = ?, 
            congnghemanhinh = ?, dophangiai = ?, cameratruoc = ?, camerasau = ?, pin = ?, hinhanh = ?, updated_at = CURRENT_TIMESTAMP
            WHERE masanpham = ? AND trangthai = 0`,
            [
                mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, ram,
                congnghemanhinh, dophangiai, cameratruoc, camerasau, pin, hinhanh, masanpham
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy sản phẩm để cập nhật",
                EC: 0,
                DT: [],
            });
        }

        return res.status(200).json({
            EM: "Cập nhật sản phẩm thành công",
            EC: 1,
            DT: { masanpham },
        });
    } catch (error) {
        return res.status(400).json({
            EM: `Lỗi khi cập nhật sản phẩm: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

// Xóa mềm sản phẩm
const deleteProduct = async (req, res) => {
    const { masanpham } = req.params;
    try {
        const [result] = await pool.query(
            "UPDATE SANPHAM SET trangthai = 1, updated_at = CURRENT_TIMESTAMP WHERE masanpham = ?",
            [masanpham]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy sản phẩm để xóa",
                EC: 0,
                DT: [],
            });
        }
        return res.status(200).json({
            EM: "Xóa mềm sản phẩm thành công",
            EC: 1,
            DT: [],
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi server khi xóa sản phẩm: ${error.message}`,
            EC: -1,
            DT: [],
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
