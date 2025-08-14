const express = require("express");
const multer = require("multer");
const fileService = require("../service/fileService");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Sử dụng uuid để tạo GUID

const router = express.Router();
// Cấu hình Multer
const storage = multer.memoryStorage(); // Sử dụng bộ nhớ tạm để lưu file trước khi xử lý
const upload = multer({ storage: storage });

// Kiểm tra các thuộc tính đầu vào
const validateRequest = (req, res, next) => {
    const { folderPath, makhachhang } = req.body;
    const file = req.file || req.files;

    if (!folderPath) {
        return res.status(400).json({ error: "folderPath is missing or empty" });
    }

    // if (!makhachhang) {
    //   return res.status(400).json({ error: 'makhachhang is missing or empty' });
    // }

    if (!file || file.length === 0) {
        return res.status(400).json({ error: "file is missing or empty" });
    }

    next(); // Nếu tất cả đều hợp lệ, tiếp tục tới xử lý tiếp theo
};

// Upload file đơn với kiểm tra đầu vào
router.post(
    "/uploadSingleFile",
    upload.single("file"),
    validateRequest,
    async (req, res) => {
        try {
            const { folderPath, imgName } = req.body;

            const result = await fileService.uploadSingleFile(
                req.file,
                folderPath,
                imgName
            );

            res.status(200).json({
                status: true,
                fileName: result.fileName,
                folderPath,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// Upload nhiều file với kiểm tra đầu vào
// Route upload nhiều file
router.post(
    "/uploadMultipleFiles",
    upload.array("files", 10), // Tối đa 10 file
    (req, res, next) => {
        const { folderPath, makhachhang } = req.body;
        const files = req.files;

        if (!folderPath) {
            return res.status(400).json({ error: "folderPath is missing or empty" });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "files are missing or empty" });
        }

        next();
    },
    async (req, res) => {
        try {
            const { folderPath } = req.body;

            // Duyệt từng file và upload
            const results = [];
            for (const file of req.files) {
                const result = await fileService.uploadSingleFile(
                    file,
                    folderPath,
                    file.originalname // Có thể thay bằng uuidv4() + ext nếu muốn tên duy nhất
                );
                results.push({
                    fileName: result.fileName,
                    folderPath,
                });
            }

            res.status(200).json({
                status: true,
                uploadedFiles: results,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

module.exports = router;
