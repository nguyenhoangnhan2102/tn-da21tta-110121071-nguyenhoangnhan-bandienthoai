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

// Lấy tất cả đơn hàng kèm hình ảnh sản phẩm
const getAllOrders = async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT 
                dh.madonhang,
                dh.manguoidung,
                dh.thoigiandat,
                dh.tongtien,
                dh.ghichu,
                dh.diachigiaohang,
                dh.hotenkhachhang,
                dh.sodienthoaikhachhang,
                dh.trangthai,
                dh.ngaytao,
                dh.ngaycapnhat,
                ctdh.masanpham,
                ctdh.tensanpham,
                ctdh.mau,
                ctdh.dungluong,
                ctdh.ram,
                ctdh.hinhanh,
                ctdh.soluong,
                ctdh.dongia,
                tt.hinhthucthanhtoan,
                tt.trangthai AS trangthaithanhtoan,
                tt.ngaythanhtoan
            FROM DONHANG dh
            JOIN CHITIETDONHANG ctdh ON dh.madonhang = ctdh.madonhang
            LEFT JOIN THANHTOAN tt ON dh.madonhang = tt.madonhang
            ORDER BY  
                dh.ngaycapnhat DESC,
                dh.ngaytao DESC;
        `);

        // Gom nhóm theo madonhang
        const ordersMap = {};

        rows.forEach(row => {
            if (!ordersMap[row.madonhang]) {
                ordersMap[row.madonhang] = {
                    madonhang: row.madonhang,
                    manguoidung: row.manguoidung,
                    thoigiandat: row.thoigiandat,
                    tongtien: row.tongtien,
                    ghichu: row.ghichu,
                    diachigiaohang: row.diachigiaohang,
                    hotenkhachhang: row.hotenkhachhang,
                    sodienthoaikhachhang: row.sodienthoaikhachhang,
                    trangthai: row.trangthai,
                    ngaytao: row.ngaytao,
                    ngaycapnhat: row.ngaycapnhat,
                    hinhthucthanhtoan: row.hinhthucthanhtoan,
                    trangthaithanhtoan: row.trangthaithanhtoan,
                    ngaythanhtoan: row.ngaythanhtoan,
                    sanpham: []
                };
            }

            ordersMap[row.madonhang].sanpham.push({
                masanpham: row.masanpham,
                tensanpham: row.tensanpham,
                mau: row.mau,
                dungluong: row.dungluong,
                ram: row.ram,
                hinhanh: row.hinhanh,
                soluong: row.soluong,
                dongia: row.dongia
            });
        });

        // Chuyển object map thành array
        const orders = Object.values(ordersMap);

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};


// Lấy chi tiết đơn hàng theo mã đơn
const getOrderDetails = async (req, res) => {
    try {
        const { madonhang } = req.params;
        if (!madonhang) {
            return res.status(400).json({ success: false, message: 'Mã đơn hàng là bắt buộc.' });
        }

        // Lấy thông tin chung của đơn hàng + thông tin thanh toán
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
                nd.email,
                tt.hinhthucthanhtoan,
                tt.trangthai AS trangthaithanhtoan,
                tt.ngaythanhtoan
            FROM DONHANG dh
            JOIN NGUOIDUNG nd ON dh.manguoidung = nd.manguoidung
            LEFT JOIN THANHTOAN tt ON dh.madonhang = tt.madonhang
            WHERE dh.madonhang = ?
        `, [madonhang]);

        if (headerRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
        }

        // Lấy danh sách sản phẩm trong đơn hàng (dùng dữ liệu lưu trực tiếp trong CHITIETDONHANG)
        const [items] = await connection.query(`
            SELECT 
                masanpham,
                tensanpham,
                mau,
                dungluong,
                ram,
                soluong,
                dongia,
                hinhanh
            FROM CHITIETDONHANG
            WHERE madonhang = ?
        `, [madonhang]);

        const orderDetails = {
            ...headerRows[0],
            sanpham: items.map(item => ({
                masanpham: item.masanpham,
                tensanpham: item.tensanpham,
                mau: item.mau,
                dungluong: item.dungluong,
                ram: item.ram,
                hinhanh: item.hinhanh,
                soluong: item.soluong,
                dongia: item.dongia,
                thanhtien: Number(item.dongia) * Number(item.soluong)
            }))
        };

        res.status(200).json({ success: true, data: orderDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};


// const confirmOrder = async (req, res) => {
//     const { manguoidung, diachigiaohang, ghichu = null, tongtien, sanpham } = req.body;

//     if (!manguoidung || !Array.isArray(sanpham) || sanpham.length === 0) {
//         return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng." });
//     }

//     const conn = await connection.getConnection();
//     try {
//         await conn.beginTransaction();

//         const thoigiandat = moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');

//         // 1️⃣ Lấy snapshot thông tin người dùng
//         const [userRows] = await conn.query(
//             `SELECT hoten, sodienthoai FROM NGUOIDUNG WHERE manguoidung = ?`,
//             [manguoidung]
//         );

//         if (userRows.length === 0) {
//             throw new Error(`Không tìm thấy người dùng mã ${manguoidung}.`);
//         }

//         const { hoten, sodienthoai } = userRows[0];

//         // 2️⃣ Thêm đơn hàng vào bảng DONHANG
//         const [result] = await conn.query(
//             `INSERT INTO DONHANG (manguoidung, hotenkhachhang, sodienthoaikhachhang, thoigiandat, tongtien, ghichu, diachigiaohang)
//              VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [manguoidung, hoten, sodienthoai, thoigiandat, tongtien, ghichu, diachigiaohang]
//         );

//         const madonhang = result.insertId;

//         // 3️⃣ Lặp qua từng sản phẩm trong giỏ
//         for (const item of sanpham) {
//             const { masanpham, soluong, hinhanh, dongia } = item;

//             if (!masanpham || !Number.isInteger(Number(soluong)) || Number(soluong) <= 0) {
//                 throw new Error('Sản phẩm không hợp lệ trong giỏ hàng.');
//             }

//             // 4️⃣ Lấy thông tin sản phẩm từ DB (snapshot)
//             const [prodRows] = await conn.query(
//                 `SELECT tensanpham, mau, dungluong, ram, giaban, soluong AS soluongton
//                  FROM SANPHAM WHERE masanpham = ? FOR UPDATE`,
//                 [masanpham]
//             );

//             if (prodRows.length === 0) {
//                 throw new Error(`Không tìm thấy sản phẩm mã ${masanpham}.`);
//             }

//             const product = prodRows[0];

//             // 5️⃣ Kiểm tra tồn kho
//             if (Number(product.soluongton) < Number(soluong)) {
//                 throw new Error(`Sản phẩm mã ${masanpham} không đủ số lượng.`);
//             }

//             // 6️⃣ Lưu vào CHITIETDONHANG (snapshot sản phẩm tại thời điểm đặt)
//             await conn.query(
//                 `INSERT INTO CHITIETDONHANG 
//                     (madonhang, masanpham, tensanpham, mau, dungluong, ram, soluong, dongia, hinhanh)
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//                 [
//                     madonhang,
//                     masanpham,
//                     product.tensanpham,
//                     product.mau,
//                     product.dungluong,
//                     product.ram,
//                     soluong,
//                     dongia,
//                     hinhanh
//                 ]
//             );

//             // ❗ Không trừ kho ở bước xác nhận. Chỉ trừ khi trạng thái = 'hoanthanh'.
//         }

//         // 7️⃣ Commit giao dịch
//         await conn.commit();

//         return res.status(201).json({
//             success: true,
//             message: "Đặt hàng thành công.",
//             madonhang,
//             thoigiandat
//         });
//     } catch (error) {
//         await conn.rollback();
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Lỗi xử lý đơn hàng.",
//             error: error.message
//         });
//     } finally {
//         conn.release();
//     }
// };

const confirmOrder = async (req, res) => {
    const {
        manguoidung,
        diachigiaohang,
        ghichu = null,
        tongtien,
        sanpham,
        hinhthucthanhtoan = "home" // 👈 thêm phương thức thanh toán
    } = req.body;

    if (!manguoidung || !Array.isArray(sanpham) || sanpham.length === 0) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng." });
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const thoigiandat = moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');

        // 1️⃣ Lấy thông tin người dùng
        const [userRows] = await conn.query(
            `SELECT hoten, sodienthoai FROM NGUOIDUNG WHERE manguoidung = ?`,
            [manguoidung]
        );
        if (userRows.length === 0) throw new Error(`Không tìm thấy người dùng mã ${manguoidung}.`);
        const { hoten, sodienthoai } = userRows[0];

        // 2️⃣ Thêm đơn hàng
        const [result] = await conn.query(
            `INSERT INTO DONHANG (manguoidung, hotenkhachhang, sodienthoaikhachhang, thoigiandat, tongtien, ghichu, diachigiaohang)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [manguoidung, hoten, sodienthoai, thoigiandat, tongtien, ghichu, diachigiaohang]
        );

        const madonhang = result.insertId;

        // 3️⃣ Lặp sản phẩm
        for (const item of sanpham) {
            const { masanpham, soluong, hinhanh, dongia } = item;
            if (!masanpham || !Number.isInteger(Number(soluong)) || Number(soluong) <= 0) {
                throw new Error('Sản phẩm không hợp lệ trong giỏ hàng.');
            }

            const [prodRows] = await conn.query(
                `SELECT tensanpham, mau, dungluong, ram, giaban, soluong AS soluongton
                 FROM SANPHAM WHERE masanpham = ? FOR UPDATE`,
                [masanpham]
            );
            if (prodRows.length === 0) throw new Error(`Không tìm thấy sản phẩm mã ${masanpham}.`);

            const product = prodRows[0];
            if (Number(product.soluongton) < Number(soluong)) {
                throw new Error(`Sản phẩm mã ${masanpham} không đủ số lượng.`);
            }

            await conn.query(
                `INSERT INTO CHITIETDONHANG 
                    (madonhang, masanpham, tensanpham, mau, dungluong, ram, soluong, dongia, hinhanh)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    madonhang,
                    masanpham,
                    product.tensanpham,
                    product.mau,
                    product.dungluong,
                    product.ram,
                    soluong,
                    dongia,
                    hinhanh
                ]
            );
        }

        // 4️⃣ Thêm thông tin thanh toán (ban đầu mặc định chưa thanh toán)
        await conn.query(
            `INSERT INTO THANHTOAN (madonhang, hinhthucthanhtoan, trangthai) 
             VALUES (?, ?, 'chuathanhtoan')`,
            [madonhang, hinhthucthanhtoan]
        );

        // 5️⃣ Commit
        await conn.commit();

        return res.status(201).json({
            success: true,
            message: "Đặt hàng thành công.",
            madonhang,
            thoigiandat,
            hinhthucthanhtoan,
            trangthai: "chuathanhtoan"
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Lỗi xử lý đơn hàng.",
            error: error.message
        });
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
    const { trangthai, hinhthucthanhtoan, trangthaithanhtoan } = req.body;

    // Các trạng thái đơn hàng hợp lệ
    const ORDER_STATUSES = ["choxacnhan", "danggiao", "hoanthanh", "huy"];
    const PAYMENT_METHODS = ["home", "vnpay", "momo", "paypal", "online"];
    const PAYMENT_STATUSES = ["chuathanhtoan", "dathanhtoan"];

    if (!ORDER_STATUSES.includes(trangthai)) {
        return res.status(400).json({
            EM: "Trạng thái đơn hàng không hợp lệ",
            EC: -1,
            DT: [],
        });
    }

    if (hinhthucthanhtoan && !PAYMENT_METHODS.includes(hinhthucthanhtoan)) {
        return res.status(400).json({
            EM: "Hình thức thanh toán không hợp lệ",
            EC: -1,
            DT: [],
        });
    }

    if (trangthaithanhtoan && !PAYMENT_STATUSES.includes(trangthaithanhtoan)) {
        return res.status(400).json({
            EM: "Trạng thái thanh toán không hợp lệ",
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

        // Cập nhật trạng thái đơn hàng
        const [updateResult] = await conn.query(
            `UPDATE DONHANG SET trangthai = ? WHERE madonhang = ?`,
            [trangthai, madonhang]
        );

        if (updateResult.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ EM: "Không tìm thấy đơn hàng", EC: 0, DT: [] });
        }

        // Nếu có truyền thêm hinhthucthanhtoan hoặc trangthaithanhtoan thì update bảng THANHTOAN
        if (hinhthucthanhtoan || trangthaithanhtoan) {
            const fields = [];
            const values = [];

            if (hinhthucthanhtoan) {
                fields.push("hinhthucthanhtoan = ?");
                values.push(hinhthucthanhtoan);
            }

            if (trangthaithanhtoan) {
                fields.push("trangthai = ?");
                values.push(trangthaithanhtoan);

                // Nếu trạng thái = "dathanhtoan" thì set luôn ngày thanh toán
                if (trangthaithanhtoan === "dathanhtoan") {
                    fields.push("ngaythanhtoan = NOW()");
                }
            }

            values.push(madonhang);

            await conn.query(
                `UPDATE THANHTOAN SET ${fields.join(", ")} WHERE madonhang = ?`,
                values
            );
        }

        await conn.commit();

        return res.status(200).json({
            EM: "Cập nhật trạng thái đơn hàng và thanh toán thành công",
            EC: 1,
            DT: { madonhang, trangthai, hinhthucthanhtoan, trangthaithanhtoan },
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
                dh.madonhang, 
                dh.thoigiandat, 
                dh.trangthai, 
                dh.tongtien, 
                dh.diachigiaohang,
                dh.ghichu,
                ctdh.masanpham, 
                ctdh.tensanpham, 
                ctdh.mau, 
                ctdh.dungluong, 
                ctdh.ram,
                ctdh.hinhanh, 
                ctdh.soluong, 
                ctdh.dongia
            FROM DONHANG dh
            LEFT JOIN CHITIETDONHANG ctdh ON dh.madonhang = ctdh.madonhang
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

        // Gom nhóm đơn hàng
        const formatted = orders.reduce((acc, row) => {
            let existingOrder = acc.find(o => o.madonhang === row.madonhang);

            const item = {
                masanpham: row.masanpham,
                tensanpham: row.tensanpham,
                mau: row.mau,
                dungluong: row.dungluong,
                ram: row.ram,
                hinhanh: row.hinhanh,
                soluong: row.soluong,
                dongia: row.dongia,
                thanhtien: row.soluong && row.dongia ? Number(row.soluong) * Number(row.dongia) : 0
            };

            if (existingOrder) {
                if (row.masanpham) existingOrder.chitiet.push(item);
            } else {
                acc.push({
                    madonhang: row.madonhang,
                    thoigiandat: row.thoigiandat,
                    trangthai: row.trangthai,
                    tongtien: row.tongtien,
                    diachigiaohang: row.diachigiaohang,
                    ghichu: row.ghichu,
                    chitiet: row.masanpham ? [item] : []
                });
            }
            return acc;
        }, []);

        return res.status(200).json({
            EM: "Lấy danh sách đơn hàng thành công",
            EC: 1,
            DT: formatted
        });

    } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
        return res.status(500).json({
            EM: `Lỗi server: ${err.message}`,
            EC: -1,
            DT: []
        });
    }
};

const cancelOrder = async (req, res) => {
    const { madonhang } = req.params;
    const { lydohuy } = req.body;

    if (!lydohuy || lydohuy.trim() === "") {
        return res.status(400).json({
            DT: null,
            EC: 1,
            EM: "Vui lòng nhập lý do hủy đơn hàng."
        });
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        // Kiểm tra đơn hàng
        const [orderRows] = await conn.query(
            `SELECT trangthai FROM DONHANG WHERE madonhang = ?`,
            [madonhang]
        );

        if (orderRows.length === 0) {
            return res.status(404).json({
                DT: null,
                EC: 1,
                EM: "Không tìm thấy đơn hàng."
            });
        }

        const { trangthai } = orderRows[0];

        if (trangthai !== "choxacnhan") {
            return res.status(400).json({
                DT: null,
                EC: 1,
                EM: "Đơn hàng không thể hủy ở trạng thái hiện tại."
            });
        }

        // Cập nhật trạng thái
        await conn.query(
            `UPDATE DONHANG 
             SET trangthai = 'huy', lydohuy = ?, ngaycapnhat = CURRENT_TIMESTAMP 
             WHERE madonhang = ?`,
            [lydohuy, madonhang]
        );

        await conn.commit();

        return res.status(200).json({
            DT: { madonhang, lydohuy },
            EC: 0,
            EM: "Đơn hàng đã được hủy thành công."
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        return res.status(500).json({
            DT: null,
            EC: 1,
            EM: "Lỗi khi hủy đơn hàng."
        });
    } finally {
        conn.release();
    }
};


module.exports = {
    getAllOrders,
    confirmOrder,
    updateOrders,
    getOrderDetails,
    getAllOrdersByCustomer,
    cancelOrder,
};
