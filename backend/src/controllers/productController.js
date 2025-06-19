const pool = require("../config/database");

// GET all products theo trạng thái
const getAllProducts = async (req, res) => {
    try {
        const trangthai = req.query.trangthai || 0;
        const [rows] = await pool.query(
            `SELECT * FROM SANPHAM WHERE trangthai = ? ORDER BY ngaycapnhat DESC, ngaytao DESC`,
            [trangthai]
        );
        res.status(200).json({
            DT: rows,
            EC: 0,
            EM: "Lấy danh sách sản phẩm thành công"
        });
    } catch (error) {
        console.error("Error getAllProducts:", error);
        return res.status(500).json({
            DT: null,
            EC: 1,
            EM: "Lỗi máy chủ khi lấy sản phẩm"
        });
    }
};

// GET sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`SELECT * FROM SANPHAM WHERE masanpham = ?`, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                DT: null,
                EC: 2,
                EM: "Không tìm thấy sản phẩm"
            });
        }

        return res.status(200).json({
            DT: rows[0],
            EC: 0,
            EM: "Lấy sản phẩm thành công"
        });
    } catch (error) {
        console.error("Error getProductById:", error);
        return res.status(500).json({
            DT: null,
            EC: 1,
            EM: "Lỗi máy chủ khi lấy sản phẩm"
        });
    }
};

// POST tạo mới sản phẩm
const createProduct = async (req, res) => {
    try {
        const {
            mathuonghieu,
            tensanpham,
            mau,
            dungluong,
            ram,
            hedieuhanh,
            soluong,
            giatien,
            cpu,
            gpu,
            cameratruoc,
            camerasau,
            congnghemanhinh,
            dophangiaimanhinh,
            pin,
            mota,
        } = req.body;

        const filenames = req.files.map(file => file.filename).join(",");

        const [result] = await pool.query(
            `INSERT INTO SANPHAM (
                mathuonghieu, tensanpham, hinhanh, mau, dungluong, ram, hedieuhanh, soluong, giatien,
                cpu, gpu, cameratruoc, camerasau, congnghemanhinh, dophangiaimanhinh, pin, mota
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                mathuonghieu, tensanpham, filenames, mau, dungluong, ram, hedieuhanh, soluong, giatien,
                cpu, gpu, cameratruoc, camerasau, congnghemanhinh, dophangiaimanhinh, pin, mota
            ]
        );

        return res.status(201).json({
            DT: { id: result.insertId },
            EC: 0,
            EM: "Tạo sản phẩm thành công"
        });
    } catch (error) {
        console.error("Error createProduct:", error);
        return res.status(500).json({
            DT: null,
            EC: 1,
            EM: "Lỗi khi tạo sản phẩm"
        });
    }
};


// PUT cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            mathuonghieu,
            tensanpham,
            mau,
            dungluong,
            ram,
            hedieuhanh,
            soluong,
            giatien,
            cpu,
            gpu,
            cameratruoc,
            camerasau,
            congnghemanhinh,
            dophangiaimanhinh,
            pin,
            mota,
        } = req.body;

        const filenames = req.files && req.files.length > 0
            ? req.files.map(file => file.filename).join(",")
            : null;

        const query = `
            UPDATE SANPHAM SET
                mathuonghieu = ?, tensanpham = ?, mau = ?, dungluong = ?, ram = ?, hedieuhanh = ?,
                soluong = ?, giatien = ?, cpu = ?, gpu = ?, cameratruoc = ?, camerasau = ?, congnghemanhinh = ?,
                dophangiaimanhinh = ?, pin = ?, mota = ?, ${filenames ? "hinhanh = ?, " : ""} ngaycapnhat = CURRENT_TIMESTAMP
            WHERE masanpham = ?
        `;

        const params = filenames
            ? [
                mathuonghieu, tensanpham, mau, dungluong, ram, hedieuhanh,
                soluong, giatien, cpu, gpu, cameratruoc, camerasau, congnghemanhinh,
                dophangiaimanhinh, pin, mota, filenames, id
            ]
            : [
                mathuonghieu, tensanpham, mau, dungluong, ram, hedieuhanh,
                soluong, giatien, cpu, gpu, cameratruoc, camerasau, congnghemanhinh,
                dophangiaimanhinh, pin, mota, id
            ];

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                DT: null,
                EC: 2,
                EM: "Không tìm thấy sản phẩm để cập nhật"
            });
        }

        return res.status(200).json({
            DT: null,
            EC: 0,
            EM: "Cập nhật sản phẩm thành công"
        });
    } catch (error) {
        console.error("Error updateProduct:", error);
        return res.status(500).json({
            DT: null,
            EC: 1,
            EM: "Lỗi khi cập nhật sản phẩm"
        });
    }
};

// DELETE mềm sản phẩm (đặt trangthai = 1)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            `UPDATE SANPHAM SET trangthai = 1, ngaycapnhat = CURRENT_TIMESTAMP WHERE masanpham = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                DT: null,
                EC: 2,
                EM: "Không tìm thấy sản phẩm để xóa"
            });
        }

        return res.status(200).json({
            DT: null,
            EC: 0,
            EM: "Xóa mềm sản phẩm thành công"
        });
    } catch (error) {
        console.error("Error deleteProduct:", error);
        return res.status(500).json({
            DT: null,
            EC: 1,
            EM: "Lỗi khi xóa sản phẩm"
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
