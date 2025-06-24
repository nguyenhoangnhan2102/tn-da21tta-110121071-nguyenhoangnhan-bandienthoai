// multerConfig.js
// config/multerConfig.js
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot.path, "/src/public/images/"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ cho phép tải hình ảnh!"), false);
    }
    cb(null, true);
  },
});

const uploadMultiple = upload.fields([{ name: "hinhanh" }]);

module.exports = uploadMultiple;

