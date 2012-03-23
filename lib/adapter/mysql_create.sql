
CREATE TABLE IF NOT EXISTS `domains` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `master` varchar(255) DEFAULT NULL,
  `last_check` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT 'NATIVE',
  `notified_serial` int(11) DEFAULT NULL,
  `account` varchar(255) DEFAULT NULL,
  `ttl` int(11) DEFAULT '86400',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `index_domains_on_name` (`name`)
);

CREATE TABLE IF NOT EXISTS `records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `ttl` int(11) NOT NULL,
  `prio` int(11) DEFAULT NULL,
  `change_date` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_records_on_domain_id` (`domain_id`),
  KEY `index_records_on_name` (`name`),
  KEY `index_records_on_name_and_type` (`name`,`type`)
);

