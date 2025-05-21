// multerConfig.js

const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path"); // Ensure appRoot is correctly set in your environment

// Disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/images/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Image file filter function
// const imageFilter = function (req, file, cb) {
//   if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//     req.fileValidationError = "Only image files are allowed!";
//     return cb(new Error("Only image files are allowed!"), false);
//   }
//   cb(null, true);
// };

// // Export configured multer instance
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 100 * 1024 * 1024, // Cho phép mỗi trường dữ liệu tối đa 100MB
//   },
//   fileFilter: imageFilter,
// });  // 'hinhanh' là tên field trong form, cho phép upload tối đa 5 file

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Giới hạn kích thước tệp (10MB)
  fileFilter: (req, file, cb) => {
    // if (!file.mimetype.match(/^image\/(jpeg|png|jpg|gif)$/)) {
    //   return cb(new Error('Chỉ cho phép tải lên hình ảnh!'));
    // }
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ cho phép tải lên hình ảnh!"));
    }
    cb(null, true);
  },
});

const multipleUpload = upload.fields([
  { name: 'hinhanh', maxCount: 5 },             // ảnh chính (nhiều)
  { name: 'hinhanhchitiet', maxCount: 50 },     // ảnh chi tiết (mỗi cái 1 ảnh nhưng gửi thành danh sách)
]);

module.exports = multipleUpload;
