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
-- Temporary view structure for view `v_inventaire`
--

DROP TABLE IF EXISTS `v_inventaire`;
/*!50001 DROP VIEW IF EXISTS `v_inventaire`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_inventaire` AS SELECT 
 1 AS `idinventaire`,
 1 AS `eanCode`,
 1 AS `stock`,
 1 AS `inventaire`,
 1 AS `surplus`,
 1 AS `designation`,
 1 AS `color`,
 1 AS `size`,
 1 AS `styleCode`,
 1 AS `dateinventaire`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_stock`
--

DROP TABLE IF EXISTS `v_stock`;
/*!50001 DROP VIEW IF EXISTS `v_stock`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_stock` AS SELECT 
 1 AS `styleCode`,
 1 AS `eanCode`,
 1 AS `colorBasicDescription`,
 1 AS `sizeDescription`,
 1 AS `productTypeDescription`,
 1 AS `quantiteReceived`,
 1 AS `quantiteVendu`,
 1 AS `stock`,
 1 AS `groupDescription`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_menu_roles`
--

DROP TABLE IF EXISTS `v_menu_roles`;
/*!50001 DROP VIEW IF EXISTS `v_menu_roles`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_menu_roles` AS SELECT 
 1 AS `id`,
 1 AS `label`,
 1 AS `icon`,
 1 AS `link`,
 1 AS `isTitle`,
 1 AS `badge`,
 1 AS `isLayout`,
 1 AS `urlBadge`,
 1 AS `ordre`,
 1 AS `parentId`,
 1 AS `roleId`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_inventaire`
--

/*!50001 DROP VIEW IF EXISTS `v_inventaire`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`admin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_inventaire` AS select `snap`.`idinventaire` AS `idinventaire`,`snap`.`eanCode` AS `eanCode`,`snap`.`stock` AS `stock`,(select count(`inventaire_comptage`.`epc`) AS `inventaire` from `inventaire_comptage` where ((`inventaire_comptage`.`idinventaire` = `i`.`idinventaire`) and (`inventaire_comptage`.`eanCode` = `snap`.`eanCode`))) AS `inventaire`,((select count(`inventaire_comptage`.`epc`) AS `inventaire` from `inventaire_comptage` where ((`inventaire_comptage`.`idinventaire` = `i`.`idinventaire`) and (`inventaire_comptage`.`eanCode` = `snap`.`eanCode`))) - `snap`.`stock`) AS `surplus`,`snap`.`designation` AS `designation`,`snap`.`color` AS `color`,`snap`.`size` AS `size`,`snap`.`styleCode` AS `styleCode`,(select max(`inventaire_comptage`.`datemodification`) AS `inventaire` from `inventaire_comptage` where ((`inventaire_comptage`.`idinventaire` = `i`.`idinventaire`) and (`inventaire_comptage`.`eanCode` = `snap`.`eanCode`))) AS `dateinventaire` from (`inventaire_snapshot` `snap` left join `inventaire` `i` on((`i`.`idinventaire` = `snap`.`idinventaire`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_stock`
--

/*!50001 DROP VIEW IF EXISTS `v_stock`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`admin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_stock` AS select `c`.`styleCode` AS `styleCode`,`c`.`eanCode` AS `eanCode`,`c`.`colorBasicDescription` AS `colorBasicDescription`,`c`.`sizeDescription` AS `sizeDescription`,`c`.`productTypeDescription` AS `productTypeDescription`,coalesce(`s`.`totalReceived`,0) AS `quantiteReceived`,coalesce(`v`.`totalVendu`,0) AS `quantiteVendu`,(coalesce(`s`.`totalReceived`,0) - coalesce(`v`.`totalVendu`,0)) AS `stock`,`cod`.`groupDescription` AS `groupDescription` from (((`cat_catalogs` `c` left join (select `i`.`eanCode` AS `eanCode`,sum(`i`.`receivedQty`) AS `totalReceived` from (`item_shp_shipments` `i` left join `shp_shipments` `s` on((`s`.`id` = `i`.`idShipment`))) where (`s`.`status` = 'RECEPTIONNEE') group by `i`.`eanCode`) `s` on((`c`.`eanCode` = `s`.`eanCode`))) left join (select `ckia001`.`articleticket`.`codeean` AS `codeean`,sum(`ckia001`.`articleticket`.`quantite`) AS `totalVendu` from `ckia001`.`articleticket` group by `ckia001`.`articleticket`.`codeean`) `v` on((`c`.`eanCode` = `v`.`codeean`))) left join `cls_codifications` `cod` on((`cod`.`class` = `c`.`theme`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_menu_roles`
--

/*!50001 DROP VIEW IF EXISTS `v_menu_roles`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_menu_roles` AS select `m`.`id` AS `id`,`m`.`label` AS `label`,`m`.`icon` AS `icon`,`m`.`link` AS `link`,`m`.`isTitle` AS `isTitle`,`m`.`badge` AS `badge`,`m`.`isLayout` AS `isLayout`,`m`.`urlBadge` AS `urlBadge`,`m`.`ordre` AS `ordre`,`m`.`parentId` AS `parentId`,`mr`.`roleId` AS `roleId` from (`menus` `m` join `menu_roles` `mr` on((`m`.`id` = `mr`.`menuId`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 15:43:53
