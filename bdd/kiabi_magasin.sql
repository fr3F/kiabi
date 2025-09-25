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
-- Table structure for table `magasin`
--

DROP TABLE IF EXISTS `magasin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `magasin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nommagasin` varchar(45) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `minicentrale` varchar(45) DEFAULT NULL,
  `nummagasin` varchar(45) DEFAULT NULL,
  `depotstockage` varchar(35) DEFAULT NULL,
  `depotlivraison` varchar(35) DEFAULT NULL,
  `souche` int DEFAULT NULL,
  `lastnumfact` varchar(35) DEFAULT NULL,
  `numdepot` int DEFAULT NULL,
  `lastnumreglement` varchar(35) DEFAULT NULL,
  `identifiant` varchar(45) DEFAULT NULL,
  `dateModification` datetime DEFAULT NULL,
  `gifi` tinyint(1) DEFAULT NULL,
  `dateDernierAppro` datetime DEFAULT NULL,
  `telephone` varchar(45) DEFAULT NULL,
  `facebook` varchar(45) DEFAULT NULL,
  `siteweb` varchar(45) DEFAULT NULL,
  `horaireouvrable` text,
  `horaireweek` varchar(45) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `nbChiffreNumFacture` int NOT NULL DEFAULT '6',
  `devise` varchar(15) DEFAULT NULL,
  `monnaies` text,
  `clotureCaisse` tinyint(1) DEFAULT '0',
  `storeCode` varchar(3) DEFAULT NULL,
  `brn` varchar(45) DEFAULT NULL,
  `vat` varchar(45) DEFAULT NULL,
  `instagram` varchar(45) DEFAULT NULL,
  `nomBase` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `magasin`
--

LOCK TABLES `magasin` WRITE;
/*!40000 ALTER TABLE `magasin` DISABLE KEYS */;
/*!40000 ALTER TABLE `magasin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:41
