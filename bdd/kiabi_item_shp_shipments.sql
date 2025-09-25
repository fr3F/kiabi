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
-- Table structure for table `item_shp_shipments`
--

DROP TABLE IF EXISTS `item_shp_shipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_shp_shipments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lineLevel` varchar(1) NOT NULL,
  `boxNumber` varchar(13) NOT NULL,
  `cartonNumber` varchar(13) NOT NULL,
  `itemCode` varchar(13) NOT NULL,
  `eanCode` varchar(13) NOT NULL,
  `expectedQty` int NOT NULL,
  `purchasePrice` double(9,2) NOT NULL,
  `purchasePriceCurrencyCode` varchar(3) NOT NULL,
  `tarifCode1` int NOT NULL,
  `tarifCode2` int DEFAULT NULL,
  `tarifCode3` int DEFAULT NULL,
  `tarifCode4` int DEFAULT NULL,
  `tarifCode5` int DEFAULT NULL,
  `tarifCode6` int DEFAULT NULL,
  `tarifCode7` int DEFAULT NULL,
  `tarifCode8` int DEFAULT NULL,
  `tarifCode9` int DEFAULT NULL,
  `countryOriginCode` varchar(3) NOT NULL,
  `receivedQty` int DEFAULT '0',
  `ecart` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `idShipment` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idShipment` (`idShipment`),
  CONSTRAINT `item_shp_shipments_ibfk_1` FOREIGN KEY (`idShipment`) REFERENCES `shp_shipments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_shp_shipments`
--

LOCK TABLES `item_shp_shipments` WRITE;
/*!40000 ALTER TABLE `item_shp_shipments` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_shp_shipments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:47
