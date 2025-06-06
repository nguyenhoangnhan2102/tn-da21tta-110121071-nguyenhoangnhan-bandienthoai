// Updated APIs to match new database structure with DUNGLUONG and MAUSAC_DUNGLUONG

const pool = require("../config/database");

// 1. GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {
        const [productRows] = await pool.query(`
      SELECT sp.*, th.tenthuonghieu 
      FROM SANPHAM sp
      LEFT JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
      WHERE sp.trangthai = 0
      ORDER BY sp.masanpham DESC
    `);

        const [dungluongRows] = await pool.query(`SELECT * FROM DUNGLUONG`);
        const [mauSacRows] = await pool.query(`SELECT * FROM MAUSAC_DUNGLUONG WHERE trangthai = 0`);

        const productMap = productRows.map(product => {
            const dungluongList = dungluongRows.filter(dl => dl.masanpham === product.masanpham)
                .map(dl => ({
                    ...dl,
                    mausac: mauSacRows.filter(mau => mau.madungluong === dl.madungluong)
                }));

            return {
                ...product,
                chiTietDungLuong: dungluongList
            };
        });

        res.status(200).json({ EM: "Lấy tất cả sản phẩm thành công", EC: 0, DT: productMap });
    } catch (error) {
        res.status(500).json({ EM: error.message, EC: -1, DT: [] });
    }
};

// 2. GET PRODUCT BY ID
const getProductById = async (req, res) => {
    const masanpham = req.params.id;
    try {
        const [productRows] = await pool.query(`
      SELECT sp.*, th.tenthuonghieu 
      FROM SANPHAM sp
      JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
      WHERE sp.masanpham = ? AND sp.trangthai = 0
    `, [masanpham]);

        if (productRows.length === 0) {
            return res.status(404).json({ EM: "Không tìm thấy sản phẩm", EC: 0, DT: null });
        }

        const [dungluongRows] = await pool.query(`SELECT * FROM DUNGLUONG WHERE masanpham = ?`, [masanpham]);
        const [mauSacRows] = await pool.query(`SELECT * FROM MAUSAC_DUNGLUONG WHERE madungluong IN (?)`, [dungluongRows.map(d => d.madungluong)]);

        const dungluongList = dungluongRows.map(dl => ({
            ...dl,
            mausac: mauSacRows.filter(mau => mau.madungluong === dl.madungluong)
        }));

        res.status(200).json({
            EM: "Lấy chi tiết sản phẩm thành công",
            EC: 0,
            DT: { ...productRows[0], chiTietDungLuong: dungluongList }
        });
    } catch (error) {
        res.status(500).json({ EM: error.message, EC: -1, DT: null });
    }
};

// 3. CREATE PRODUCT
const createProduct = async (req, res) => {
    const {
        mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, cameratruoc, camerasau,
        congnghemanhinh, dophangiaimanhinh, pin, mota, chiTietDungLuong
    } = req.body;

    const uploadedImages = req.files['hinhanh']?.map(file => file.filename) || [];
    const productImages = uploadedImages.join(",");

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [productResult] = await connection.query(
            `INSERT INTO SANPHAM (mathuonghieu, tensanpham, hinhanh, hedieuhanh, cpu, gpu, cameratruoc, camerasau, congnghemanhinh, dophangiaimanhinh, pin, mota)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [mathuonghieu, tensanpham, productImages, hedieuhanh, cpu, gpu, cameratruoc, camerasau, congnghemanhinh, dophangiaimanhinh, pin, mota]
        );
        const masanpham = productResult.insertId;

        const detailImages = req.files['hinhanhchitiet'] || [];

        for (let i = 0; i < chiTietDungLuong.length; i++) {
            const dungluong = chiTietDungLuong[i];
            const [dlResult] = await connection.query(
                `INSERT INTO DUNGLUONG (masanpham, dungluong) VALUES (?, ?)`,
                [masanpham, dungluong.dungluong]
            );
            const madungluong = dlResult.insertId;

            for (let j = 0; j < dungluong.mausac.length; j++) {
                const mau = dungluong.mausac[j];
                const imageFile = detailImages.shift()?.filename || null;
                await connection.query(
                    `INSERT INTO MAUSAC_DUNGLUONG
          (madungluong, mau, ram, soluong, giaban, gianhap, giagiam, khuyenmai, trangthai, hinhanhchitiet)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [madungluong, mau.mau, mau.ram, mau.soluong, mau.giaban, mau.gianhap, mau.giagiam, mau.khuyenmai || 0, mau.trangthai || 0, imageFile]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ EM: "Tạo sản phẩm thành công", EC: 1, DT: { masanpham } });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ EM: error.message, EC: -1, DT: null });
    } finally {
        connection.release();
    }
};

// 4. DELETE PRODUCT (soft delete)
const deleteProduct = async (req, res) => {
    const masanpham = req.params.id;
    try {
        const [result] = await pool.query(`UPDATE SANPHAM SET trangthai = 1 WHERE masanpham = ?`, [masanpham]);
        res.status(200).json({ EM: "Xóa sản phẩm thành công", EC: 1, DT: result });
    } catch (error) {
        res.status(500).json({ EM: error.message, EC: -1, DT: null });
    }
};

// 5. UPDATE PRODUCT
const updateProduct = async (req, res) => {
    const masanpham = req.params.id;
    const {
        mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, cameratruoc, camerasau,
        congnghemanhinh, dophangiaimanhinh, pin, mota, trangthai, chiTietDungLuong
    } = req.body;

    const uploadedImages = req.files['hinhanh']?.map(file => file.filename) || [];
    const productImages = uploadedImages.join(",");

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(`
            UPDATE SANPHAM SET 
                mathuonghieu = ?, 
                tensanpham = ?, 
                hinhanh = IF(CHAR_LENGTH(?) > 0, ?, hinhanh),
                hedieuhanh = ?, cpu = ?, gpu = ?, cameratruoc = ?, camerasau = ?, 
                congnghemanhinh = ?, dophangiaimanhinh = ?, pin = ?, mota = ?, trangthai = ?
            WHERE masanpham = ?`,
            [
                mathuonghieu, tensanpham, productImages, productImages, hedieuhanh, cpu, gpu,
                cameratruoc, camerasau, congnghemanhinh, dophangiaimanhinh, pin, mota, trangthai, masanpham
            ]
        );

        // Xóa tất cả dung lượng & màu cũ
        const [oldDLRows] = await connection.query(`SELECT madungluong FROM DUNGLUONG WHERE masanpham = ?`, [masanpham]);
        const oldDLIds = oldDLRows.map(r => r.madungluong);
        if (oldDLIds.length > 0) {
            await connection.query(`DELETE FROM MAUSAC_DUNGLUONG WHERE madungluong IN (?)`, [oldDLIds]);
            await connection.query(`DELETE FROM DUNGLUONG WHERE masanpham = ?`, [masanpham]);
        }

        const detailImages = req.files['hinhanhchitiet'] || [];

        // Thêm lại dung lượng + màu sắc mới
        for (let i = 0; i < chiTietDungLuong.length; i++) {
            const dungluong = chiTietDungLuong[i];
            const [dlResult] = await connection.query(
                `INSERT INTO DUNGLUONG (masanpham, dungluong) VALUES (?, ?)`,
                [masanpham, dungluong.dungluong]
            );
            const madungluong = dlResult.insertId;

            for (let j = 0; j < dungluong.mausac.length; j++) {
                const mau = dungluong.mausac[j];
                const imageFile = detailImages.shift()?.filename || null;
                await connection.query(
                    `INSERT INTO MAUSAC_DUNGLUONG
          (madungluong, mau, ram, soluong, giaban, gianhap, giagiam, khuyenmai, trangthai, hinhanhchitiet)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [madungluong, mau.mau, mau.ram, mau.soluong, mau.giaban, mau.gianhap, mau.giagiam, mau.khuyenmai || 0, mau.trangthai || 0, imageFile]
                );
            }
        }

        await connection.commit();
        res.status(200).json({ EM: "Cập nhật sản phẩm thành công", EC: 0, DT: null });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ EM: error.message, EC: -1, DT: null });
    } finally {
        connection.release();
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct
};
