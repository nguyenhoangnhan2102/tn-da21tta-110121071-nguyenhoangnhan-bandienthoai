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
  `machitietdonhang` int(11) NOT NULL AUTO_INCREMENT,
  `madonhang` int(11) DEFAULT NULL,
  `machitiet` int(11) DEFAULT NULL,
  `soluongSP` int(11) DEFAULT NULL,
  `giaSP` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`machitietdonhang`),
  KEY `madonhang` (`madonhang`),
  KEY `machitiet` (`machitiet`),
  CONSTRAINT `CHITIETDONHANG_ibfk_1` FOREIGN KEY (`madonhang`) REFERENCES `DONHANG` (`madonhang`),
  CONSTRAINT `CHITIETDONHANG_ibfk_2` FOREIGN KEY (`machitiet`) REFERENCES `CHITIETSANPHAM` (`machitiet`)
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
  `machitietgiohang` int(11) NOT NULL AUTO_INCREMENT,
  `magiohang` int(11) DEFAULT NULL,
  `machitiet` int(11) DEFAULT NULL,
  `soluong` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`machitietgiohang`),
  KEY `magiohang` (`magiohang`),
  KEY `machitiet` (`machitiet`),
  CONSTRAINT `CHITIETGIOHANG_ibfk_1` FOREIGN KEY (`magiohang`) REFERENCES `GIOHANG` (`magiohang`),
  CONSTRAINT `CHITIETGIOHANG_ibfk_2` FOREIGN KEY (`machitiet`) REFERENCES `CHITIETSANPHAM` (`machitiet`)
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
-- Table structure for table `CHITIETSANPHAM`
--

DROP TABLE IF EXISTS `CHITIETSANPHAM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CHITIETSANPHAM` (
  `machitiet` int(11) NOT NULL AUTO_INCREMENT,
  `masanpham` int(11) DEFAULT NULL,
  `mamau` int(11) DEFAULT NULL,
  `madungluong` int(11) DEFAULT NULL,
  `soluong` int(11) DEFAULT NULL,
  `trangthai` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`machitiet`),
  KEY `masanpham` (`masanpham`),
  KEY `mamau` (`mamau`),
  KEY `madungluong` (`madungluong`),
  CONSTRAINT `CHITIETSANPHAM_ibfk_1` FOREIGN KEY (`masanpham`) REFERENCES `SANPHAM` (`masanpham`),
  CONSTRAINT `CHITIETSANPHAM_ibfk_2` FOREIGN KEY (`mamau`) REFERENCES `MAU` (`mamau`),
  CONSTRAINT `CHITIETSANPHAM_ibfk_3` FOREIGN KEY (`madungluong`) REFERENCES `DUNGLUONG` (`madungluong`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CHITIETSANPHAM`
--

LOCK TABLES `CHITIETSANPHAM` WRITE;
/*!40000 ALTER TABLE `CHITIETSANPHAM` DISABLE KEYS */;
/*!40000 ALTER TABLE `CHITIETSANPHAM` ENABLE KEYS */;
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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  `tongtien` decimal(18,2) DEFAULT NULL,
  `diachigiaohang` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trangthaidonhang` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
-- Table structure for table `DUNGLUONG`
--

DROP TABLE IF EXISTS `DUNGLUONG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DUNGLUONG` (
  `madungluong` int(11) NOT NULL AUTO_INCREMENT,
  `dungluong` varchar(50) DEFAULT NULL,
  `trangthaidungluong` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`madungluong`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DUNGLUONG`
--

LOCK TABLES `DUNGLUONG` WRITE;
/*!40000 ALTER TABLE `DUNGLUONG` DISABLE KEYS */;
/*!40000 ALTER TABLE `DUNGLUONG` ENABLE KEYS */;
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
-- Table structure for table `MAU`
--

DROP TABLE IF EXISTS `MAU`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `MAU` (
  `mamau` int(11) NOT NULL AUTO_INCREMENT,
  `tenmau` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trangthaimau` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`mamau`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MAU`
--

LOCK TABLES `MAU` WRITE;
/*!40000 ALTER TABLE `MAU` DISABLE KEYS */;
INSERT INTO `MAU` VALUES
(1,'Đen',0,'2025-05-07 16:38:28','2025-05-07 16:38:28'),
(2,'Xanh',0,'2025-05-07 16:38:32','2025-05-07 16:38:32'),
(3,'Trắng',0,'2025-05-07 16:41:18','2025-05-07 16:41:18'),
(4,'Xanh',0,'2025-05-07 16:41:25','2025-05-07 16:41:25');
/*!40000 ALTER TABLE `MAU` ENABLE KEYS */;
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
  `sodienthoai` varchar(20) DEFAULT NULL,
  `diachi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `role` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`manguoidung`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NGUOIDUNG`
--

LOCK TABLES `NGUOIDUNG` WRITE;
/*!40000 ALTER TABLE `NGUOIDUNG` DISABLE KEYS */;
INSERT INTO `NGUOIDUNG` VALUES
(1,'Nhân Nguyễn Hoàng','duonglotan@gmail.com',NULL,NULL,NULL,1,'2025-05-07 16:36:39','2025-05-07 16:36:56');
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
  `gia` decimal(18,2) DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `hedieuhanh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ram` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gpu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cameratruoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `camerasau` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `congnghemanhinh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dophangiaimanhinh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mota` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trangthai` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  `phuongthuc` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trangthai` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  `tenthuonghieu` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trangthaithuonghieu` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`mathuonghieu`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `THUONGHIEU`
--

LOCK TABLES `THUONGHIEU` WRITE;
/*!40000 ALTER TABLE `THUONGHIEU` DISABLE KEYS */;
INSERT INTO `THUONGHIEU` VALUES
(1,'Samsung',0,'2025-05-07 16:37:14','2025-05-07 16:37:14'),
(2,'Xiaomi',0,'2025-05-07 16:37:21','2025-05-07 16:37:21'),
(3,'realme',0,'2025-05-07 16:37:25','2025-05-07 16:37:25'),
(4,'iPhone',0,'2025-05-07 16:37:36','2025-05-07 16:38:08');
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

-- Dump completed on 2025-05-07 23:51:53
