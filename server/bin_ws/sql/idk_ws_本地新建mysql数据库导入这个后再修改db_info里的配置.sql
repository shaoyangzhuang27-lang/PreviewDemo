/*
SQLyog Ultimate v12.3.1 (64 bit)
MySQL - 5.7.32 : Database - idk_gm
*********************************************************************
*/
CREATE DATABASE `idk_game`CHARACTER SET utf8 COLLATE utf8_bin; 
CREATE DATABASE `idk_log`CHARACTER SET utf8 COLLATE utf8_bin; 
CREATE DATABASE `idk_gm`CHARACTER SET utf8 COLLATE utf8_bin; 

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`idk_gm` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */;

USE `idk_gm`;

/*Table structure for table `game_masters` */

DROP TABLE IF EXISTS `game_masters`;

CREATE TABLE `game_masters` (
  `account_id` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `account_pw` varchar(128) COLLATE utf8_bin DEFAULT '',
  `account_name` varchar(128) COLLATE utf8_bin DEFAULT '',
  `permission` int(11) DEFAULT '0',
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `game_masters` */

insert  into `game_masters`(`account_id`,`account_pw`,`account_name`,`permission`) values 
('a','a','aa',1);

/*Table structure for table `log_gm_operations` */

DROP TABLE IF EXISTS `log_gm_operations`;

CREATE TABLE `log_gm_operations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `account_id` varchar(128) COLLATE utf8_bin DEFAULT '',
  `account_name` varchar(128) COLLATE utf8_bin DEFAULT '',
  `operation_type` varchar(128) COLLATE utf8_bin DEFAULT '',
  `operation_desc` varchar(512) COLLATE utf8_bin DEFAULT '',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `log_gm_operations` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
