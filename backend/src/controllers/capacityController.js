const pool = require("../config/database");

const getAllCapacity = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM DUNGLUONG");
        return res.status(200).json({
            EM: "Lấy tất cả dung lượng thành công",
            EC: 1,
            DT: rows,
        });
    } catch (error) {
        console.error("Lỗi trong getAllDungLuong:", error);
        return res.status(500).json({
            EM: `Lỗi hệ thống: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};


const createCapacity = async (req, res) => {
    try {
        const { dungluong, trangthaidungluong } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!dungluong) {
            return res.status(400).json({
                EM: "Thiếu thông tin dung lượng",
                EC: 0,
                DT: [],
            });
        }

        const [result] = await pool.query(
            `INSERT INTO DUNGLUONG (dungluong, trangthaidungluong, created_at, updated_at)
             VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [dungluong, trangthaidungluong || 0]
        );

        // Lấy lại thông tin vừa insert nếu cần
        const [newDungLuong] = await pool.query(
            "SELECT * FROM DUNGLUONG WHERE madungluong = ?",
            [result.insertId]
        );

        return res.status(201).json({
            EM: "Tạo mới dung lượng thành công",
            EC: 1,
            DT: newDungLuong[0],
        });
    } catch (error) {
        console.error("Error in createDungLuong:", error);
        return res.status(500).json({
            EM: `Lỗi hệ thống: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const updateCapacity = async (req, res) => {
    try {
        const { madungluong } = req.params;
        const { dungluong } = req.body;

        if (!madungluong || !dungluong) {
            return res.status(400).json({
                EM: "Thiếu dữ liệu cần thiết",
                EC: 0,
                DT: [],
            });
        }

        const [result] = await pool.execute(
            `UPDATE DUNGLUONG 
             SET dungluong = ?, updated_at = NOW() 
             WHERE madungluong = ?`,
            [dungluong, madungluong]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                EM: "Cập nhật dung lượng thành công",
                EC: 1,
                DT: [],
            });
        } else {
            return res.status(404).json({
                EM: "Không tìm thấy dung lượng cần cập nhật",
                EC: 0,
                DT: [],
            });
        }
    } catch (error) {
        console.error("Lỗi trong updateDungLuongById:", error);
        return res.status(500).json({
            EM: `Lỗi hệ thống: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const deleteCapacity = async (req, res) => {
    try {
        const { madungluong } = req.params;

        if (!madungluong) {
            return res.status(400).json({
                EM: "Thiếu ID dung lượng",
                EC: 0,
                DT: [],
            });
        }

        const [result] = await pool.execute(
            `UPDATE DUNGLUONG 
             SET trangthaidungluong = 1, updated_at = NOW() 
             WHERE madungluong = ?`,
            [madungluong]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                EM: "Xóa dung lượng (mềm) thành công",
                EC: 1,
                DT: [],
            });
        } else {
            return res.status(404).json({
                EM: "Không tìm thấy dung lượng để xóa",
                EC: 0,
                DT: [],
            });
        }
    } catch (error) {
        console.error("Lỗi trong softDeleteDungLuong:", error);
        return res.status(500).json({
            EM: `Lỗi hệ thống: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};


module.exports = {
    createCapacity,
    getAllCapacity,
    updateCapacity,
    deleteCapacity,
}