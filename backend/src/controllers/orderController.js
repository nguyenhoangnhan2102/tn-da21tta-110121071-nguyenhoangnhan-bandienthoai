// controllers/orders.controller.js
// ✅ Aligned to your current MySQL schema in phoneshop (NGUOIDUNG, DONHANG, CHITIETDONHANG, SANPHAM)
// - DONHANG fields used: madonhang, manguoidung, thoigiandat, tongtien, ghichu, diachigiaohang, trangthai, ngaytao, ngaycapnhat
// - NGUOIDUNG fields used: manguoidung, hoten, email, sodienthoai, diachi
// - CHITIETDONHANG fields used: madonhang, masanpham, soluong, dongia
// - SANPHAM fields used: masanpham, tensanpham, soluong (stock)
//
// ❌ Removed legacy/mismatched fields & joins:
//   KHACHHANG, hotenkhachhang, sdtkhachhang, ngaydat, trangthaidonhang, created_at, update_at,
//   MAUSACSANPHAM/mamau/mausachinhanh, giatien, soluongsanpham
//
// ⚙️ Status values now use ENUM('choxacnhan','danggiao','hoanthanh','huy') via column DONHANG.trangthai.
//    Inventory (SANPHAM.soluong) is reduced when an order is moved to 'hoanthanh'.

const connection = require("../config/database.js");
const moment = require('moment-timezone');

const ORDER_STATUSES = ['choxacnhan', 'danggiao', 'hoanthanh', 'huy'];

const getAllOrders = async (req, res) => {
    try {
        const [rows] = await connection.query(`
      SELECT
        dh.madonhang,
        dh.manguoidung,
        dh.thoigiandat,
        dh.tongtien,
        dh.trangthai,
        dh.diachigiaohang,
        dh.ghichu,
        dh.ngaytao,
        dh.ngaycapnhat,
        nd.hoten AS tennguoidung,
        nd.email,
        nd.sodienthoai
      FROM DONHANG dh
      JOIN NGUOIDUNG nd ON dh.manguoidung = nd.manguoidung
      ORDER BY dh.ngaytao DESC
    `);

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

/**
 * GET /orders/:madonhang
 * Detailed order with items
 */
const getOrderDetails = async (req, res) => {
    try {
        const { madonhang } = req.params;
        if (!madonhang) {
            return res.status(400).json({ message: 'Mã đơn hàng là bắt buộc.' });
        }

        const [headerRows] = await connection.query(`
      SELECT 
        dh.madonhang,
        dh.manguoidung,
        dh.thoigiandat,
        dh.trangthai,
        dh.tongtien,
        dh.ghichu,
        dh.diachigiaohang,
        dh.ngaytao,
        dh.ngaycapnhat,
        nd.hoten,
        nd.sodienthoai,
        nd.email
      FROM DONHANG dh
      JOIN NGUOIDUNG nd ON dh.manguoidung = nd.manguoidung
      WHERE dh.madonhang = ?
    `, [madonhang]);

        if (headerRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }

        const [items] = await connection.query(`
      SELECT 
        ctdh.masanpham,
        sp.tensanpham,
        ctdh.soluong,
        ctdh.dongia
      FROM CHITIETDONHANG ctdh
      JOIN SANPHAM sp ON ctdh.masanpham = sp.masanpham
      WHERE ctdh.madonhang = ?
    `, [madonhang]);

        const orderDetails = {
            ...headerRows[0],
            sanpham: items.map(r => ({
                masanpham: r.masanpham,
                tensanpham: r.tensanpham,
                soluong: r.soluong,
                dongia: r.dongia,
                thanhtien: Number(r.dongia) * Number(r.soluong)
            }))
        };

        res.status(200).json({ success: true, data: orderDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

/**
 * POST /orders/confirm
 * Body expected:
 * {
 *   manguoidung: number,
 *   diachigiaohang: string,
 *   ghichu?: string,
 *   tongtien: number,
 *   sanpham: [ { masanpham: number, soluong: number, dongia: number } ]
 * }
 */
const confirmOrder = async (req, res) => {
    const { manguoidung, diachigiaohang, ghichu = null, tongtien, sanpham } = req.body;

    if (!manguoidung || !Array.isArray(sanpham) || sanpham.length === 0) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng." });
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const thoigiandat = moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');

        // Insert DONHANG
        const [result] = await conn.query(
            `INSERT INTO DONHANG (manguoidung, thoigiandat, tongtien, ghichu, diachigiaohang)
       VALUES (?, ?, ?, ?, ?)`,
            [manguoidung, thoigiandat, tongtien, ghichu, diachigiaohang]
        );

        const madonhang = result.insertId;

        // Validate stock & insert CHITIETDONHANG
        for (const item of sanpham) {
            const { masanpham, soluong, dongia } = item;

            if (!masanpham || !Number.isInteger(Number(soluong)) || Number(soluong) <= 0 || isNaN(Number(dongia))) {
                throw new Error('Sản phẩm không hợp lệ trong giỏ hàng.');
            }

            const [prodRows] = await conn.query(
                `SELECT soluong FROM SANPHAM WHERE masanpham = ? FOR UPDATE`,
                [masanpham]
            );

            if (prodRows.length === 0) {
                throw new Error(`Không tìm thấy sản phẩm mã ${masanpham}.`);
            }

            if (Number(prodRows[0].soluong) < Number(soluong)) {
                throw new Error(`Sản phẩm mã ${masanpham} không đủ số lượng.`);
            }

            await conn.query(
                `INSERT INTO CHITIETDONHANG (madonhang, masanpham, soluong, dongia)
         VALUES (?, ?, ?, ?)`,
                [madonhang, masanpham, soluong, dongia]
            );
            // ❗ Không trừ kho ở bước xác nhận. Chỉ trừ khi chuyển trạng thái -> 'hoanthanh'.
        }

        await conn.commit();

        return res.status(201).json({
            success: true,
            message: "Đặt hàng thành công.",
            madonhang,
            thoigiandat
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi xử lý đơn hàng.", error: error.message });
    } finally {
        conn.release();
    }
};

/**
 * PATCH /orders/:madonhang/status
 * Body: { trangthai: 'choxacnhan' | 'danggiao' | 'hoanthanh' | 'huy' }
 */
const updateOrders = async (req, res) => {
    const madonhang = req.params.madonhang;
    const { trangthai } = req.body;

    if (!ORDER_STATUSES.includes(trangthai)) {
        return res.status(400).json({
            EM: "Trạng thái đơn hàng không hợp lệ",
            EC: -1,
            DT: [],
        });
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        // Lấy trạng thái hiện tại
        const [currentOrder] = await conn.query(
            `SELECT trangthai FROM DONHANG WHERE madonhang = ? FOR UPDATE`,
            [madonhang]
        );

        if (currentOrder.length === 0) {
            await conn.rollback();
            return res.status(404).json({ EM: "Không tìm thấy đơn hàng", EC: 0, DT: [] });
        }

        const oldStatus = currentOrder[0].trangthai;

        // Nếu chuyển sang 'hoanthanh' lần đầu -> trừ kho
        if (trangthai === 'hoanthanh' && oldStatus !== 'hoanthanh') {
            const [orderItems] = await conn.query(
                `SELECT masanpham, soluong FROM CHITIETDONHANG WHERE madonhang = ?`,
                [madonhang]
            );

            for (const item of orderItems) {
                const [updateRes] = await conn.query(
                    `UPDATE SANPHAM SET soluong = soluong - ?
           WHERE masanpham = ? AND soluong >= ?`,
                    [item.soluong, item.masanpham, item.soluong]
                );

                if (updateRes.affectedRows === 0) {
                    throw new Error(`Không đủ số lượng sản phẩm mã ${item.masanpham}`);
                }
            }
        }

        // Cập nhật trạng thái
        const [updateResult] = await conn.query(
            `UPDATE DONHANG SET trangthai = ? WHERE madonhang = ?`,
            [trangthai, madonhang]
        );

        if (updateResult.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ EM: "Không tìm thấy đơn hàng", EC: 0, DT: [] });
        }

        await conn.commit();

        return res.status(200).json({
            EM: "Cập nhật trạng thái đơn hàng thành công",
            EC: 1,
            DT: { madonhang, trangthai },
        });
    } catch (err) {
        await conn.rollback();
        return res.status(500).json({
            EM: `Lỗi cập nhật trạng thái đơn hàng: ${err.message}`,
            EC: -1,
            DT: [],
        });
    } finally {
        conn.release();
    }
};

/**
 * GET /users/:manguoidung/orders
 */
const getAllOrdersByCustomer = async (req, res) => {
    const { manguoidung } = req.params;

    try {
        const [orders] = await connection.query(
            `SELECT 
         dh.madonhang, dh.thoigiandat, dh.trangthai, dh.tongtien, dh.diachigiaohang,
         ctdh.masanpham, ctdh.soluong, ctdh.dongia,
         sp.tensanpham
       FROM DONHANG dh
       LEFT JOIN CHITIETDONHANG ctdh ON dh.madonhang = ctdh.madonhang
       LEFT JOIN SANPHAM sp ON ctdh.masanpham = sp.masanpham
       WHERE dh.manguoidung = ?
       ORDER BY dh.thoigiandat DESC, dh.madonhang DESC`,
            [manguoidung]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                EM: "Không có đơn hàng nào được tìm thấy cho người dùng này",
                EC: 0,
                DT: []
            });
        }

        const formatted = orders.reduce((acc, row) => {
            let ex = acc.find(o => o.madonhang === row.madonhang);
            const item = {
                masanpham: row.masanpham,
                tensanpham: row.tensanpham,
                soluong: row.soluong,
                dongia: row.dongia,
                thanhtien: row.soluong && row.dongia ? Number(row.soluong) * Number(row.dongia) : 0
            };

            if (ex) {
                if (row.masanpham) ex.chitiet.push(item);
            } else {
                acc.push({
                    madonhang: row.madonhang,
                    thoigiandat: row.thoigiandat,
                    trangthai: row.trangthai,
                    tongtien: row.tongtien,
                    diachigiaohang: row.diachigiaohang,
                    chitiet: row.masanpham ? [item] : []
                });
            }
            return acc;
        }, []);

        return res.status(200).json({ EM: "Lấy danh sách đơn hàng thành công", EC: 1, DT: formatted });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
        return res.status(500).json({ EM: `Lỗi server: ${err.message}`, EC: -1, DT: [] });
    }
};

module.exports = {
    getAllOrders,
    confirmOrder,
    updateOrders,
    getOrderDetails,
    getAllOrdersByCustomer,
};
