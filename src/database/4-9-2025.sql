CREATE DATABASE phoneshop;
USE phoneshop;

CREATE TABLE NGUOIDUNG (
    manguoidung INT AUTO_INCREMENT PRIMARY KEY,
    hoten VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    sodienthoai VARCHAR(10),    
    diachi TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    trangthai TINYINT DEFAULT 0,
    role INT DEFAULT 0,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngaycapnhat DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE NGUOIDUNG
-- ADD COLUMN ngaycapnhat DATETIME DEFAULT CURRENT_TIMESTAMP AFTER ngaytao;

CREATE TABLE THUONGHIEU (
    mathuonghieu INT AUTO_INCREMENT PRIMARY KEY,
    tenthuonghieu VARCHAR(100) NOT NULL,
    trangthaithuonghieu TINYINT DEFAULT 0,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngaycapnhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE SANPHAM (
    masanpham INT AUTO_INCREMENT PRIMARY KEY,
    mathuonghieu INT,
    tensanpham VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    hinhanh VARCHAR(255), -- Ảnh chính sản phẩm
    mau VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    dungluong VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    ram VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    hedieuhanh VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    soluong INT DEFAULT 0,
    gianhap DECIMAL(15, 2)  DEFAULT 0,
    giaban DECIMAL(15, 2) DEFAULT 0,
    khuyenmai INT DEFAULT 0,
    cpu VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    gpu VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    pin VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    cameratruoc VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	camerasau VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	congnghemanhinh VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	dophangiaimanhinh VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    mota TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    trangthai TINYINT DEFAULT 0,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngaycapnhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mathuonghieu) REFERENCES THUONGHIEU(mathuonghieu)
);

CREATE TABLE DONHANG (
    madonhang INT AUTO_INCREMENT PRIMARY KEY,
    manguoidung INT,
    thoigiandat DATETIME,
    tongtien DECIMAL(18, 2),
    ghichu TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    diachigiaohang TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    hotenkhachhang VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    sodienthoaikhachhang VARCHAR(15),
    trangthai ENUM('choxacnhan', 'danggiao', 'hoanthanh', 'huy', 'hoantien') DEFAULT 'choxacnhan',
    lydohuy TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngaycapnhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manguoidung) REFERENCES NGUOIDUNG(manguoidung)
);

CREATE TABLE CHITIETDONHANG (
    madonhang INT,
    masanpham  INT,
    tensanpham VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
    mau VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,       
    dungluong VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
    ram VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    hinhanh VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    soluong INT,
    dongia DECIMAL(15,2),
    PRIMARY KEY (madonhang, masanpham),
    FOREIGN KEY (madonhang) REFERENCES DONHANG(madonhang),
    FOREIGN KEY (masanpham) REFERENCES SANPHAM(masanpham)
);

-- ALTER TABLE CHITIETDONHANG
-- ADD COLUMN hinhanh VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci AFTER ram;
-- ADD COLUMN mau VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci AFTER tensanpham,
-- ADD COLUMN dungluong VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci AFTER mau,
-- ADD COLUMN ram VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci AFTER dungluong;


CREATE TABLE GIOHANG (
    magiohang INT AUTO_INCREMENT PRIMARY KEY,
    manguoidung INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manguoidung) REFERENCES NGUOIDUNG(manguoidung)
);

CREATE TABLE CHITIETGIOHANG (
    magiohang INT,
    masanpham INT,
    soluong INT DEFAULT 1,
    PRIMARY KEY (magiohang, masanpham),
    FOREIGN KEY (magiohang) REFERENCES GIOHANG(magiohang),
    FOREIGN KEY (masanpham) REFERENCES SANPHAM(masanpham)
);

CREATE TABLE THANHTOAN (
    mathanhtoan INT AUTO_INCREMENT PRIMARY KEY,
    madonhang INT,
    hinhthucthanhtoan ENUM('home', 'vnpay', 'momo', 'paypal', 'online') DEFAULT 'home',
    trangthai ENUM('chuathanhtoan', 'dathanhtoan') DEFAULT 'chuathanhtoan',
    ngaythanhtoan DATETIME,
    FOREIGN KEY (madonhang) REFERENCES DONHANG(madonhang)
);

CREATE TABLE DANHGIA (
    madanhgia INT AUTO_INCREMENT PRIMARY KEY,
    manguoidung INT,
    masanpham INT,
    sao INT CHECK (sao BETWEEN 1 AND 5),
    binhluan TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    trangthai INT DEFAULT 0,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manguoidung) REFERENCES NGUOIDUNG(manguoidung),
    FOREIGN KEY (masanpham) REFERENCES SANPHAM(masanpham)
);

