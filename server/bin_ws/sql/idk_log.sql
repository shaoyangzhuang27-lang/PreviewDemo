/*
SQLyog Ultimate v12.3.1 (64 bit)
MySQL - 5.7.29-log : Database - idk_log
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`idk_log` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

USE `idk_log`;

/*Table structure for table `battle_logs` */

DROP TABLE IF EXISTS `battle_logs`;

CREATE TABLE `battle_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `copy_id` int(11) DEFAULT '0',
  `type` int(11) DEFAULT '0',
  `i_id` varchar(64) CHARACTER SET ascii DEFAULT '',
  `result` int(11) DEFAULT '0',
  `reward` varchar(512) CHARACTER SET ascii DEFAULT '',
  `para1` varchar(512) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(32) CHARACTER SET ascii DEFAULT '',
  `memo` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=41362 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `card_logs` */

DROP TABLE IF EXISTS `card_logs`;

CREATE TABLE `card_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `coin_type` int(11) DEFAULT '0',
  `type` int(11) DEFAULT '0',
  `cards` varchar(10000) CHARACTER SET ascii DEFAULT '',
  `para1` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(32) CHARACTER SET ascii DEFAULT '',
  `memo` text COLLATE utf8_bin NOT NULL,
  `sub_type` int(11) DEFAULT '0',
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=16930 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `charge_logs` */

DROP TABLE IF EXISTS `charge_logs`;

CREATE TABLE `charge_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `transaction_id` varchar(64) CHARACTER SET ascii DEFAULT '',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `diamond` int(11) DEFAULT '0',
  `money` varchar(255) COLLATE utf8_bin DEFAULT '0',
  `currency` varchar(32) CHARACTER SET ascii DEFAULT '',
  `product_id` varchar(32) CHARACTER SET ascii DEFAULT '',
  `channel_no` varchar(32) CHARACTER SET ascii DEFAULT '',
  `termin_info` varchar(256) CHARACTER SET ascii DEFAULT '',
  `mac` varchar(256) CHARACTER SET ascii DEFAULT '',
  `imei` varchar(256) CHARACTER SET ascii DEFAULT '',
  `ip` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para1` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(32) CHARACTER SET ascii DEFAULT '',
  `memo` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `coin_logs` */

DROP TABLE IF EXISTS `coin_logs`;

CREATE TABLE `coin_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `coin_type` int(11) DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  `action` varchar(32) CHARACTER SET ascii DEFAULT '',
  `coin_cost` int(11) DEFAULT '0',
  `coin_left` int(11) DEFAULT '0',
  `para1` varchar(256) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(256) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(256) CHARACTER SET ascii DEFAULT '',
  `memo` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=63017 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `college_logs` */

DROP TABLE IF EXISTS `college_logs`;

CREATE TABLE `college_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `card_ids` varchar(2048) COLLATE utf8_bin DEFAULT '',
  `college_level` int(11) DEFAULT '0',
  `college_tier` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `guild_logs` */

DROP TABLE IF EXISTS `guild_logs`;

CREATE TABLE `guild_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `action` int(11) DEFAULT '0',
  `guild_id` int(11) DEFAULT '0',
  `level` int(11) DEFAULT '0',
  `para1` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(32) CHARACTER SET ascii DEFAULT '',
  `memo` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=969 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `hero_logs` */

DROP TABLE IF EXISTS `hero_logs`;

CREATE TABLE `hero_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `card_id` bigint(20) DEFAULT '0',
  `card_lv` int(11) DEFAULT '0',
  `card_rank` int(11) DEFAULT '0',
  `action` varchar(64) COLLATE utf8_bin DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6132 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `hunting_awards` */

DROP TABLE IF EXISTS `hunting_awards`;

CREATE TABLE `hunting_awards` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `rank` int(11) DEFAULT '0',
  `reward` varchar(512) CHARACTER SET ascii DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `item_logs` */

DROP TABLE IF EXISTS `item_logs`;

CREATE TABLE `item_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  `action` varchar(128) CHARACTER SET ascii DEFAULT '',
  `item_id` varchar(32) CHARACTER SET ascii DEFAULT '',
  `item_name` varchar(32) CHARACTER SET ascii DEFAULT '',
  `item_num` int(11) DEFAULT '0',
  `item_total` int(11) DEFAULT '0',
  `para1` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(32) CHARACTER SET ascii DEFAULT '',
  `memo` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=212636 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `level_logs` */

DROP TABLE IF EXISTS `level_logs`;

CREATE TABLE `level_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `before_level` int(11) DEFAULT '0',
  `after_level` int(11) DEFAULT '0',
  `termin_info` varchar(256) CHARACTER SET ascii DEFAULT '',
  `mac` varchar(256) CHARACTER SET ascii DEFAULT '',
  `imei` varchar(256) CHARACTER SET ascii DEFAULT '',
  `ip` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para1` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(32) CHARACTER SET ascii DEFAULT '',
  `memo` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=10406 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_activties` */

DROP TABLE IF EXISTS `log_activties`;

CREATE TABLE `log_activties` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `activity_id` int(11) DEFAULT '0',
  `activity_type` int(11) DEFAULT '0',
  `param1` int(11) DEFAULT '0',
  `param2` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_limit_tasks` */

DROP TABLE IF EXISTS `log_limit_tasks`;

CREATE TABLE `log_limit_tasks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `task_id` int(11) DEFAULT '0',
  `repu` int(11) DEFAULT '0',
  `obj_type` int(11) DEFAULT '0',
  `param1` int(11) DEFAULT '0',
  `param2` int(11) DEFAULT '0',
  `param3` int(11) DEFAULT '0',
  `num` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_offline_awards` */

DROP TABLE IF EXISTS `log_offline_awards`;

CREATE TABLE `log_offline_awards` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `money` int(11) DEFAULT '0',
  `exp` int(11) DEFAULT '0',
  `up` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_player_game_progresses` */

DROP TABLE IF EXISTS `log_player_game_progresses`;

CREATE TABLE `log_player_game_progresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `days` int(11) DEFAULT '0',
  `player_level` int(11) DEFAULT '0',
  `copy_id` int(11) DEFAULT '0',
  `challenge_id` int(11) DEFAULT '0',
  `fighting` int(11) DEFAULT '0',
  `hero_info` varchar(256) COLLATE utf8_bin DEFAULT '',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=414 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_player_logins` */

DROP TABLE IF EXISTS `log_player_logins`;

CREATE TABLE `log_player_logins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `logout_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_random_awards` */

DROP TABLE IF EXISTS `log_random_awards`;

CREATE TABLE `log_random_awards` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `obj_type` int(11) DEFAULT '0',
  `param1` int(11) DEFAULT '0',
  `param2` int(11) DEFAULT '0',
  `param3` int(11) DEFAULT '0',
  `num` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1333 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_trail_resets` */

DROP TABLE IF EXISTS `log_trail_resets`;

CREATE TABLE `log_trail_resets` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `level` int(11) DEFAULT '0',
  `copy_id` int(11) DEFAULT '0',
  `stage` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=982 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_vrmb_adds` */

DROP TABLE IF EXISTS `log_vrmb_adds`;

CREATE TABLE `log_vrmb_adds` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `add_type` int(11) DEFAULT '0',
  `add_vrmb` int(11) DEFAULT '0',
  `vrmb_after` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `log_vrmb_consumes` */

DROP TABLE IF EXISTS `log_vrmb_consumes`;

CREATE TABLE `log_vrmb_consumes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `player_id` bigint(20) DEFAULT '0',
  `consume_type` int(11) DEFAULT '0',
  `consume_vrmb` int(11) DEFAULT '0',
  `vrmb_after` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `login_logs` */

DROP TABLE IF EXISTS `login_logs`;

CREATE TABLE `login_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `login_mode` int(11) DEFAULT '0',
  `time_used` int(11) DEFAULT '0',
  `login_ip` varchar(32) CHARACTER SET ascii DEFAULT '',
  `os_ver` varchar(128) CHARACTER SET ascii DEFAULT '',
  `termin_info` varchar(256) CHARACTER SET ascii DEFAULT '',
  `mac` varchar(256) CHARACTER SET ascii DEFAULT '',
  `imei` varchar(256) CHARACTER SET ascii DEFAULT '',
  `client_version` varchar(256) CHARACTER SET ascii DEFAULT '',
  `diamond` int(11) DEFAULT '0',
  `gold` int(11) DEFAULT '0',
  `team` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para1` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(32) CHARACTER SET ascii DEFAULT '',
  `memo` varchar(256) CHARACTER SET ascii DEFAULT '',
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=39312 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `register_logs` */

DROP TABLE IF EXISTS `register_logs`;

CREATE TABLE `register_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `os_ver` varchar(128) CHARACTER SET ascii DEFAULT '',
  `ip` varchar(32) CHARACTER SET ascii DEFAULT '',
  `termin_info` varchar(256) CHARACTER SET ascii DEFAULT '',
  `mac` varchar(256) CHARACTER SET ascii DEFAULT '',
  `imei` varchar(256) CHARACTER SET ascii DEFAULT '',
  `memo` varchar(256) CHARACTER SET ascii DEFAULT '',
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=522 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `task_logs` */

DROP TABLE IF EXISTS `task_logs`;

CREATE TABLE `task_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `channel` varchar(32) CHARACTER SET ascii DEFAULT '',
  `server_id` int(11) DEFAULT '0',
  `account` varchar(256) CHARACTER SET ascii DEFAULT '',
  `gid` varchar(32) CHARACTER SET ascii DEFAULT '',
  `level` int(11) DEFAULT '0',
  `task_type` varchar(64) CHARACTER SET ascii DEFAULT '',
  `task_name` varchar(64) CHARACTER SET ascii DEFAULT '',
  `action` varchar(64) CHARACTER SET ascii DEFAULT '',
  `para1` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para2` varchar(32) CHARACTER SET ascii DEFAULT '',
  `para3` varchar(32) CHARACTER SET ascii DEFAULT '',
  `memo` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`update_date`)
) ENGINE=InnoDB AUTO_INCREMENT=30046 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
