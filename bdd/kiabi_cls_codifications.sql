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
-- Table structure for table `cls_codifications`
--

DROP TABLE IF EXISTS `cls_codifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cls_codifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class` varchar(10) DEFAULT NULL,
  `classDescription` varchar(30) DEFAULT NULL,
  `classLongDescription` varchar(60) DEFAULT NULL,
  `department` varchar(3) DEFAULT NULL,
  `departmentDescription` varchar(10) DEFAULT NULL,
  `departmentLongDescription` varchar(60) DEFAULT NULL,
  `market` varchar(3) DEFAULT NULL,
  `marketDescription` varchar(10) DEFAULT NULL,
  `marketLongDescription` varchar(60) DEFAULT NULL,
  `group` varchar(3) DEFAULT NULL,
  `groupDescription` varchar(10) DEFAULT NULL,
  `groupLongDescription` varchar(60) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `class` (`class`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cls_codifications`
--

LOCK TABLES `cls_codifications` WRITE;
/*!40000 ALTER TABLE `cls_codifications` DISABLE KEYS */;
INSERT INTO `cls_codifications` VALUES (1,'WLINGST','WLINGST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'GRKIDS',NULL,'2025-09-24 12:00:00','2025-09-24 12:00:00');
/*!40000 ALTER TABLE `cls_codifications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:48
