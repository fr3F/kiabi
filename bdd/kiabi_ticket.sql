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
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `idticket` int NOT NULL AUTO_INCREMENT,
  `datecreation` datetime DEFAULT NULL,
  `nocaisse` varchar(45) DEFAULT NULL,
  `namecaissier` varchar(45) DEFAULT NULL,
  `montanttotal` double DEFAULT NULL,
  `nbarticle` int DEFAULT NULL,
  `montantht` double DEFAULT NULL,
  `montanttva` double DEFAULT NULL,
  `modepaiement` varchar(45) DEFAULT NULL,
  `codeclient` varchar(45) DEFAULT NULL,
  `recu` double DEFAULT NULL,
  `arendre` double DEFAULT NULL,
  `magasin` varchar(45) DEFAULT NULL,
  `numticket` varchar(45) DEFAULT NULL,
  `montantremise` double DEFAULT NULL,
  `numerocheque` varchar(45) DEFAULT NULL,
  `isclos` int DEFAULT NULL,
  `codejournal` varchar(45) DEFAULT NULL,
  `nomodereglement` int DEFAULT NULL,
  `depot` varchar(45) DEFAULT NULL,
  `numeroFacture` varchar(13) DEFAULT NULL,
  `ventedepot` int DEFAULT '0',
  `clientvip` varchar(45) DEFAULT NULL,
  `hash` varchar(50) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `storeCode` varchar(3) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `idencaissement` int DEFAULT NULL,
  PRIMARY KEY (`idticket`),
  KEY `idencaissement` (`idencaissement`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`idencaissement`) REFERENCES `encaissement` (`idencaissement`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:51
