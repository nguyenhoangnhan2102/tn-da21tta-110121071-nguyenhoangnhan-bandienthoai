const pool = require("../config/database");

const getAllColor = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM MAU WHERE trangthaimau = 0");
        return res.status(200).json({
            EM: "Lấy tất cả màu thành công",
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

const getColorById = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM MAU WHERE mamau = ? AND trangthaimau = 0", [req.params.mamau]);
        if (rows.length === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy màu",
                EC: 0,
                DT: [],
            });
        }
        return res.status(200).json({
            EM: "Lấy màu thành công",
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

const createColor = async (req, res) => {
    const { tenmau } = req.body;
    try {
        const [result] = await pool.query("INSERT INTO MAU (tenmau) VALUES (?)", [tenmau]);
        return res.status(201).json({
            EM: "Tạo màu thành công",
            EC: 1,
            DT: { mamau: result.insertId, tenmau },
        });
    } catch (error) {
        return res.status(400).json({
            EM: `Lỗi khi tạo màu: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const updateColor = async (req, res) => {
    const { tenmau } = req.body;
    const { mamau } = req.params;
    try {
        const [result] = await pool.query(
            "UPDATE MAU SET tenmau = ?, updated_at = CURRENT_TIMESTAMP WHERE mamau = ? AND trangthaimau = 0"
            , [tenmau, mamau]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy màu để cập nhật",
                EC: 0,
                DT: [],
            });
        }
        return res.status(200).json({
            EM: "Cập nhật màu thành công",
            EC: 1,
            DT: { mamau, tenmau },
        });
    } catch (error) {
        return res.status(400).json({
            EM: `Lỗi khi cập nhật màu: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const deleteColor = async (req, res) => {
    const { mamau } = req.params;
    try {
        const [result] = await pool.query("UPDATE MAU SET trangthaimau = 1, updated_at = CURRENT_TIMESTAMP WHERE mamau = ?", [mamau]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy màu để xóa",
                EC: 0,
                DT: [],
            });
        }
        return res.status(200).json({
            EM: "Xóa mềm màu thành công (đổi trạng thái)",
            EC: 1,
            DT: [],
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi server khi xóa: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

module.exports = {
    getAllColor,
    getColorById,
    createColor,
    updateColor,
    deleteColor
};
