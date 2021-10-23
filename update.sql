SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `me`.`melog_article` ADD COLUMN `thumb` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '缩略图' AFTER `description`;

ALTER TABLE `me`.`melog_upload` ADD COLUMN `original` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '原图地址' AFTER `add_time`;

ALTER TABLE `me`.`melog_upload` ADD COLUMN `origin_size` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '原图大小' AFTER `original`;

INSERT INTO `me`.`melog_site`(`id`, `group`, `type`, `kname`, `intro`, `value`) VALUES (34, 'image', 'input', 'img_origin', '保留原始图片', '0');

UPDATE `me`.`melog_site` SET `group` = 'image' WHERE `id` = 4;

UPDATE `me`.`melog_site` SET `group` = 'image' WHERE `id` = 15;

UPDATE `me`.`melog_site` SET `group` = 'image' WHERE `id` = 16;

UPDATE `me`.`melog_site` SET `group` = 'image' WHERE `id` = 32;

UPDATE `me`.`melog_site` SET `group` = 'image' WHERE `id` = 33;

SET FOREIGN_KEY_CHECKS=1;