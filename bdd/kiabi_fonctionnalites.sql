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
-- Table structure for table `fonctionnalites`
--

DROP TABLE IF EXISTS `fonctionnalites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fonctionnalites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `moduleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fonctionnalites_module_id_nom` (`moduleId`,`nom`),
  CONSTRAINT `fonctionnalites_ibfk_1` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fonctionnalites`
--

LOCK TABLES `fonctionnalites` WRITE;
/*!40000 ALTER TABLE `fonctionnalites` DISABLE KEYS */;
INSERT INTO `fonctionnalites` VALUES (1,'Créer',NULL,1),(2,'Modifier',NULL,1),(3,'Liste',NULL,1),(4,'Activer/Désactiver',NULL,1),(6,'Modifier mot de passe',NULL,1),(7,'Réinitialiser mot de passe',NULL,1),(8,'Gestion accès',NULL,1),(9,'Voir',NULL,2),(10,'Mettre à jour',NULL,2),(11,'Voir',NULL,3),(12,'Voir',NULL,4),(13,'Réception',NULL,4),(14,'Voir',NULL,5),(15,'Envoyer',NULL,5),(16,'Créer',NULL,6),(17,'Modifier',NULL,6),(18,'Voir',NULL,6),(19,'Créer',NULL,7),(20,'Modifier',NULL,7),(21,'Voir',NULL,8),(22,'Gérer',NULL,8),(23,'Créer',NULL,9),(24,'Modifier',NULL,9),(25,'Voir',NULL,9),(26,'Supprimer',NULL,9),(27,'Exporter',NULL,9),(28,'Gérer carte',NULL,9),(29,'Activer',NULL,9),(30,'Régulariser point',NULL,9),(31,'Envoyer pour KIABI',NULL,9),(34,'Validation',NULL,10),(35,'Transfert vers sage',NULL,10),(36,'Imprimer règlements',NULL,10),(37,'Détail sommaire ticket',NULL,10),(38,'Exporter sommaire ticket',NULL,10),(46,'Voir',NULL,11),(59,'Supprimer encaissement',NULL,10),(62,'Voir caisse',NULL,11),(92,'Synchronisation',NULL,11),(94,'Paramétrer',NULL,10),(99,'Synchronisation caisse',NULL,11),(111,'Synchroniser caisse init',NULL,11),(112,'Charger encaissements',NULL,7),(113,'Liste encaissements',NULL,7),(114,'Consulter caisse',NULL,7),(115,'Consulter l\'article caisse',NULL,7),(116,'Consulter',NULL,12),(117,'Consulter ticket',NULL,7);
/*!40000 ALTER TABLE `fonctionnalites` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:39
