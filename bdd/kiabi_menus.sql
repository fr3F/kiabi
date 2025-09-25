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
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `link` varchar(50) DEFAULT NULL,
  `isTitle` tinyint(1) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `isLayout` tinyint(1) DEFAULT NULL,
  `urlBadge` varchar(255) DEFAULT NULL,
  `ordre` int DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `menus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,'Tableau de bord','bx bx-home-circle','/dashboard',NULL,NULL,NULL,NULL,1,NULL),(2,'Utilisateurs','bx bx-user-circle',NULL,NULL,NULL,NULL,NULL,2,NULL),(3,'Liste des utilisateurs',NULL,'/user/user-list',NULL,NULL,NULL,NULL,3,2),(4,'Ajouter un utilisateur',NULL,'/user/user-add',NULL,NULL,NULL,NULL,4,2),(5,'Gestion accès',NULL,'/user/user-access',NULL,NULL,NULL,NULL,5,2),(6,'Data transferts','bx bx-data','/data-transferts',NULL,NULL,NULL,NULL,6,NULL),(7,'Catalogs','bx bx-receipt','/catalogs',NULL,NULL,NULL,NULL,7,NULL),(8,'Shipments','bx bx-archive-in','/shipments',NULL,NULL,NULL,NULL,8,NULL),(9,'Sales','bx bx-cart-alt','/sales',NULL,NULL,NULL,NULL,9,NULL),(10,'Paramétrage','bx bx-cog',NULL,NULL,NULL,NULL,NULL,10,NULL),(11,'Magasin',NULL,'/magasin/list',NULL,NULL,NULL,NULL,11,10),(12,'Mode de paiement',NULL,'/mode-paiement',NULL,NULL,NULL,NULL,12,10),(13,'Carte de fidelité','bx bx-gift',NULL,NULL,NULL,NULL,NULL,14,NULL),(14,'Liste',NULL,'/carte-fidelite/liste',NULL,NULL,NULL,NULL,15,13),(15,'Paramétrage',NULL,'/carte-fidelite/parametrage',NULL,NULL,NULL,NULL,16,13),(16,'Créer',NULL,'/carte-fidelite/ajouter',NULL,NULL,NULL,NULL,17,13),(17,'Clôture','bx bx-list-check',NULL,NULL,NULL,NULL,NULL,17,NULL),(18,'Validation',NULL,'/cloture/validation',NULL,NULL,NULL,NULL,18,17),(19,'Transfert vers sage',NULL,'/cloture/transfert-sage',NULL,NULL,NULL,NULL,19,17),(20,'Paramétrage',NULL,'/cloture/parametrage',NULL,NULL,NULL,NULL,20,17),(21,'Contrôle','bx bx-search-alt-2','/reporting/controle-ticket',NULL,NULL,NULL,NULL,21,NULL),(22,'Consultation','bx bx-search',NULL,NULL,NULL,NULL,NULL,22,NULL),(23,'Caisse',NULL,'/reporting/consultation-caisse',NULL,NULL,NULL,NULL,23,22),(24,'Ticket',NULL,'/reporting/consultation-tickets',NULL,NULL,NULL,NULL,24,22),(25,'Article caisse',NULL,'/reporting/consultation-article-caisse',NULL,NULL,NULL,NULL,25,22),(26,'Inventaire','bx bx-box','/inventaire/listes',NULL,NULL,NULL,NULL,26,NULL);
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:50
