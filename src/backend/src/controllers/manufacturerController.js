const connection = require("../config/database.js");

const getAllManufacturer = async (req, res) => {
    try {
        const query = `
            SELECT 
                TH.mathuonghieu,
                TH.tenthuonghieu,
                TH.trangthaithuonghieu,
                GROUP_CONCAT(SP.tensanpham SEPARATOR ', ') AS sanpham
            FROM 
                THUONGHIEU TH
            LEFT JOIN 
                SANPHAM SP ON TH.mathuonghieu = SP.mathuonghieu
            WHERE
                TH.trangthaithuonghieu = 0   
            GROUP BY 
                TH.mathuonghieu, TH.tenthuonghieu
            ORDER BY
                TH.ngaytao DESC;
        `;
        const allquery = `
            SELECT 
                TH.mathuonghieu,
                TH.tenthuonghieu,
                TH.trangthaithuonghieu,
                GROUP_CONCAT(SP.tensanpham SEPARATOR ', ') AS sanpham
            FROM 
                THUONGHIEU TH
            LEFT JOIN 
                SANPHAM SP ON TH.mathuonghieu = SP.mathuonghieu
            GROUP BY 
                TH.mathuonghieu, TH.tenthuonghieu
            ORDER BY
                (TH.trangthaithuonghieu = 0) DESC,
                TH.ngaytao DESC;
        `;
        const [activeManufacturer] = await connection.query(query);
        const [allManufacturer] = await connection.query(allquery);
        return res.status(200).json({
            EM: "Lấy danh sách thương hiệu thành công",
            EC: 1,
            DT: { activeManufacturer, allManufacturer },
        });
    } catch (err) {
        console.error("Error fetching Manufacturer:", err);
        return res.status(500).json({
            EM: `Lỗi controller getAllManufacturer: ${err.message}`,
            EC: -1,
            DT: [],
        });
    }
};


const createManufacture = async (req, res) => {
    const { tenthuonghieu, trangthaithuonghieu } = req.body;

    try {
        // Kiểm tra xem thương hiệu đã tồn tại chưa
        const [existingManufacturer] = await connection.query(
            `SELECT * FROM THUONGHIEU WHERE tenthuonghieu = ?`,
            [tenthuonghieu]
        );

        if (existingManufacturer.length > 0) {
            return res.status(400).json({ message: "Tên thương hiệu đã tồn tại" });
        }

        // Thêm mới thương hiệu nếu chưa tồn tại
        const [result] = await connection.query(
            `INSERT INTO THUONGHIEU (tenthuonghieu, trangthaithuonghieu) VALUES (?, ?)`,
            [tenthuonghieu, trangthaithuonghieu]
        );

        return res.status(201).json({
            message: "Thương hiệu đã được tạo thành công",
            manufacturer: {
                mathuonghieu: result.insertId,
                tenthuonghieu,
            },
        });
    } catch (err) {
        console.error("Error creating manufacturer:", err.message);
        res.status(500).json({ message: "Lỗi trong quá trình tạo thương hiệu" });
    }
};


const updateManufacture = async (req, res) => {
    const { mathuonghieu } = req.params;
    const {
        tenthuonghieu,
        trangthaithuonghieu,
    } = req.body;

    try {
        const result = await connection.query
            (
                ` UPDATE THUONGHIEU SET tenthuonghieu = ?, trangthaithuonghieu = ? WHERE mathuonghieu = ? `,
                [tenthuonghieu, trangthaithuonghieu, mathuonghieu]
            );

        if (result[0].affectedRows > 0) {
            res.json({ message: "Manufacturer updated" });
        } else {
            res.status(404).json({ message: "Manufacturer not found" });
        }
    } catch (err) {
        console.error("Error updating Manufacturer:", err.message);
        res.status(500).json({ message: err.message });
    }
}

const deleteManufacture = async (req, res) => {
    try {
        const query = "UPDATE THUONGHIEU SET trangthaithuonghieu = 1 WHERE mathuonghieu = ?";
        const [result] = await connection.query(query, [req.params.mathuonghieu]);
        console.log("result", result);
        if (result.affectedRows === 0) {
            return res.status(400).json({
                EM: "Manufacturer not found",
                EC: 0,
                DT: [],
            });
        }
        const [data_deleted, filed_data] = await connection.query(`SELECT * FROM THUONGHIEU`);
        console.log("data_deleted", data_deleted);
        return res.status(200).json({
            EM: "Xóa thương hiệu thành công",
            EC: 1,
            DT: data_deleted,
        });
    } catch (err) {
        console.error("Error deleting manufacturer:", err);
        return res.status(500).json({
            EM: `Lỗi controller deleteManufacture: ${err.message}`,
            EC: -1,
            DT: [],
        });
    }
};


module.exports = {
    getAllManufacturer,
    deleteManufacture,
    createManufacture,
    updateManufacture,
}