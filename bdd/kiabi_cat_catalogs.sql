-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: kiabi
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cat_catalogs`
--

DROP TABLE IF EXISTS `cat_catalogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_catalogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `statusFlag` varchar(1) NOT NULL,
  `styleCode` varchar(5) NOT NULL,
  `theme` varchar(10) NOT NULL,
  `collection` varchar(8) NOT NULL,
  `collectionDescription` varchar(40) NOT NULL,
  `countryOriginCode` varchar(2) NOT NULL,
  `itemCode` varchar(13) NOT NULL,
  `eanCode` varchar(13) NOT NULL,
  `color` varchar(20) NOT NULL,
  `colorDescription` varchar(10) NOT NULL,
  `colorBasicDescription` varchar(40) NOT NULL,
  `size` varchar(7) NOT NULL,
  `sizeDescription` varchar(7) NOT NULL,
  `categoryCode` varchar(10) NOT NULL,
  `categoryDescription` varchar(30) NOT NULL,
  `storyCode` varchar(10) NOT NULL,
  `storyDescription` varchar(30) NOT NULL,
  `productTypeCode` varchar(10) NOT NULL,
  `productTypeDescription` varchar(30) NOT NULL,
  `initSellingPrice` double(9,2) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `gammeTailleMin` varchar(7) DEFAULT NULL,
  `gammeTailleMax` varchar(7) DEFAULT NULL,
  `detailedProductDescription` varchar(51) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `eanCode` (`eanCode`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_catalogs`
--

LOCK TABLES `cat_catalogs` WRITE;
/*!40000 ALTER TABLE `cat_catalogs` DISABLE KEYS */;
INSERT INTO `cat_catalogs` VALUES (1,'M','AJE85','WLINGST','ETE 25','ETE 25','CN','3616036787562','3616036787562','MARON BURL','MARRON','MARRON','XS','XS','ALL','ALL','WALL_HOM_1','WALL HOM J','SOUSVETS','SOUS-VETEMENTS',61990.00,'MGA','XS','XXL','BRASSIERE SPORT','2025-05-26 16:35:27','2025-05-26 16:35:27'),(2,'M','AJE85','WLINGST','ETE 25','ETE 25','CN','3616036463275','3616036463275','MARON BURL','MARRON','MARRON','L','L','ALL','ALL','WALL_HOM_1','WALL HOM J','SOUSVETS','SOUS-VETEMENTS',61990.00,'MGA','XS','XXL','BRASSIERE SPORT','2025-05-26 16:35:27','2025-05-26 16:35:27'),(3,'M','AJE85','WLINGST','ETE 25','ETE 25','CN','3616035761532','3616035761532','MARON BURL','MARRON','MARRON','XXL','XXL','ALL','ALL','WALL_HOM_1','WALL HOM J','SOUSVETS','SOUS-VETEMENTS',61990.00,'MGA','XS','XXL','BRASSIERE SPORT','2025-05-26 16:35:27','2025-05-26 16:35:27'),(4,'M','AJE85','WLINGST','ETE 25','ETE 25','CN','3616035116059','3616035116059','MARON BURL','MARRON','MARRON','M','M','ALL','ALL','WALL_HOM_1','WALL HOM J','SOUSVETS','SOUS-VETEMENTS',61990.00,'MGA','XS','XXL','BRASSIERE SPORT','2025-05-26 16:35:27','2025-05-26 16:35:27'),(5,'M','AJE85','WLINGST','ETE 25','ETE 25','CN','3616031193092','3616031193092','MARON BURL','MARRON','MARRON','XL','XL','ALL','ALL','WALL_HOM_1','WALL HOM J','SOUSVETS','SOUS-VETEMENTS',61990.00,'MGA','XS','XXL','BRASSIERE SPORT','2025-05-26 16:35:27','2025-05-26 16:35:27'),(6,'M','AJE85','WLINGST','HIVER 24','HIVER 24','CN','3616039999986','3616039999986','VL_GREY','GRIS','GRIS','XS','XS','ALL','ALL','WALL_HOM_1','WALL HOM J','SOUSVETS','SOUS-VETEMENTS',61990.00,'MGA','XS','XXL','BRASSIERE SPORT','2025-05-26 16:35:27','2025-05-26 16:35:27');
/*!40000 ALTER TABLE `cat_catalogs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:52
