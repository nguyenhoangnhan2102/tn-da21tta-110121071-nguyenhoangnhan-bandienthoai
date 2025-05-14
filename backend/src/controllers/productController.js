const pool = require("../config/database");

// Lấy tất cả sản phẩm (chỉ lấy sản phẩm chưa bị xóa)
const getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT sp.*, th.tenthuonghieu 
            FROM SANPHAM sp
            LEFT JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
            WHERE sp.trangthai = 0
            ORDER BY sp.masanpham DESC
        `);

        res.status(200).json({
            EM: "Lấy danh sách sản phẩm thành công",
            EC: 0,
            DT: rows
        });
    } catch (error) {
        res.status(500).json({
            EM: `Lỗi: ${error.message}`,
            EC: -1,
            DT: []
        });
    }
};


// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
    const masanpham = req.params.id;

    try {
        // Lấy thông tin sản phẩm chính
        const [productRows] = await pool.query(`
            SELECT sp.*, th.tenthuonghieu 
            FROM SANPHAM sp
            LEFT JOIN THUONGHIEU th ON sp.mathuonghieu = th.mathuonghieu
            WHERE sp.masanpham = ? AND sp.trangthai = 0
        `, [masanpham]);

        if (productRows.length === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy sản phẩm",
                EC: 0,
                DT: null
            });
        }

        // Lấy danh sách màu - dung lượng của sản phẩm
        const [detailRows] = await pool.query(`
            SELECT * FROM CHITIETSANPHAM 
            WHERE masanpham = ? AND trangthai = 0
        `, [masanpham]);

        const result = {
            ...productRows[0],
            variations: detailRows
        };

        return res.status(200).json({
            EM: "Lấy sản phẩm thành công",
            EC: 0,
            DT: result
        });

    } catch (error) {
        return res.status(500).json({
            EM: `Lỗi khi lấy sản phẩm: ${error.message}`,
            EC: -1,
            DT: null
        });
    }
};


// Tạo sản phẩm (cho phép nhiều hình ảnh lưu dạng JSON chuỗi)
// const createProduct = async (req, res) => {
//     const {
//         mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, ram,
//         congnghemanhinh, dophangiai, cameratruoc, camerasau, pin
//     } = req.body;

//     const images = req.files?.map(file => file.filename); // từ multer
//     const hinhanh = images?.length > 0 ? JSON.stringify(images) : null;

//     try {
//         const [result] = await pool.query(
//             `INSERT INTO SANPHAM 
//             (mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, ram, congnghemanhinh, dophangiai, cameratruoc, camerasau, pin, hinhanh)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [mathuonghieu, tensanpham, hedieuhanh, cpu, gpu, ram, congnghemanhinh, dophangiai, cameratruoc, camerasau, pin, hinhanh]
//         );

//         return res.status(201).json({
//             EM: "Tạo sản phẩm thành công",
//             EC: 1,
//             DT: { masanpham: result.insertId },
//         });
//     } catch (error) {
//         return res.status(400).json({
//             EM: `Lỗi khi tạo sản phẩm: ${error.message}`,
//             EC: -1,
//             DT: [],
//         });
//     }
// };

const createProduct = async (req, res) => {
  const {
    mathuonghieu,
    tensanpham,
    hinhanh,
    hedieuhanh,
    cpu,
    gpu,
    cameratruoc,
    camerasau,
    congnghemanhinh,
    dophangiaimanhinh,
    pin,
    mota,
    chiTietSanPham, // Cập nhật để nhận chi tiết sản phẩm
  } = req.body;

  const uploadedImages = req.files.map(file => file.filename);
  const productImages = uploadedImages.join(","); // Các ảnh của sản phẩm chính

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Thêm vào bảng SANPHAM
    const [productResult] = await connection.query(
      `INSERT INTO SANPHAM 
        (mathuonghieu, tensanpham, hinhanh, hedieuhanh, cpu, gpu, cameratruoc, camerasau, congnghemanhinh, dophangiaimanhinh, pin, mota)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mathuonghieu,
        tensanpham,
        productImages, // Dữ liệu ảnh đã được upload cho sản phẩm chính
        hedieuhanh,
        cpu,
        gpu,
        cameratruoc,
        camerasau,
        congnghemanhinh,
        dophangiaimanhinh,
        pin,
        mota,
      ]
    );

    const masanpham = productResult.insertId; // Lấy masanpham của sản phẩm mới tạo

    // Thêm vào bảng CHITIETSANPHAM cho các chi tiết sản phẩm
    for (const detail of chiTietSanPham) {
      // Chỉ lấy 1 ảnh duy nhất cho chi tiết sản phẩm
      const detailImage = detail.hinhanh ? detail.hinhanh[0] : null;

      await connection.query(
        `INSERT INTO CHITIETSANPHAM
          (masanpham, mau, dungluong, ram, soluong, giaban, gianhap, trangthai, hinhanh)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          masanpham, // Đặt masanpham tương ứng với sản phẩm vừa tạo
          detail.mau,
          detail.dungluong,
          detail.ram,
          detail.soluong,
          detail.giaban,
          detail.gianhap,
          detail.trangthai || 0, // Trạng thái có thể là 0 (chưa có sẵn) hoặc 1 (có sẵn)
          detailImage, // Lấy ảnh chi tiết (chỉ 1 ảnh duy nhất)
        ]
      );
    }

    // Commit transaction sau khi thêm thành công
    await connection.commit();
    res.status(201).json({
      EM: "Tạo sản phẩm thành công",
      EC: 1,
      DT: [], // Có thể trả về thông tin chi tiết sản phẩm hoặc gì đó khác nếu cần
    });
  } catch (error) {
    await connection.rollback(); // Rollback nếu có lỗi xảy ra
    res.status(500).json({
      EM: `Lỗi khi tạo sản phẩm: ${error.message}`,
      EC: -1,
      DT: [],
    });
  } finally {
    connection.release(); // Giải phóng kết nối
  }
};



// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    const masanpham = req.params.id;
    const {
        mathuonghieu,
        tensanpham,
        hinhanh,
        hedieuhanh,
        cpu,
        gpu,
        cameratruoc,
        camerasau,
        congnghemanhinh,
        dophangiaimanhinh,
        pin,
        mota
    } = req.body;

    try {
        const [result] = await pool.query(`
            UPDATE SANPHAM SET 
                mathuonghieu = ?, tensanpham = ?, hinhanh = ?, hedieuhanh = ?,
                cpu = ?, gpu = ?, cameratruoc = ?, camerasau = ?,
                congnghemanhinh = ?, dophangiaimanhinh = ?, pin = ?, mota = ?
            WHERE masanpham = ?`,
            [mathuonghieu, tensanpham, hinhanh, hedieuhanh, cpu, gpu, cameratruoc, camerasau,
             congnghemanhinh, dophangiaimanhinh, pin, mota, masanpham]
        );

        res.status(200).json({
            EM: "Cập nhật sản phẩm thành công",
            EC: 0,
            DT: result
        });
    } catch (error) {
        res.status(500).json({
            EM: `Lỗi cập nhật: ${error.message}`,
            EC: -1,
            DT: []
        });
    }
};

// Xóa mềm sản phẩm
const deleteProduct = async (req, res) => {
    const masanpham = req.params.id;

    try {
        const [result] = await pool.query(
            `UPDATE SANPHAM SET trangthai = 1 WHERE masanpham = ?`,
            [masanpham]
        );

        res.status(200).json({
            EM: "Xóa sản phẩm thành công (trạng thái = 1)",
            EC: 0,
            DT: result
        });
    } catch (error) {
        res.status(500).json({
            EM: `Lỗi xóa sản phẩm: ${error.message}`,
            EC: -1,
            DT: []
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
