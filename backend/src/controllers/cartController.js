const connection = require("../config/database.js");

// Lấy tất cả sản phẩm trong giỏ hàng theo manguoidung
const getAllCartByCustomer = async (req, res) => {
    try {
        const { manguoidung } = req.params;

        if (!manguoidung) {
            return res.status(400).json({
                EM: "Mã người dùng không được để trống",
                EC: -1,
                DT: [],
            });
        }

        const query = `
            SELECT 
                g.magiohang, 
                s.masanpham, 
                s.tensanpham, 
                s.hinhanhchinh,
                c.soluong, 
                s.giaban,
                s.khuyenmai,
                (s.giaban - (s.giaban * s.khuyenmai / 100)) AS giasaugiam
            FROM GIOHANG g
            JOIN CHITIETGIOHANG c ON g.magiohang = c.magiohang
            JOIN SANPHAM s ON c.masanpham = s.masanpham
            WHERE g.manguoidung = ?
        `;

        const [results] = await connection.query(query, [manguoidung]);

        if (results.length === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy sản phẩm nào trong giỏ hàng",
                EC: 0,
                DT: [],
            });
        }

        return res.status(200).json({
            EM: "Lấy danh sách sản phẩm giỏ hàng thành công",
            EC: 1,
            DT: results,
        });

    } catch (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({
            EM: `Lỗi controller: ${err.message}`,
            EC: -1,
            DT: [],
        });
    }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    const { masanpham, manguoidung, soluong } = req.body;

    if (!masanpham || !manguoidung || !soluong) {
        return res.status(400).json({ message: 'Thiếu thông tin, vui lòng kiểm tra lại.' });
    }

    try {
        // Kiểm tra người dùng tồn tại
        const [userCheck] = await connection.query(
            "SELECT * FROM NGUOIDUNG WHERE manguoidung = ?",
            [manguoidung]
        );
        if (userCheck.length === 0) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Kiểm tra sản phẩm tồn tại
        const [productCheck] = await connection.query(
            "SELECT * FROM SANPHAM WHERE masanpham = ?",
            [masanpham]
        );
        if (productCheck.length === 0) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        // Lấy hoặc tạo giỏ hàng
        let magiohang;
        const [cart] = await connection.query(
            "SELECT * FROM GIOHANG WHERE manguoidung = ?",
            [manguoidung]
        );

        if (cart.length === 0) {
            const [insertCart] = await connection.query(
                "INSERT INTO GIOHANG (manguoidung) VALUES (?)",
                [manguoidung]
            );
            magiohang = insertCart.insertId;
        } else {
            magiohang = cart[0].magiohang;
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const [cartCheck] = await connection.query(
            "SELECT * FROM CHITIETGIOHANG WHERE magiohang = ? AND masanpham = ?",
            [magiohang, masanpham]
        );

        if (cartCheck.length > 0) {
            // Nếu đã có thì cập nhật số lượng
            await connection.query(
                "UPDATE CHITIETGIOHANG SET soluong = soluong + ? WHERE magiohang = ? AND masanpham = ?",
                [soluong, magiohang, masanpham]
            );
        } else {
            // Nếu chưa có thì thêm mới
            await connection.query(
                "INSERT INTO CHITIETGIOHANG (magiohang, masanpham, soluong) VALUES (?, ?, ?)",
                [magiohang, masanpham, soluong]
            );
        }

        res.status(201).json({
            message: "Sản phẩm đã được thêm vào giỏ hàng",
            data: { manguoidung, masanpham, magiohang, soluong },
        });

    } catch (err) {
        console.error("Error adding product to cart:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Xóa toàn bộ giỏ hàng của 1 người dùng
const deleteCartItems = async (req, res) => {
    const { manguoidung } = req.body;

    if (!manguoidung) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin người dùng." });
    }

    try {
        await connection.query(
            "DELETE FROM CHITIETGIOHANG WHERE magiohang IN (SELECT magiohang FROM GIOHANG WHERE manguoidung = ?)",
            [manguoidung]
        );
        await connection.query(
            "DELETE FROM GIOHANG WHERE manguoidung = ?",
            [manguoidung]
        );

        return res.status(200).json({ success: true, message: "Xóa giỏ hàng thành công." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi khi xóa giỏ hàng.", error: error.message });
    }
};

// Xóa một sản phẩm trong giỏ hàng
const deleteProductInCart = async (req, res) => {
    const { magiohang, masanpham } = req.params;

    if (!magiohang || !masanpham) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ magiohang và masanpham' });
    }

    try {
        const [result] = await connection.query(
            `DELETE FROM CHITIETGIOHANG WHERE magiohang = ? AND masanpham = ?`,
            [magiohang, masanpham]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error });
    }
};

module.exports = {
    addToCart,
    getAllCartByCustomer,
    deleteCartItems,
    deleteProductInCart,
};
