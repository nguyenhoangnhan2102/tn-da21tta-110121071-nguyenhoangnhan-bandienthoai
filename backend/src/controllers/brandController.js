const pool = require("../config/database");
const moment = require("moment-timezone");


const getAllBrand = async (req, res) => {
    try {
        const [activeBrands] = await pool.query(`
            SELECT * FROM THUONGHIEU 
            WHERE trangthaithuonghieu = 0
            ORDER BY ngaycapnhat DESC, ngaytao DESC
        `);

        const [inactiveBrands] = await pool.query(`
            SELECT * FROM THUONGHIEU 
            WHERE trangthaithuonghieu = 1
            ORDER BY ngaycapnhat DESC, ngaytao DESC
        `);

        return res.status(200).json({
            EM: "Lấy tất cả thương hiệu thành công",
            EC: 1,
            DT: {
                active: activeBrands,
                inactive: inactiveBrands,
            },
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi server: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const createBrand = async (req, res) => {
    const { tenthuonghieu, trangthaithuonghieu = 0 } = req.body;

    if (!tenthuonghieu) {
        return res.status(400).json({
            EM: "Tên thương hiệu là bắt buộc",
            EC: 0,
            DT: [],
        });
    }

    const nowVN = moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");

    try {
        await pool.query(
            `INSERT INTO THUONGHIEU (tenthuonghieu, trangthaithuonghieu, ngaytao, ngaycapnhat)
       VALUES (?, ?, ?, ?, ?)`,
            [tenthuonghieu, trangthaithuonghieu, nowVN, nowVN]
        );

        return res.status(201).json({
            EM: "Tạo thương hiệu thành công!",
            EC: 1,
            DT: [],
        });
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi khi tạo thương hiệu: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};


const updateBrand = async (req, res) => {
    const { mathuonghieu } = req.params;
    const { tenthuonghieu, trangthaithuonghieu, logo } = req.body;

    if (!tenthuonghieu) {
        return res.status(400).json({
            EM: "Tên thương hiệu là bắt buộc",
            EC: 0,
            DT: [],
        });
    }

    const nowVN = moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");

    try {
        const [result] = await pool.query(
            `UPDATE THUONGHIEU 
             SET tenthuonghieu = ?, trangthaithuonghieu = ?, logo = ?, ngaycapnhat = ?
             WHERE mathuonghieu = ?`,
            [tenthuonghieu, trangthaithuonghieu, logo, nowVN, mathuonghieu]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                EM: "Cập nhật thương hiệu thành công",
                EC: 1,
                DT: [],
            });
        } else {
            return res.status(404).json({
                EM: "Không tìm thấy thương hiệu để cập nhật",
                EC: 0,
                DT: [],
            });
        }
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi khi cập nhật: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};



const deleteBrand = async (req, res) => {
    const { mathuonghieu } = req.params;

    const nowVN = moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");

    try {
        const [result] = await pool.query(
            `UPDATE THUONGHIEU 
             SET trangthaithuonghieu = 1, ngaycapnhat = ?
             WHERE mathuonghieu = ?`,
            [nowVN, mathuonghieu]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                EM: "Xóa thương hiệu (mềm) thành công",
                EC: 1,
                DT: [],
            });
        } else {
            return res.status(404).json({
                EM: "Không tìm thấy thương hiệu để xóa",
                EC: 0,
                DT: [],
            });
        }
    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi khi xóa: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};


module.exports = {
    getAllBrand,
    createBrand,
    updateBrand,
    deleteBrand,
};
