const connection = require("../config/database.js");

// Thêm bình luận
const createComment = async (req, res) => {
    try {
        const { manguoidung, masanpham, sao, binhluan } = req.body;

        if (!manguoidung || !masanpham || !sao) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào!" });
        }

        const sql = `
      INSERT INTO DANHGIA (manguoidung, masanpham, sao, binhluan) 
      VALUES (?, ?, ?, ?)
    `;
        await db.query(sql, [manguoidung, masanpham, sao, binhluan]);

        return res.status(201).json({ message: "Thêm bình luận thành công!" });
    } catch (error) {
        console.error("createComment error:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Lấy tất cả bình luận của 1 sản phẩm
const getCommentsByProduct = async (req, res) => {
    try {
        const { masanpham } = req.params;

        const sql = `
      SELECT d.*, n.hoten, n.email 
      FROM DANHGIA d 
      JOIN NGUOIDUNG n ON d.manguoidung = n.manguoidung
      WHERE d.masanpham = ? AND d.trangthai = 0
      ORDER BY d.ngaytao DESC
    `;
        const [rows] = await db.query(sql, [masanpham]);

        res.json(rows);
    } catch (error) {
        console.error("getCommentsByProduct error:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Cập nhật bình luận
const updateComment = async (req, res) => {
    try {
        const { madanhgia } = req.params;
        const { sao, binhluan } = req.body;

        const sql = `
      UPDATE DANHGIA 
      SET sao = ?, binhluan = ?, ngaytao = NOW() 
      WHERE madanhgia = ?
    `;
        await db.query(sql, [sao, binhluan, madanhgia]);

        res.json({ message: "Cập nhật bình luận thành công!" });
    } catch (error) {
        console.error("updateComment error:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Xóa (ẩn) bình luận
const deleteComment = async (req, res) => {
    try {
        const { madanhgia } = req.params;

        const sql = `
      UPDATE DANHGIA SET trangthai = 1 WHERE madanhgia = ?
    `;
        await db.query(sql, [madanhgia]);

        res.json({ message: "Xóa bình luận thành công!" });
    } catch (error) {
        console.error("deleteComment error:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};
module.exports = {
    createComment,
    getCommentsByProduct,
    updateComment,
    deleteComment
};
