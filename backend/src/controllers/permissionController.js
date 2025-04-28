const pool = require("../config/database");

const getPermissions = async (req, res) => {
    try {
        const [permissions] = await pool.query("SELECT * FROM PHANQUYEN WHERE trangthaiquyen = 0");

        return res.status(200).json({
            EM: "Lấy danh sách quyền thành công",
            EC: 1,
            DT: permissions,
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi khi lấy quyền: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const createPermission = async (req, res) => {
    const { tenquyen, mota } = req.body;

    if (!tenquyen) {
        return res.status(400).json({
            EM: "Tên quyền là bắt buộc",
            EC: 0,
            DT: [],
        });
    }

    try {
        await pool.query(
            "INSERT INTO PHANQUYEN (tenquyen, mota, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
            [tenquyen, mota]
        );
        return res.status(201).json({
            EM: "Tạo quyền thành công",
            EC: 1,
            DT: [],
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi khi tạo quyền: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const updatePermission = async (req, res) => {
    const { maquyen, tenquyen, mota } = req.body;

    if (!maquyen || !tenquyen) {
        return res.status(400).json({
            EM: "Mã quyền và tên quyền là bắt buộc",
            EC: 0,
            DT: [],
        });
    }

    try {
        await pool.query(
            "UPDATE PHANQUYEN SET tenquyen = ?, mota = ?, updated_at = NOW() WHERE maquyen = ?",
            [tenquyen, mota, maquyen]
        );
        return res.status(200).json({
            EM: "Cập nhật quyền thành công",
            EC: 1,
            DT: [],
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi khi cập nhật quyền: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const deletePermission = async (req, res) => {
    const { maquyen } = req.body;

    if (!maquyen) {
        return res.status(400).json({
            EM: "Mã quyền là bắt buộc",
            EC: 0,
            DT: [],
        });
    }

    try {
        await pool.query(
            "UPDATE PHANQUYEN SET trangthaiquyen = 1, updated_at = NOW() WHERE maquyen = ?",
            [maquyen]
        );
        return res.status(200).json({
            EM: "Xóa quyền thành công",
            EC: 1,
            DT: [],
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi khi xóa quyền: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

module.exports = {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission,
}