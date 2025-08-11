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
    const {
        mathuonghieu,
        tensanpham,
        hinhanhchinh,
        mau,
        dungluong,
        ram,
        hedieuhanh,
        soluong,
        gianhap,
        giaban,
        giagiam,
        khuyenmai,
        cpu,
        gpu,
        pin,
        mota,
        trangthai,
    } = req.body;

    try {
        const [result] = await connection.query(
            `INSERT INTO SANPHAM (
                mathuonghieu, 
                tensanpham,
                hinhanhchinh,
                mau,
                dungluong,
                ram,
                hedieuhanh,
                soluong,
                gianhap,
                giaban,
                giagiam,
                khuyenmai,
                cpu,
                gpu,
                pin,
                mota,
                trangthai
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                mathuonghieu,
                tensanpham,
                hinhanhchinh,
                mau,
                dungluong,
                ram,
                hedieuhanh,
                soluong,
                gianhap,
                giaban,
                giagiam,
                khuyenmai,
                cpu,
                gpu,
                pin,
                mota,
                trangthai,
            ]
        );

        return res.status(201).json({
            message: "Sản phẩm đã được tạo thành công",
            product: {
                masanpham: result.insertId,
                mathuonghieu,
                tensanpham,
                hinhanhchinh,
                mau,
                dungluong,
                ram,
                hedieuhanh,
                soluong,
                gianhap,
                giaban,
                giagiam,
                khuyenmai,
                cpu,
                gpu,
                pin,
                mota,
                trangthai,
            }
        });
    } catch (err) {
        console.error("Error creating product:", err.message);
        res.status(500).json({ message: err.message });
    }
};


// PUT cập nhật sản phẩm
const updateProduct = async (req, res) => {
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

    try {
        // Lấy ảnh cũ
        const [oldRows] = await pool.query('SELECT hinhanh FROM SANPHAM WHERE masanpham = ?', [id]);
        if (oldRows.length === 0) {
            return res.status(404).json({ DT: null, EC: 1, EM: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        let oldImages = [];
        if (oldRows[0].hinhanh && oldRows[0].hinhanh !== '') {
            oldImages = oldRows[0].hinhanh.split(',').map(s => s.trim());
        }

        let imageFilenames = [...oldImages];
        if (req.files && req.files.length > 0) {
            const newFilenames = req.files.map(file => file.filename);
            imageFilenames = [...oldImages, ...newFilenames];
        }

        console.log('Hình ảnh cần lưu:', imageFilenames.join(','));

        const [result] = await pool.query(
            `UPDATE SANPHAM SET 
        mathuonghieu = ?, tensanpham = ?, mau = ?, dungluong = ?, ram = ?, 
        hedieuhanh = ?, soluong = ?, giatien = ?, cpu = ?, gpu = ?, 
        cameratruoc = ?, camerasau = ?, congnghemanhinh = ?, 
        dophangiaimanhinh = ?, pin = ?, mota = ?, hinhanh = ?
        WHERE masanpham = ?`,
            [
                mathuonghieu, tensanpham, mau, dungluong, ram,
                hedieuhanh, soluong, giatien, cpu, gpu,
                cameratruoc, camerasau, congnghemanhinh,
                dophangiaimanhinh, pin, mota,
                imageFilenames.join(','), id
            ]
        );

        console.log('Rows affected:', result.affectedRows);

        return res.status(200).json({
            DT: null,
            EC: 0,
            EM: 'Cập nhật sản phẩm thành công',
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        return res.status(500).json({
            DT: null,
            EC: -1,
            EM: 'Lỗi server khi cập nhật sản phẩm',
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
