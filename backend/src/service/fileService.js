const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Sử dụng uuid để tạo GUID

// Hàm kiểm tra và tạo folder nếu chưa tồn tại
const checkAndCreateFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Hàm xóa folder nếu tồn tại
const deleteFileIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Xóa file nếu tồn tại
    }
};

const uploadSingleFile = (file, folderPath, imgName) => {
    let newFileName;

    // Nếu có imgName thì giữ lại ảnh cũ, đồng thời tạo ảnh mới với tên UUID
    if (!imgName || imgName.trim() === "") {
        // Nếu không có imgName (ảnh mới hoàn toàn)
        newFileName = uuidv4() + path.extname(file.originalname);
    } else {
        // Nếu có ảnh cũ -> vẫn tạo ảnh mới (không xóa ảnh cũ nữa)
        newFileName = uuidv4() + path.extname(file.originalname);
    }

    return new Promise((resolve, reject) => {
        const newFullFolderPath = path.join(__dirname, "../../public", folderPath);

        checkAndCreateFolder(newFullFolderPath);

        const filePath = path.join(newFullFolderPath, newFileName);

        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    message: "File uploaded successfully!",
                    fileName: newFileName,
                    folderPath,
                });
            }
        });
    });
};

// Hàm xử lý upload nhiều file với GUID
const uploadMultipleFiles = (files, folderPath) => {
    return new Promise((resolve, reject) => {
        // deleteFolderIfExists(folderPath); // Xóa folder cũ nếu tồn tại
        checkAndCreateFolder(folderPath); // Tạo folder mới

        const uploadPromises = files.map((file) => {
            // Tạo tên file mới với GUID
            const newFileName = uuidv4() + path.extname(file.originalname);
            const filePath = path.join(folderPath, newFileName);

            return new Promise((resolve, reject) => {
                fs.writeFile(filePath, file.buffer, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            fileName: newFileName,
                            message: `File ${file.originalname} uploaded successfully!`,
                            folderPath,
                        });
                    }
                });
            });
        });

        // Sử dụng Promise.all để chờ tất cả các file được upload xong
        Promise.all(uploadPromises)
            .then((results) => resolve(results))
            .catch((error) => reject(error));
    });
};

module.exports = { uploadSingleFile, uploadMultipleFiles };
