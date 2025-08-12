const connection = require("../config/database");

// GET all products theo trạng thái
const getAllProduct = async (req, res) => {
    try {
        const queryActive = `
        SELECT
            sp.*,
            th.tenthuonghieu
        FROM
            SANPHAM sp
        LEFT JOIN
            THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
        WHERE
            sp.trangthai = 0 AND sp.soluong > 0
        GROUP BY
            sp.masanpham
        ORDER BY
            sp.ngaycapnhat DESC,
            sp.ngaytao DESC;
        `;

        const queryInactive = `
        SELECT
            sp.*,
            th.tenthuonghieu
        FROM
            SANPHAM sp
        LEFT JOIN
            THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
        WHERE
            sp.trangthai = 1
        GROUP BY
            sp.masanpham
        ORDER BY
            sp.ngaytao DESC;
        `;

        const [activeResults] = await connection.query(queryActive);
        const [inactiveResults] = await connection.query(queryInactive);

        return res.status(200).json({
            EM: "Lấy danh sách sản phẩm thành công",
            EC: 1,
            DT: {
                activeProducts: activeResults,
                inactiveProducts: inactiveResults,
            },
        });

    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({
            EM: `Lỗi lấy danh sách tất cả sản phẩm: ${err.message}`,
            EC: -1,
            DT: [],
        });
    }
};

// GET sản phẩm theo ID
const getDetailProduct = async (req, res) => {
    let masanpham = req.params.masanpham;
    try {
        const query = `
        SELECT 
            sp.*,
            th.tenthuonghieu
        FROM
            SANPHAM sp
        JOIN 
            THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
        WHERE 
            sp.masanpham = ?
        GROUP BY
            sp.masanpham;
        `;

        const [results] = await connection.query(query, [masanpham]);

        if (results.length === 0) {
            return res.status(404).json({
                EM: "Product not found",
                EC: 0,
                DT: [],
            });
        }

        // Chuyển đổi danhsachmamau thành mảng số nguyên
        const product = results[0];

        return res.status(200).json({
            EM: "Lấy thông tin sản phẩm thành công",
            EC: 1,
            DT: product,
        });
    } catch (err) {
        console.error("Error fetching:", err);
        return res.status(500).json({
            EM: `Lỗi controller: ${err.message}`,
            EC: -1,
            DT: [],
        });
    }
};

// POST tạo mới sản phẩm
const createProduct = async (req, res) => {
    const {
        mathuonghieu,
        tensanpham,
        hinhanhchinh,
        mau,
        dungluong,
        ram,
        hedieuhanh,
        soluong,
        gianhap,
        giaban,
        khuyenmai,
        cpu,
        gpu,
        cameratruoc,
        camerasau,
        congnghemanhinh,
        dophangiaimanhinh,
        pin,
        mota,
        trangthai,
    } = req.body;

    try {
        const [result] = await connection.query(
            `INSERT INTO SANPHAM (
        mathuonghieu, 
        tensanpham,
        hinhanhchinh,
        mau,
        dungluong,
        ram,
        hedieuhanh,
        soluong,
        gianhap,
        giaban,
        khuyenmai,
        cpu,
        gpu,
        cameratruoc,
        camerasau,
        congnghemanhinh,
        dophangiaimanhinh,
        pin,
        mota,
        trangthai
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                mathuonghieu,
                tensanpham,
                hinhanhchinh,
                mau,
                dungluong,
                ram,
                hedieuhanh,
                soluong, // nếu DB là soluongsanpham thì giữ nguyên biến này
                gianhap,
                giaban,
                khuyenmai,
                cpu,
                gpu,
                cameratruoc,
                camerasau,
                congnghemanhinh,
                dophangiaimanhinh,
                pin,
                mota,
                trangthai,
            ]
        );

        return res.status(201).json({
            message: "Sản phẩm đã được tạo thành công",
            product: {
                masanpham: result.insertId,
                mathuonghieu,
                tensanpham,
                hinhanhchinh,
                mau,
                dungluong,
                ram,
                hedieuhanh,
                soluong,
                gianhap,
                giaban,
                khuyenmai,
                cpu,
                gpu,
                cameratruoc,
                camerasau,
                congnghemanhinh,
                dophangiaimanhinh,
                pin,
                mota,
                trangthai,
            }
        });
    } catch (err) {
        console.error("Error creating product:", err.message);
        res.status(500).json({ message: err.message });
    }
};


// PUT cập nhật sản phẩm
const updateProduct = async (req, res) => {
    const { masanpham } = req.params;
    const {
        mathuonghieu,
        tensanpham,
        hinhanhchinh,
        mau,
        dungluong,
        ram,
        hedieuhanh,
        soluong,
        gianhap,
        giaban,
        khuyenmai,
        cpu,
        gpu,
        cameratruoc,
        camerasau,
        congnghemanhinh,
        dophangiaimanhinh,
        pin,
        mota,
        trangthai
    } = req.body;

    try {
        const [result] = await connection.query(
            `
                UPDATE SANPHAM
                SET
                    mathuonghieu = ?,
                    tensanpham = ?,
                    hinhanhchinh = ?,
                    mau = ?,
                    dungluong = ?,
                    ram = ?,
                    hedieuhanh = ?,
                    soluong = ?,
                    gianhap = ?,
                    giaban = ?,
                    khuyenmai = ?,
                    cpu = ?,
                    gpu = ?,
                    cameratruoc = ?,
                    camerasau = ?,
                    congnghemanhinh = ?,
                    dophangiaimanhinh = ?,
                    pin = ?,
                    mota = ?,
                    trangthai = ?
                WHERE masanpham = ?
            `,
            [
                mathuonghieu,
                tensanpham,
                hinhanhchinh,
                mau,
                dungluong,
                ram,
                hedieuhanh,
                soluong,
                gianhap,
                giaban,
                khuyenmai,
                cpu,
                gpu,
                cameratruoc,
                camerasau,
                congnghemanhinh,
                dophangiaimanhinh,
                pin,
                mota,
                trangthai,
                masanpham
            ]
        );

        if (result.affectedRows > 0) {
            res.json({ message: "Sản phẩm đã được cập nhật thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (err) {
        console.error("Error updating product:", err.message);
        res.status(500).json({ message: err.message });
    }
};


// DELETE mềm sản phẩm (đặt trangthai = 1)
const deleteProduct = async (req, res) => {
    try {
        const query = "UPDATE SANPHAM SET trangthai = 1 WHERE masanpham = ?";
        const [result] = await connection.query(query, [req.params.masanpham]);
        if (result.affectedRows === 0) {
            return res.status(400).json({
                EM: "Không tìm thấy sản phẩm",
                EC: 0,
                DT: [],
            });
        }

        const [data] = await connection.query("SELECT * FROM SANPHAM WHERE trangthai = 0");
        return res.status(200).json({
            EM: "Ẩn sản phẩm thành công",
            EC: 1,
            DT: data,
        });
    } catch (err) {
        console.error("Lỗi ẩn sản phẩm:", err);
        return res.status(500).json({
            EM: `Lỗi xóa sản phẩm: ${err.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const updateStatusProduct = async (req, res) => {
    const { masanpham } = req.params; // Product ID
    const { trangthai } = req.body; // New status

    if (trangthai === undefined || !Number.isInteger(trangthai)) {
        return res.status(400).json({
            EM: "Trạng thái sản phẩm không hợp lệ",
            EC: -1,
            DT: [],
        });
    }
    try {
        // Update query
        const [updateResult] = await connection.execute(
            "UPDATE SANPHAM SET trangthai = ? WHERE masanpham = ?",
            [trangthai, masanpham]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy sản phẩm",
                EC: 0,
                DT: [],
            });
        }

        return res.status(200).json({
            EM: "Cập nhật trạng thái thành công",
            EC: 1,
            DT: updateResult,
        });
    } catch (err) {
        return res.status(500).json({
            EM: `Lỗi cập nhật trạng thái: ${err.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const bestSellingProducts = async (req, res) => {
    const query = `
        SELECT 
            sp.masanpham, 
            sp.tensanpham, 
            sp.giasanpham, 
            SUM(ctdh.soluong) AS total_sold 
        FROM 
            CHITIETDONHANG ctdh
        JOIN 
            SANPHAM sp ON ctdh.masanpham = sp.masanpham
        GROUP BY 
            sp.masanpham, sp.tensanpham, sp.giasanpham
        ORDER BY 
            total_sold DESC;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy dữ liệu:', err);
            res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' });
            return;
        }
        res.json(results);
    });
}

module.exports = {
    getAllProduct,
    getDetailProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStatusProduct,
    bestSellingProducts,
};
