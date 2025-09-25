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
-- Table structure for table `clientvip`
--

DROP TABLE IF EXISTS `clientvip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientvip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numClient` varchar(10) DEFAULT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `code` varchar(3) DEFAULT NULL,
  `ville` varchar(50) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `titre` varchar(30) DEFAULT NULL,
  `adresse2` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dateCreation` date DEFAULT NULL,
  `portable` varchar(30) DEFAULT NULL,
  `dateAnniversaire` date DEFAULT NULL,
  `point` double DEFAULT NULL,
  `dernierAchat` datetime DEFAULT NULL,
  `dateActivation` datetime DEFAULT NULL,
  `dateExpiration` datetime DEFAULT NULL,
  `moisValidation` int DEFAULT NULL,
  `codeClient` varchar(20) DEFAULT NULL,
  `optinSmsKiabi` tinyint(1) DEFAULT NULL,
  `dateOptinSmsKiabi` datetime DEFAULT NULL,
  `dateOptoutSmsKiabi` datetime DEFAULT NULL,
  `optinSmsPartner` tinyint(1) DEFAULT NULL,
  `dateOptinSmsPartner` datetime DEFAULT NULL,
  `dateOptoutSmsPartner` datetime DEFAULT NULL,
  `optinEmailKiabi` tinyint(1) DEFAULT NULL,
  `dateOptinEmailKiabi` datetime DEFAULT NULL,
  `dateOptoutEmailKiabi` datetime DEFAULT NULL,
  `optinEmailPartner` tinyint(1) DEFAULT NULL,
  `dateOptinEmailPartner` datetime DEFAULT NULL,
  `dateOptoutEmailPartner` datetime DEFAULT NULL,
  `storeCode` varchar(3) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `dateModification` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numClient` (`numClient`),
  UNIQUE KEY `codeClient` (`codeClient`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientvip`
--

LOCK TABLES `clientvip` WRITE;
/*!40000 ALTER TABLE `clientvip` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientvip` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:46
