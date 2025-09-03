/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: phoneshop
-- ------------------------------------------------------
-- Server version	5.7.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `CHITIETDONHANG`
--

DROP TABLE IF EXISTS `CHITIETDONHANG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CHITIETDONHANG` (
  `madonhang` int(11) NOT NULL,
  `masanpham` int(11) NOT NULL,
  `soluong` int(11) DEFAULT NULL,
  `dongia` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`madonhang`,`masanpham`),
  KEY `masanpham` (`masanpham`),
  CONSTRAINT `CHITIETDONHANG_ibfk_1` FOREIGN KEY (`madonhang`) REFERENCES `DONHANG` (`madonhang`),
  CONSTRAINT `CHITIETDONHANG_ibfk_2` FOREIGN KEY (`masanpham`) REFERENCES `SANPHAM` (`masanpham`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CHITIETDONHANG`
--

LOCK TABLES `CHITIETDONHANG` WRITE;
/*!40000 ALTER TABLE `CHITIETDONHANG` DISABLE KEYS */;
/*!40000 ALTER TABLE `CHITIETDONHANG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CHITIETGIOHANG`
--

DROP TABLE IF EXISTS `CHITIETGIOHANG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CHITIETGIOHANG` (
  `magiohang` int(11) NOT NULL,
  `masanpham` int(11) NOT NULL,
  `soluong` int(11) DEFAULT '1',
  PRIMARY KEY (`magiohang`,`masanpham`),
  KEY `masanpham` (`masanpham`),
  CONSTRAINT `CHITIETGIOHANG_ibfk_1` FOREIGN KEY (`magiohang`) REFERENCES `GIOHANG` (`magiohang`),
  CONSTRAINT `CHITIETGIOHANG_ibfk_2` FOREIGN KEY (`masanpham`) REFERENCES `SANPHAM` (`masanpham`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CHITIETGIOHANG`
--

LOCK TABLES `CHITIETGIOHANG` WRITE;
/*!40000 ALTER TABLE `CHITIETGIOHANG` DISABLE KEYS */;
/*!40000 ALTER TABLE `CHITIETGIOHANG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DANHGIA`
--

DROP TABLE IF EXISTS `DANHGIA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DANHGIA` (
  `madanhgia` int(11) NOT NULL AUTO_INCREMENT,
  `manguoidung` int(11) DEFAULT NULL,
  `masanpham` int(11) DEFAULT NULL,
  `sao` int(11) DEFAULT NULL,
  `binhluan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trangthai` int(11) DEFAULT '0',
  `ngaytao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`madanhgia`),
  KEY `manguoidung` (`manguoidung`),
  KEY `masanpham` (`masanpham`),
  CONSTRAINT `DANHGIA_ibfk_1` FOREIGN KEY (`manguoidung`) REFERENCES `NGUOIDUNG` (`manguoidung`),
  CONSTRAINT `DANHGIA_ibfk_2` FOREIGN KEY (`masanpham`) REFERENCES `SANPHAM` (`masanpham`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DANHGIA`
--

LOCK TABLES `DANHGIA` WRITE;
/*!40000 ALTER TABLE `DANHGIA` DISABLE KEYS */;
/*!40000 ALTER TABLE `DANHGIA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DONHANG`
--

DROP TABLE IF EXISTS `DONHANG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DONHANG` (
  `madonhang` int(11) NOT NULL AUTO_INCREMENT,
  `manguoidung` int(11) DEFAULT NULL,
  `thoigiandat` datetime DEFAULT NULL,
  `tongtien` decimal(18,2) DEFAULT NULL,
  `ghichu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `diachigiaohang` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trangthai` enum('choxacnhan','danggiao','hoanthanh','huy') DEFAULT 'choxacnhan',
  `ngaytao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngaycapnhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`madonhang`),
  KEY `manguoidung` (`manguoidung`),
  CONSTRAINT `DONHANG_ibfk_1` FOREIGN KEY (`manguoidung`) REFERENCES `NGUOIDUNG` (`manguoidung`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DONHANG`
--

LOCK TABLES `DONHANG` WRITE;
/*!40000 ALTER TABLE `DONHANG` DISABLE KEYS */;
/*!40000 ALTER TABLE `DONHANG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GIOHANG`
--

DROP TABLE IF EXISTS `GIOHANG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `GIOHANG` (
  `magiohang` int(11) NOT NULL AUTO_INCREMENT,
  `manguoidung` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`magiohang`),
  KEY `manguoidung` (`manguoidung`),
  CONSTRAINT `GIOHANG_ibfk_1` FOREIGN KEY (`manguoidung`) REFERENCES `NGUOIDUNG` (`manguoidung`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GIOHANG`
--

LOCK TABLES `GIOHANG` WRITE;
/*!40000 ALTER TABLE `GIOHANG` DISABLE KEYS */;
/*!40000 ALTER TABLE `GIOHANG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NGUOIDUNG`
--

DROP TABLE IF EXISTS `NGUOIDUNG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `NGUOIDUNG` (
  `manguoidung` int(11) NOT NULL AUTO_INCREMENT,
  `hoten` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `sodienthoai` varchar(10) DEFAULT NULL,
  `diachi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trangthai` tinyint(4) DEFAULT '0',
  `role` int(11) DEFAULT '0',
  `ngaytao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`manguoidung`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NGUOIDUNG`
--

LOCK TABLES `NGUOIDUNG` WRITE;
/*!40000 ALTER TABLE `NGUOIDUNG` DISABLE KEYS */;
/*!40000 ALTER TABLE `NGUOIDUNG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SANPHAM`
--

DROP TABLE IF EXISTS `SANPHAM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `SANPHAM` (
  `masanpham` int(11) NOT NULL AUTO_INCREMENT,
  `mathuonghieu` int(11) DEFAULT NULL,
  `tensanpham` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `mau` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dungluong` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ram` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hedieuhanh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soluong` int(11) DEFAULT '0',
  `cpu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gpu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cameratruoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `camerasau` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `congnghemanhinh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dophangiaimanhinh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mota` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trangthai` tinyint(4) DEFAULT '0',
  `ngaytao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngaycapnhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`masanpham`),
  KEY `mathuonghieu` (`mathuonghieu`),
  CONSTRAINT `SANPHAM_ibfk_1` FOREIGN KEY (`mathuonghieu`) REFERENCES `THUONGHIEU` (`mathuonghieu`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SANPHAM`
--

LOCK TABLES `SANPHAM` WRITE;
/*!40000 ALTER TABLE `SANPHAM` DISABLE KEYS */;
/*!40000 ALTER TABLE `SANPHAM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `THANHTOAN`
--

DROP TABLE IF EXISTS `THANHTOAN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `THANHTOAN` (
  `mathanhtoan` int(11) NOT NULL AUTO_INCREMENT,
  `madonhang` int(11) DEFAULT NULL,
  `hinhthucthanhtoan` enum('home','vnpay','momo','paypal') DEFAULT 'home',
  `trangthai` enum('chuathanhtoan','dathanhtoan') DEFAULT 'chuathanhtoan',
  `ngaythanhtoan` datetime DEFAULT NULL,
  PRIMARY KEY (`mathanhtoan`),
  KEY `madonhang` (`madonhang`),
  CONSTRAINT `THANHTOAN_ibfk_1` FOREIGN KEY (`madonhang`) REFERENCES `DONHANG` (`madonhang`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `THANHTOAN`
--

LOCK TABLES `THANHTOAN` WRITE;
/*!40000 ALTER TABLE `THANHTOAN` DISABLE KEYS */;
/*!40000 ALTER TABLE `THANHTOAN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `THUONGHIEU`
--

DROP TABLE IF EXISTS `THUONGHIEU`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `THUONGHIEU` (
  `mathuonghieu` int(11) NOT NULL AUTO_INCREMENT,
  `tenthuonghieu` varchar(100) NOT NULL,
  `trangthaithuonghieu` tinyint(4) DEFAULT '0',
  `logo` varchar(255) DEFAULT NULL,
  `ngaytao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngaycapnhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`mathuonghieu`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `THUONGHIEU`
--

LOCK TABLES `THUONGHIEU` WRITE;
/*!40000 ALTER TABLE `THUONGHIEU` DISABLE KEYS */;
/*!40000 ALTER TABLE `THUONGHIEU` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'phoneshop'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-06-19 23:58:50
