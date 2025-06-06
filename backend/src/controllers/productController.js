const pool = require("../config/database");

// Lấy tất cả sản phẩm kèm chi tiết
const getAllProducts = async (req, res) => {
    try {
        // const [productRows] = await pool.query(`
        //     SELECT sp.*, th.tenthuonghieu 
        //     FROM SANPHAM sp
        //     LEFT JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
        //     WHERE sp.trangthai = 0
        //     ORDER BY sp.masanpham DESC
        // `);

        const [productRows] = await pool.query(`
            SELECT sp.*, th.tenthuonghieu 
            FROM SANPHAM sp
            LEFT JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
            ORDER BY sp.masanpham DESC
        `);

        const [detailRows] = await pool.query(`
            SELECT * FROM CHITIETSANPHAM WHERE trangthai = 0
        `);

        const productMap = productRows.map(product => {
            const chiTietSanPham = detailRows.filter(detail => detail.masanpham === product.masanpham);

            // Lấy danh sách dung lượng duy nhất
            const dsDungLuong = [
                ...new Set(chiTietSanPham.map(detail => detail.dungluong))
            ];

            return {
                ...product,
                chiTietSanPham,
                dsDungLuong,
            };
        });

        res.status(200).json({
            EM: "Lấy danh sách sản phẩm kèm chi tiết thành công",
            EC: 0,
            DT: productMap
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

        const result = {
            ...productRows[0],
            chiTietSanPham: detailRows
        };

        return res.status(200).json({
            EM: "Lấy chi tiết sản phẩm thành công",
            EC: 0,
            DT: { result }
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

    const uploadedImages = req.files['hinhanh']?.map(file => file.filename) || [];
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

        // Lấy dữ liệu sản phẩm vừa tạo (gồm thương hiệu và chi tiết)
        const [productData] = await connection.query(
            `SELECT sp.*, th.tenthuonghieu
            FROM SANPHAM sp
            JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
            WHERE sp.masanpham = ?`,
            [masanpham]
        );

        const [detailData] = await connection.query(
            `SELECT * FROM CHITIETSANPHAM WHERE masanpham = ?`,
            [masanpham]
        );

        const fullProduct = {
            ...productData[0],
            chiTietSanPham: detailData,
        };

        res.status(201).json({
            EM: "Tạo sản phẩm thành công",
            EC: 1,
            DT: [{ fullProduct }],
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
    const uploadedImages = req.files['hinhanh']?.map(file => file.filename) || [];
    const productImages = uploadedImages.join(",");

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Cập nhật SANPHAM, giữ ảnh cũ nếu không upload mới
        await connection.query(
            `UPDATE SANPHAM SET 
                mathuonghieu = ?, 
                tensanpham = ?, 
                hinhanh = IF(CHAR_LENGTH(?) > 0, ?, hinhanh), 
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
                productImages, productImages, // điều kiện giữ ảnh cũ nếu không upload mới
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

        // Thêm lại chi tiết mới
        const detailImages = req.files['hinhanhchitiet'] || [];
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

        await connection.commit();

        // Lấy dữ liệu sản phẩm vừa tạo (gồm thương hiệu và chi tiết)
        const [productData] = await connection.query(
            `SELECT sp.*, th.tenthuonghieu
            FROM SANPHAM sp
            JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
            WHERE sp.masanpham = ?`,
            [masanpham]
        );

        const [detailData] = await connection.query(
            `SELECT * FROM CHITIETSANPHAM WHERE masanpham = ?`,
            [masanpham]
        );

        const fullProduct = {
            ...productData[0],
            chiTietSanPham: detailData,
        };

        res.status(200).json({
            EM: "Cập nhật sản phẩm thành công",
            EC: 0,
            DT: {
                fullProduct
            }
        });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({
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
            EM: "Xóa sản phẩm thành công",
            EC: 1,
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
