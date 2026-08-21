-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: traffic_management
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `traffic_signals`
--

DROP TABLE IF EXISTS `traffic_signals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traffic_signals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(100) NOT NULL,
  `green_time` int NOT NULL,
  `yellow_time` int NOT NULL,
  `red_time` int NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traffic_signals`
--

LOCK TABLES `traffic_signals` WRITE;
/*!40000 ALTER TABLE `traffic_signals` DISABLE KEYS */;
INSERT INTO `traffic_signals` VALUES (3,'Shivaji Nagar',41,5,35,'ACTIVE','2026-08-06 10:59:06','2026-08-19 09:57:19'),(4,'Test Loc',30,5,30,'INACTIVE','2026-08-11 10:54:35','2026-08-17 07:02:17'),(5,'Test Junction',30,5,30,'INACTIVE','2026-08-11 10:56:53','2026-08-19 09:54:09'),(6,'MG Road Junction',45,5,40,'ACTIVE','2026-08-11 11:34:05','2026-08-11 11:34:05'),(7,'magar patta city',30,5,30,'ACTIVE','2026-08-12 10:54:29','2026-08-12 10:54:29'),(8,'chtr sambhaji chowk',32,5,30,'ACTIVE','2026-08-18 07:40:43','2026-08-18 07:41:19'),(9,'Session Security Blvd',45,5,40,'ACTIVE','2026-08-19 07:22:00','2026-08-19 07:22:00'),(10,'Session Security Blvd',45,5,40,'ACTIVE','2026-08-19 07:22:35','2026-08-19 07:22:35'),(11,'Operator Way & 5th Ave',30,4,25,'ACTIVE','2026-08-19 07:22:35','2026-08-19 07:22:35'),(12,'akurdi chowk',35,5,25,'ACTIVE','2026-08-19 09:53:57','2026-08-19 09:56:59');
/*!40000 ALTER TABLE `traffic_signals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rohan Parkale','rohan@gmail.com','$2b$12$S.GTskxQQjNvvLOyaV4ATevT5qo9472DO.xj9OdJgcU4Uh95NubdG','ADMIN',1,'2026-08-06 09:54:09','2026-08-06 09:54:09'),(2,'Updated Administrator','admin_test_day5@traffic.com','$2b$12$UADXcTkAB8jTNHTqEMXCaOugm3stY1PflUyr4heSpDmgbw9575Jqq','ADMIN',1,'2026-08-12 11:19:20','2026-08-12 11:19:20'),(3,'Rohan Parkale','abc@gmail.com','$2b$12$U6sIO.QZk0laSJb8T2Txeee6RohuB9FK29cDwu6rPBZy5FYpjKGtu','ADMIN',1,'2026-08-12 11:56:58','2026-08-12 11:56:58'),(4,'ganesh ','abc12@gmail.com','$2b$12$F4682/SH1yPxAZkddAiqG.Ku06nM6wX2LngKSdVjmEuCjvdjxqsOS','OPERATOR',1,'2026-08-12 11:58:39','2026-08-12 11:58:39'),(5,'ayeshkant','abc123@gmail.com','$2b$12$K.Z1dhneqWvWioF6aBDoaOmJ4/.b9tsXPgz/buxxn7qbl0nMPn6Ua','USER',1,'2026-08-12 12:00:01','2026-08-12 12:00:01'),(6,'System Admin','admin_day10@traffic.com','$2b$12$tCQHs4jwrjuTOZEH56.mO.qrWmtc0gGFwvr3z/gN7k1LhnqW6g0P2','ADMIN',1,'2026-08-19 07:07:06','2026-08-19 07:07:06'),(7,'Traffic Operator','operator_day10@traffic.com','$2b$12$MIW.gM0Zgokr3zSrffFZbuqQnXzxSX8ObeRunjjU.7qQBnUtqZdDO','OPERATOR',1,'2026-08-19 07:07:07','2026-08-19 07:07:07'),(8,'Hacked User','user_day10@traffic.com','$2b$12$PTG1wc8Hr59WaLL5kxnh5.5o4s7rJWIxYDgS5TnMNLsOhwbxjkJqu','USER',1,'2026-08-19 07:07:07','2026-08-19 07:12:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-21 14:15:20
