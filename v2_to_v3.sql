/*
 v2_to_v3.sql
 
 Date: 20/08/2022 12:00:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- ----------------------------
-- Table structure for melog_special
-- ----------------------------
DROP TABLE IF EXISTS `melog_special`;
CREATE TABLE `melog_special`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '专题ID',
  `title` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '标题',
  `short_title` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '短标题',
  `seo_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT 'SEO标题',
  `click` int(255) UNSIGNED NOT NULL DEFAULT 0 COMMENT '点击',
  `keywords` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '关键词',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '简介',
  `thumb` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '缩略图',
  `special_dir` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '目录地址（标识）',
  `aside` tinyint(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT '侧边栏',
  `page_width` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '页面宽度',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  `flag` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '标识（0默认，1banner展示）',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for melog_special_item
-- ----------------------------
DROP TABLE IF EXISTS `melog_special_item`;
CREATE TABLE `melog_special_item`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '模块ID',
  `special_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '专题ID',
  `type` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '模块类型',
  `data` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '模块数据',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  `enable` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '启用',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table alter for melog_article
-- ----------------------------
ALTER TABLE `melog_article` CHANGE COLUMN `comment_total` `comment_count` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论总数';
ALTER TABLE `melog_article` CHANGE COLUMN `is_comment` `comment_set` int(10) NOT NULL DEFAULT 0 COMMENT '评论设置（0跟随系统，1强制开启，-1强制关闭）';
ALTER TABLE `melog_article` MODIFY COLUMN `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '内容' AFTER `description`;

-- ----------------------------
-- Table alter for melog_cate
-- ----------------------------
ALTER TABLE `melog_cate` ADD COLUMN `seo_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT 'SEO标题' AFTER `cate_dir`;
ALTER TABLE `melog_cate` MODIFY COLUMN `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目简介' AFTER `keywords`;

-- ----------------------------
-- Table alter for melog_link
-- ----------------------------
ALTER TABLE `melog_link` CHANGE COLUMN `lname` `title` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '标题' AFTER `pid`;

-- ----------------------------
-- Table alter for melog_site
-- ----------------------------
ALTER TABLE `melog_site` CHANGE COLUMN `kname` `key` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '参数key';
ALTER TABLE `melog_site` CHANGE COLUMN `intro` `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '参数名字';
ALTER TABLE `melog_site` MODIFY COLUMN `group` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分组' AFTER `id`;
ALTER TABLE `melog_site` MODIFY COLUMN `value` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '参数值' AFTER `title`;
ALTER TABLE `melog_site` ADD COLUMN `options` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT 'radio、select选项值' AFTER `value`;
ALTER TABLE `melog_site` ADD COLUMN `tips` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '字段提示语' AFTER `options`;
ALTER TABLE `melog_site` ADD COLUMN `sort` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序' AFTER `tips`;

-- ----------------------------
-- Table alter for melog_user
-- ----------------------------
ALTER TABLE `melog_user` CHANGE COLUMN `tname` `true_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '真实名字';

-- ----------------------------
-- Table data for melog_site
-- ----------------------------
INSERT INTO `melog_site`(`group`, `type`, `key`, `title`, `value`, `options`, `tips`, `sort`) VALUES ('web', 'input', 'seo_title', '主页SEO标题', '', '', '', 2);
INSERT INTO `melog_site`(`group`, `type`, `key`, `title`, `value`, `options`, `tips`, `sort`) VALUES ('web', 'radio', 'style', '网站导航风格', 'cms', 'cms|cms||blog|blog', '', 7);
INSERT INTO `melog_site`(`group`, `type`, `key`, `title`, `value`, `options`, `tips`, `sort`) VALUES ('web', 'input', 'nav_id', 'blog导航ID', 6, '', '即顶级链接ID', 8);
INSERT INTO `melog_site`(`group`, `type`, `key`, `title`, `value`, `options`, `tips`, `sort`) VALUES ('web', 'input', 'theme', '网站模板主题', '', '', '即模板目录名，为空时默认为\"view\"', 9);
INSERT INTO `melog_site`(`group`, `type`, `key`, `title`, `value`, `options`, `tips`, `sort`) VALUES ('other', 'input', 'map_ak', '百度地图ak', '465c0734722cfde06f7d7eac68559354', '', '', 2);

UPDATE `melog_site` SET `tips` = '需要带http或https，结尾不要带斜杠', `sort` = 0 WHERE `key` = 'basehost';
UPDATE `melog_site` SET `tips` = '用来隐藏后台地址，设置后，只能通过此地址进入后台', `sort` = 6 WHERE `key` = 'admin_alias';
UPDATE `melog_site` SET `sort` = 1 WHERE `key` = 'webname';
UPDATE `melog_site` SET `tips` = '目录前需带斜杠，默认为\"/upload\"', `sort` = 0 WHERE `key` = 'upload';
UPDATE `melog_site` SET `title` = '网站关键词', `sort` = 3 WHERE `key` = 'keywords';
UPDATE `melog_site` SET `sort` = 4 WHERE `key` = 'description';
UPDATE `melog_site` SET `tips` = '支持html、javascript代码', `sort` = 5 WHERE `key` = 'beian';
UPDATE `melog_site` SET `sort` = 1 WHERE `key` = 'img_width';
UPDATE `melog_site` SET `sort` = 2 WHERE `key` = 'img_height';
UPDATE `melog_site` SET `type` = 'radio', `title` = '开启评论', `options` = '开启|1||关闭|0', `sort` = 1 WHERE `key` = 'is_comment';
UPDATE `melog_site` SET `sort` = 3 WHERE `key` = 'thumb_width';
UPDATE `melog_site` SET `sort` = 4 WHERE `key` = 'thumb_height';
UPDATE `melog_site` SET `type` = 'radio', `title` = '保留原始图片', `options` = '保留|1||不保留|0', `sort` = 5 WHERE `key` = 'img_origin';

-- ----------------------------
-- Table data for melog_link
-- ----------------------------
DROP PROCEDURE IF EXISTS melog;
DELIMITER //
CREATE PROCEDURE melog()
BEGIN
	DECLARE num int(10) default 0;
	
	INSERT INTO `melog_link` (`pid`, `title`, `icon`, `url`, `sort`) VALUES (0, '顶部导航', '', '', 0);
	SELECT id INTO num FROM `melog_link` WHERE `title` LIKE '顶部导航';
	INSERT INTO `melog_link` (`pid`, `title`, `icon`, `url`, `sort`) VALUES (num, '首页', '', '/', 1);
	INSERT INTO `melog_link` (`pid`, `title`, `icon`, `url`, `sort`) VALUES (num, '留言', '', '/article/2.html', 2);
	INSERT INTO `melog_link` (`pid`, `title`, `icon`, `url`, `sort`) VALUES (num, '关于', '', '/article/1.html', 3);
    UPDATE `melog_site` SET `value` = num WHERE `key` = 'nav_id';

END //
DELIMITER ;
CALL melog();
DROP PROCEDURE melog;


SET FOREIGN_KEY_CHECKS = 1;