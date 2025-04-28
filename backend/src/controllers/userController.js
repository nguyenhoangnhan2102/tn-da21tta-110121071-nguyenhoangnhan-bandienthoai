const pool = require("../config/database");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpStorage = new Map();

const getAllUser_Admin = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM NGUOIDUNG ");
        const results = rows;
        return res.status(200).json({
            EM: "Lấy thông tin tất cả người dùng thành công",
            EC: 1,
            DT: results,
        });
    } catch (error) {
        console.error("Error in loginUserGoogle:", error);
        return res.status(500).json({
            EM: `Error: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const getUser_ById = async (req, res) => {
    try {
        const { manguoidung } = req.params;
        const [rows] = await pool.query(
            "SELECT * FROM NGUOIDUNG where manguoidung =? ",
            [manguoidung]
        );
        const results = rows;
        return res.status(200).json({
            EM: "Lấy thông tin tất cả người dùng thành công",
            EC: 1,
            DT: results,
        });
    } catch (error) {
        console.error("Error in loginUserGoogle:", error);
        return res.status(500).json({
            EM: `Error: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const registerUser = async (req, res) => {
    const {
        password,
        email,
        hoten
    } = req.body;

    // Mã hóa mật khẩu trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kiểm tra xem có thiếu thông tin cần thiết không
    if (!email || !hashedPassword || !hoten) {
        return res.status(400).json({
            EM: "Vui lòng nhập đủ thông tin",
            EC: 0,
            DT: [],
        });
    }

    try {
        // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
        const [existingUser] = await pool.query(
            `SELECT * FROM NGUOIDUNG WHERE email = ?`,
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                EM: "Tài khoản email này đã được đăng ký",
                EC: 0,
                DT: [],
            });
        }

        // Thực hiện đăng ký người dùng mới, mặc định gán maquyen = 0
        const [result] = await pool.query(
            `INSERT INTO NGUOIDUNG 
                (email, password, hoten, maquyen, created_at, updated_at)
                VALUES (?, ?, ?, 0, NOW(), NOW())`,
            [
                email,
                hashedPassword,
                hoten
            ]
        );

        return res.status(200).json({
            EM: "Đăng ký tài khoản thành công",
            EC: 1,
            DT: {
                manguoidung: result.insertId, // Trả về ID người dùng mới
                email,
                hoten,
            },
        });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        return res.status(500).json({
            EM: `Lỗi: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};


const logoutUser = (req, res) => {
    res.clearCookie("accessToken");
    return res.status(200).json({ message: "Đăng xuất thành công" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            EM: "Email và mật khẩu không được để trống",
            EC: 0,
            DT: [],
        });
    }

    try {
        // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
        const [rows] = await pool.query(
            "SELECT * FROM NGUOIDUNG WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                EM: "Người dùng không tồn tại",
                EC: 0,
                DT: [],
            });
        }

        const user = rows[0];

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password); // So sánh mật khẩu
        if (!isPasswordValid) {
            return res.status(401).json({
                EM: "Mật khẩu không đúng",
                EC: 0,
                DT: [],
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                manguoidung: user.manguoidung,
                email: user.email,
                role: user.role,
                hoten: user.hoten,
                sodienthoai: user.sodienthoai,
                diachi: user.diachi,
                created_at: user.created_at,
                updated_at: user.updated_at
            },
            JWT_SECRET,
            { expiresIn: "5h" }
        );

        // Trả về token và thông tin người dùng
        return res.status(200).json({
            EM: "Đăng nhập thành công",
            EC: 1,
            DT: {
                accessToken: token,
                userInfo: {
                    manguoidung: user.manguoidung,
                    email: user.email,
                    role: user.role,
                    hoten: user.hoten,
                    sodienthoai: user.sodienthoai,
                    diachi: user.diachi,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                },
            },
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({
            EM: `Lỗi: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const loginUserGoogle = async (req, res) => {
    const { email, hoten } = req.body;

    if (!email) {
        return res.status(401).json({
            EM: "Email is missing",
            EC: 401,
            DT: [],
        });
    }

    try {
        // Kiểm tra xem người dùng đã có trong hệ thống chưa
        const [rows] = await pool.query(
            "SELECT * FROM NGUOIDUNG WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            const user = rows[0];

            // Tạo JWT token với thông tin người dùng
            const token = jwt.sign(
                {
                    manguoidung: user.manguoidung,
                    email: user.email,
                    role: user.role,
                    maquyen: user.maquyen,  // Quyền của người dùng
                    hoten: user.hoten,
                    sodienthoai: user.sodienthoai,
                    diachi: user.diachi,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
                JWT_SECRET,
                { expiresIn: "5h" }
            );

            return res.status(200).json({
                EM: "Login successful",
                EC: 200,
                DT: {
                    accessToken: token,
                    userInfo: user,
                },
            });
        } else {
            // Kiểm tra xem quyền mặc định (maquyen = 0) có tồn tại trong PHANQUYEN không
            const [permissionRows] = await pool.query(
                "SELECT * FROM PHANQUYEN WHERE maquyen = ?",
                [0]
            );

            if (permissionRows.length === 0) {
                // Nếu không có quyền mặc định, tạo quyền mặc định
                await pool.query(
                    "INSERT INTO PHANQUYEN (maquyen, tenquyen) VALUES (?, ?)",
                    [0, 'Quyền mặc định']
                );
            }

            // Người dùng mới, tạo tài khoản với quyền mặc định (maquyen = 0)
            const [insertResult] = await pool.query(
                `INSERT INTO NGUOIDUNG 
                    (email, hoten, maquyen, created_at, updated_at)
                 VALUES (?, ?, ?, NOW(), NOW())`,
                [email, hoten, 0]  // maQuyen = 0 là quyền mặc định
            );

            // Lấy lại thông tin người dùng mới đã tạo
            const [newUserRows] = await pool.query(
                "SELECT * FROM NGUOIDUNG WHERE email = ?",
                [email]
            );
            const user = newUserRows[0];

            // Tạo JWT token cho người dùng mới
            const token = jwt.sign(
                {
                    manguoidung: user.manguoidung,
                    email: user.email,
                    maquyen: user.maquyen,  // Quyền của người dùng
                    hoten: user.hoten,
                    sodienthoai: user.sodienthoai,
                    diachi: user.diachi,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
                JWT_SECRET,
                { expiresIn: "5h" }
            );

            return res.status(200).json({
                EM: "New user created and logged in successfully",
                EC: 200,
                DT: {
                    accessToken: token,
                    userInfo: user,
                },
            });
        }
    } catch (error) {
        console.error("Error in loginUserGoogle:", error);
        return res.status(500).json({
            EM: `Error: ${error.message}`,
            EC: 500,
            DT: [],
        });
    }
};


// ---------------------------------------------- updateUserById
const updateUserById_Admin = async (req, res) => {
    const {
        manguoidung,
        email,
        password,
        hoten,
        sodienthoai,
        diachi,
        role,
        updated_at
    } = req.body;

    // Kiểm tra xem có đủ ID người dùng để cập nhật hay không
    if (!manguoidung) {
        return res.status(400).json({
            EM: "manguoidung is missing",
            EC: 0,
            DT: [],
        });
    }

    try {
        // Cập nhật thông tin người dùng trong database
        const [result] = await pool.query(
            `UPDATE NGUOIDUNG
                SET email = ?,
                password = ?,
                hoten = ?,
                sodienthoai = ?,
                diachi = ?,
                role = ?,
                updated_at = ?
            WHERE manguoidung = ?`,
            [
                email,
                password,
                hoten,
                sodienthoai,
                diachi,
                role,
                updated_at,
                manguoidung
            ]
        );

        // Kiểm tra kết quả cập nhật
        if (result.affectedRows === 0) {
            return res.status(404).json({
                EM: "User not found",
                EC: 0,
                DT: [],
            });
        }

        return res.status(200).json({
            EM: "Cập nhật thông tin người dùng thành công",
            EC: 1,
            DT: { manguoidung },
        });
    } catch (error) {
        console.error("Error in updateUserById:", error);
        return res.status(500).json({
            EM: `Error: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const updateUserById_User = async (req, res) => {
    const {
        email,
        hoten,
        sodienthoai,
        diachi,
        role,
        updated_at
    } = req.body;

    const { manguoidung } = req.params;

    // Kiểm tra xem ID người dùng có hợp lệ không
    if (!manguoidung) {
        return res.status(400).json({
            EM: "ID người dùng bị thiếu",
            EC: 0,
            DT: [],
        });
    }

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const [existingUser] = await pool.execute(
            "SELECT * FROM NGUOIDUNG WHERE manguoidung = ?",
            [manguoidung]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                EM: "Không tìm thấy người dùng",
                EC: 0,
                DT: [],
            });
        }

        // Cập nhật các trường không phải null
        let updateFields = [];
        let updateValues = [];
        if (diachi !== undefined && diachi !== null && diachi !== "") {
            updateFields.push("diachi = ?");
            updateValues.push(diachi);
        }

        if (email !== undefined && email !== null && email !== "") {
            updateFields.push("email = ?");
            updateValues.push(email);
        }
        if (hoten !== undefined && hoten !== null && hoten !== "") {
            updateFields.push("hoten = ?");
            updateValues.push(hoten);
        }
        if (role !== undefined && role !== null && role !== "") {
            updateFields.push("role = ?");
            updateValues.push(role);
        }
        if (
            sodienthoai !== undefined &&
            sodienthoai !== null &&
            sodienthoai !== ""
        ) {
            updateFields.push("sodienthoai = ?");
            updateValues.push(sodienthoai);
        }

        // Thêm trường ngày cập nhật
        const ngayCapNhat = new Date();
        updateFields.push("updated_at = ?");
        updateValues.push(ngayCapNhat);

        // Nếu không có gì cần cập nhật, trả về lỗi
        if (updateFields.length === 0) {
            return res.status(400).json({
                EM: "Không có thông tin cần cập nhật",
                EC: 0,
                DT: [],
            });
        }

        // Cập nhật thông tin người dùng
        const updateQuery =
            `
                UPDATE NGUOIDUNG 
                SET ${updateFields.join(", ")}
                WHERE manguoidung = ?
            `;

        // Thêm ID người dùng vào cuối giá trị để xác định người dùng cần cập nhật
        updateValues.push(manguoidung);

        const [updateResult] = await pool.execute(updateQuery, updateValues);

        if (updateResult.affectedRows > 0) {
            // Lấy lại thông tin mới nhất của người dùng sau khi cập nhật
            const [updatedUser] = await pool.execute(
                "SELECT * FROM NGUOIDUNG WHERE manguoidung = ?",
                [manguoidung]
            );
            const user = updatedUser[0];
            const token = jwt.sign(
                {
                    manguoidung: user.manguoidung,
                    email: user.email,
                    role: user.role,
                    hoten: user.hoten,
                    sodienthoai: user.sodienthoai,
                    diachi: user.diachi,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                },
                JWT_SECRET,
                { expiresIn: "5h" }
            );
            return res.status(200).json({
                EM: "Cập nhật thông tin thành công",
                EC: 1,
                DT: updatedUser[0],
                accessToken: token,
            });
        } else {
            return res.status(400).json({
                EM: "Cập nhật không thành công",
                EC: 0,
                DT: [],
            });
        }
    } catch (error) {
        console.error("Lỗi trong updateUserById_User:", error);
        return res.status(500).json({
            EM: `Lỗi hệ thống: ${error.message}`,
            EC: -1,
            DT: [],
        });
    }
};

const verifyAdmin = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({
            EM: "Token is missing",
            EC: 401,
            DT: { isAdmin: false },
        });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, JWT_SECRET);
        const manguoidung = decoded.manguoidung;
        // Truy vấn để lấy thông tin user từ database
        const [rows] = await pool.query(
            "SELECT role FROM NGUOIDUNG WHERE manguoidung = ?",
            [manguoidung]
        );

        if (rows.length > 0) {
            const user = rows[0];

            // Kiểm tra vai trò của người dùng
            if (user.role == "1") {
                return res.status(200).json({
                    EM: "User is admin",
                    EC: 200,
                    DT: { isAdmin: true }, // Người dùng là admin
                });
            } else {
                return res.status(403).json({
                    EM: "User is not admin",
                    EC: 403,
                    DT: { isAdmin: false }, // Người dùng không phải admin
                });
            }
        } else {
            return res.status(404).json({
                EM: "User not found",
                EC: 404,
                DT: { isAdmin: false }, // Người dùng không tìm thấy
            });
        }
    } catch (error) {
        console.error("Error decoding token or querying database:", error);
        return res.status(401).json({
            EM: `Invalid token: ${error.message}`, // Thông báo lỗi token không hợp lệ
            EC: 401,
            DT: { isAdmin: false }, // Token không hợp lệ, trả về false
        });
    }
};

const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Tạo OTP và thời gian hết hạn
    const otp = crypto.randomInt(100000, 999999);
    const expiresAt = Date.now() + 1 * 60 * 1000; // 1 phút

    // Lưu OTP
    otpStorage.set(email, { otp, expiresAt });
    console.log("to email: ", email);
    console.log("to email: ", otp);
    // Gửi email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_OTP,
            pass: process.env.PASSWORD_OTP,
        },
    });

    const mailOptions = {
        from: "nhnhan2102@gmail.com",
        to: email,
        subject: "PHONESHOP - Your OTP Code",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; padding: 10px 0;">
          <h1 style="color: #007BFF; margin-bottom: 5px;">PHONESHOP</h1>
          <p style="font-size: 16px; color: #555;">Your Trusted Shoe Store</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #007BFF;">Your OTP Code</h2>
          <p style="font-size: 18px; margin: 10px 0; font-weight: bold; color: #000;">${otp}</p>
          <p style="font-size: 14px; color: #555;">This code will expire in <strong>1 minutes</strong>.</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>If you did not request this code, please ignore this email.</p>
          <p style="margin-top: 10px;">&copy; 2024 PhucShoe2. All rights reserved.</p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            EM: "Gửi OTP thành công",
            EC: 1,
            DT: [],
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Gửi OTP thất bại",
            EC: -1,
            DT: [],
        });
    }
};

const checkOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Kiểm tra OTP có tồn tại trong bộ nhớ
    const storedOtp = otpStorage.get(email);

    if (!storedOtp) {
        return res.status(400).json({
            EM: "OTP không tồn tại hoặc đã hết hạn",
            EC: -1,
            DT: [],
        });
    }

    // Kiểm tra thời gian hết hạn của OTP
    const currentTime = Date.now();
    if (currentTime > storedOtp.expiresAt) {
        otpStorage.delete(email); // Xóa OTP đã hết hạn
        return res.status(400).json({
            EM: "OTP đã hết hạn",
            EC: -1,
            DT: [],
        });
    }

    // Kiểm tra OTP có đúng không
    if (parseInt(otp) === storedOtp.otp) {
        return res.status(200).json({
            EM: "OTP hợp lệ",
            EC: 1,
            DT: [],
        });
    } else {
        return res.status(400).json({
            EM: "OTP không đúng",
            EC: -1,
            DT: [],
        });
    }
};

const updatePasswordUser = async (req, res) => {
    const { email, newPassword } = req.body;
    console.log("re", req.body);
    if (!email || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật vào database
    const result = await pool.query(
        "UPDATE NGUOIDUNG SET password = ? WHERE email = ?",
        [hashedPassword, email]
    );

    if (result[0].affectedRows > 0) {
        return res.status(200).json({
            EM: "Cập nhật mật khẩu thành công",
            EC: 1,
            DT: [],
        });
    } else {
        return res.status(500).json({
            EM: "Cập nhật mật khẩu thất bại",
            EC: 0,
            DT: [],
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    loginUserGoogle,
    verifyAdmin,
    logoutUser,
    updateUserById_Admin,
    getAllUser_Admin,
    getUser_ById,
    updateUserById_User,
    updatePasswordUser,
    sendOtp,
    checkOtp,
};
