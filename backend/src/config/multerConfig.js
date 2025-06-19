// // multerConfig.js

// const multer = require("multer");
// const path = require("path");
// const appRoot = require("app-root-path"); // Ensure appRoot is correctly set in your environment

// // Disk storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, appRoot + "/src/public/images/");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 },  // Giới hạn kích thước tệp (10MB)
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Chỉ cho phép tải lên hình ảnh!"));
//     }
//     cb(null, true);
//   },
// });

// const multipleUpload = upload.fields([
//   { name: 'hinhanh', maxCount: 5 }
// ]);

// module.exports = multipleUpload;


const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");

// Cấu hình nơi lưu ảnh và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Lọc file chỉ cho ảnh
const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Chỉ cho phép tải lên hình ảnh!"), false);
  }
  cb(null, true);
};

// Khởi tạo multer chung
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
  fileFilter: imageFilter,
});

// Export các middleware upload linh hoạt
module.exports = {
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount = 10) => upload.array(fieldName, maxCount),
  uploadFields: (fields) => upload.fields(fields), // Ví dụ: [{ name: "avatar" }, { name: "gallery", maxCount: 5 }]
};
