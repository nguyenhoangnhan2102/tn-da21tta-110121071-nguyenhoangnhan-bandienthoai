const pool = require("../config/database");

// Lấy tất cả sản phẩm kèm chi tiết
const getAllProducts = async (req, res) => {
    try {
        const [productRows] = await pool.query(`
            SELECT sp.*, th.tenthuonghieu 
            FROM SANPHAM sp
            LEFT JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
            WHERE sp.trangthai = 0
            ORDER BY sp.masanpham DESC
        `);

        const [detailRows] = await pool.query(`
            SELECT * FROM CHITIETSANPHAM WHERE trangthai = 0
        `);

        const productsWithDetails = productRows.map(product => {
            const chiTietSanPham = detailRows.filter(detail => detail.masanpham === product.masanpham);
            // Tách ảnh sản phẩm thành mảng nếu có
            const hinhanhArray = product.hinhanh ? product.hinhanh.split(',') : [];
            return {
                ...product,
                hinhanh: hinhanhArray,
                chiTietSanPham
            };
        });

        return res.status(200).json({
            EM: "Lấy danh sách sản phẩm kèm chi tiết thành công",
            EC: 0,
            DT: productsWithDetails
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi: ${error.message}`,
            EC: -1,
            DT: []
        });
    }
};

// Lấy sản phẩm theo ID kèm chi tiết
const getProductById = async (req, res) => {
    const masanpham = req.params.id;
    try {
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

        const [detailRows] = await pool.query(`
            SELECT * FROM CHITIETSANPHAM WHERE masanpham = ? AND trangthai = 0
        `, [masanpham]);

        const product = productRows[0];
        const hinhanhArray = product.hinhanh ? product.hinhanh.split(',') : [];

        return res.status(200).json({
            EM: "Lấy chi tiết sản phẩm thành công",
            EC: 0,
            DT: {
                ...product,
                hinhanh: hinhanhArray,
                chiTietSanPham: detailRows
            }
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi lấy chi tiết sản phẩm: ${error.message}`,
            EC: -1,
            DT: null
        });
    }
};

// Tạo sản phẩm mới
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

    // Xử lý ảnh sản phẩm: req.files['hinhanh'] có thể là array các file upload
    const uploadedImages = req.files?.['hinhanh']?.map(file => file.filename) || [];
    const productImages = uploadedImages.join(",");

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

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
        const detailImages = req.files?.['hinhanhchitiet'] || [];

        if (Array.isArray(chiTietSanPham)) {
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
        }

        await connection.commit();

        return res.status(201).json({
            EM: "Tạo sản phẩm thành công",
            EC: 0,
            DT: [],
        });
    } catch (error) {
        await connection.rollback();
        return res.status(500).json({
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
        hedieuhanh,
        cpu,
        gpu,
        cameratruoc,
        camerasau,
        congnghemanhinh,
        dophangiaimanhinh,
        pin,
        mota,
        trangthai,
        chiTietSanPham
    } = req.body;

    // Ảnh mới upload
    const uploadedImages = req.files?.['hinhanh']?.map(file => file.filename) || [];
    const productImages = uploadedImages.length > 0 ? uploadedImages.join(",") : null;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Kiểm tra sản phẩm tồn tại
        const [checkRows] = await connection.query(
            "SELECT hinhanh FROM SANPHAM WHERE masanpham = ?",
            [masanpham]
        );

        if (checkRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                EM: "Sản phẩm không tồn tại",
                EC: 0,
                DT: []
            });
        }

        const currentImages = checkRows[0].hinhanh;

        // Cập nhật SANPHAM, giữ ảnh cũ nếu không upload mới
        await connection.query(
            `UPDATE SANPHAM SET 
                mathuonghieu = ?, 
                tensanpham = ?, 
                hinhanh = IF(? IS NOT NULL AND CHAR_LENGTH(?) > 0, ?, hinhanh), 
                hedieuhanh = ?, 
                cpu = ?, 
                gpu = ?, 
                cameratruoc = ?, 
                camerasau = ?, 
                congnghemanhinh = ?, 
                dophangiaimanhinh = ?, 
                pin = ?, 
                trangthai = ?, 
                mota = ?
            WHERE masanpham = ?`,
            [
                mathuonghieu,
                tensanpham,
                productImages,
                productImages,
                productImages,
                hedieuhanh,
                cpu,
                gpu,
                cameratruoc,
                camerasau,
                congnghemanhinh,
                dophangiaimanhinh,
                pin,
                trangthai,
                mota,
                masanpham
            ]
        );

        // Xóa chi tiết cũ
        await connection.query(`DELETE FROM CHITIETSANPHAM WHERE masanpham = ?`, [masanpham]);

        // Thêm lại chi tiết mới (kèm ảnh chi tiết)
        const detailImages = req.files?.['hinhanhchitiet'] || [];
        if (Array.isArray(chiTietSanPham)) {
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
                        detail.giagiam
                    ]
                );
            }
        }

        await connection.commit();

        return res.status(200).json({
            EM: "Cập nhật sản phẩm thành công",
            EC: 0,
            DT: []
        });
    } catch (error) {
        await connection.rollback();
        return res.status(500).json({
            EM: `Lỗi cập nhật sản phẩm: ${error.message}`,
            EC: -1,
            DT: []
        });
    } finally {
        connection.release();
    }
};

// Xóa mềm sản phẩm (đổi trạng thái)
const deleteProduct = async (req, res) => {
    const masanpham = req.params.id;

    try {
        const [result] = await pool.query(
            `UPDATE SANPHAM SET trangthai = 1 WHERE masanpham = ?`,
            [masanpham]
        );

        return res.status(200).json({
            EM: "Xóa sản phẩm thành công (trạng thái = 1)",
            EC: 0,
            DT: result
        });
    } catch (error) {
        return res.status(500).json({
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
