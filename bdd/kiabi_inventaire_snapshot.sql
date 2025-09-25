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
-- Table structure for table `inventaire_snapshot`
--

DROP TABLE IF EXISTS `inventaire_snapshot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventaire_snapshot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idinventaire` int DEFAULT NULL,
  `eanCode` varchar(13) DEFAULT NULL,
  `stock` double DEFAULT NULL,
  `datesnapshot` datetime DEFAULT CURRENT_TIMESTAMP,
  `color` varchar(40) DEFAULT NULL,
  `size` varchar(14) DEFAULT NULL,
  `styleCode` varchar(5) DEFAULT NULL,
  `designation` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_inventaire` (`idinventaire`),
  CONSTRAINT `fk_inventaire` FOREIGN KEY (`idinventaire`) REFERENCES `inventaire` (`idinventaire`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventaire_snapshot`
--

LOCK TABLES `inventaire_snapshot` WRITE;
/*!40000 ALTER TABLE `inventaire_snapshot` DISABLE KEYS */;
INSERT INTO `inventaire_snapshot` VALUES (1,11,'3616036787562',0,'2025-09-25 15:19:43','MARRON','XS','AJE85','SOUS-VETEMENTS'),(2,11,'3616036463275',0,'2025-09-25 15:19:43','MARRON','L','AJE85','SOUS-VETEMENTS'),(3,11,'3616035761532',0,'2025-09-25 15:19:43','MARRON','XXL','AJE85','SOUS-VETEMENTS'),(4,11,'3616035116059',0,'2025-09-25 15:19:43','MARRON','M','AJE85','SOUS-VETEMENTS'),(5,11,'3616031193092',0,'2025-09-25 15:19:43','MARRON','XL','AJE85','SOUS-VETEMENTS'),(6,11,'3616039999986',0,'2025-09-25 15:19:43','GRIS','XS','AJE85','SOUS-VETEMENTS');
/*!40000 ALTER TABLE `inventaire_snapshot` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:40
