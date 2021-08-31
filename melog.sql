/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost:3306
 Source Schema         : melog

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : 65001

 Date: 31/08/2021 11:50:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for melog_article
-- ----------------------------
DROP TABLE IF EXISTS `melog_article`;
CREATE TABLE `melog_article`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文档ID',
  `cate_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '栏目ID',
  `user_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `title` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '标题',
  `writer` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '作者',
  `source` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '来源',
  `source_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '来源链接',
  `click` int(255) UNSIGNED NOT NULL DEFAULT 0 COMMENT '点击',
  `keywords` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '关键词',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '简介',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '内容',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  `update_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '更新时间',
  `comment_total` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论总数',
  `is_comment` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否允许评论',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `click`(`click`) USING BTREE,
  INDEX `cate_id`(`cate_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 53 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of melog_article
-- ----------------------------
INSERT INTO `melog_article` VALUES (1, 1, 1, '我的博客上线了', '雨思', 'me', '', 469, 'melog,博客', '我的个人博客上线了，基于melog搭建', '# me\r\n我的个人博客上线了，博客名字：`me`，网址：[https://me.i-i.me](https://me.i-i.me \"me\")\r\n\r\n本人兴趣广泛，爱好很多，喜欢一切新奇的事物！\r\n\r\n以后会慢慢填充内容，敬请期待！\r\n\r\n# melog\r\n本博客使用简单、轻量级博客程序[melog](https://me.i-i.me/melog/ \"melog\")搭建。', 1577808000, 1581605484, 0, 0);

-- ----------------------------
-- Table structure for melog_cate
-- ----------------------------
DROP TABLE IF EXISTS `melog_cate`;
CREATE TABLE `melog_cate`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '栏目ID',
  `cate_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目名字',
  `cate_dir` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目文件夹',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目简介',
  `keywords` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目关键词',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '栏目排序',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sort`(`sort`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of melog_cate
-- ----------------------------
INSERT INTO `melog_cate` VALUES (1, 'melog', 'melog', '一个基于jj.js(nodejs)构建的简单轻量级blog系统', 'melog,jj.js,nodejs,blog,博客', 1);

-- ----------------------------
-- Table structure for melog_comment
-- ----------------------------
DROP TABLE IF EXISTS `melog_comment`;
CREATE TABLE `melog_comment`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `pid` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '父ID',
  `comment_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论ID',
  `article_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '文章ID',
  `user_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `uname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '链接',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论内容',
  `ip` char(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '来源IP',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `comment`(`id`, `pid`, `article_id`) USING BTREE,
  INDEX `comment_id`(`comment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of melog_comment
-- ----------------------------
INSERT INTO `melog_comment` VALUES (1, 0, 1, 1, 1, '雨思', 'zhyaphoo@qq.com', 'https://me.i-i.me/', '评论测试，(,,•́ . •̀,,)', '127.0.0.1', 1582032240);

-- ----------------------------
-- Table structure for melog_link
-- ----------------------------
DROP TABLE IF EXISTS `melog_link`;
CREATE TABLE `melog_link`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `pid` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '父ID',
  `lname` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '标题',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '图标',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '链接',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  `update_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pid`(`pid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of melog_link
-- ----------------------------
INSERT INTO `melog_link` VALUES (1, 0, '友情链接', '', '', 0, 0, 0);
INSERT INTO `melog_link` VALUES (2, 0, '底部链接', '', '', 0, 0, 0);
INSERT INTO `melog_link` VALUES (3, 1, '爱主页', '', 'https://www.i-i.me/', 2, 0, 0);
INSERT INTO `melog_link` VALUES (4, 2, 'github', '', 'https://github.com/yafoo/jj.js', 99, 0, 0);
INSERT INTO `melog_link` VALUES (5, 2, 'melog', '', 'https://me.i-i.me/melog/', 4, 0, 0);

-- ----------------------------
-- Table structure for melog_site
-- ----------------------------
DROP TABLE IF EXISTS `melog_site`;
CREATE TABLE `melog_site`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `group` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分类',
  `type` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类型',
  `kname` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '名字',
  `intro` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `value` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '内容',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 32 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of melog_site
-- ----------------------------
INSERT INTO `melog_site` VALUES (1, 'web', 'input', 'basehost', '网站根网址', 'http://127.0.0.1:3003');
INSERT INTO `melog_site` VALUES (3, 'web', 'input', 'webname', '网站名字', 'Melog');
INSERT INTO `melog_site` VALUES (4, 'other', 'input', 'upload', '文件上传目录', '/upload');
INSERT INTO `melog_site` VALUES (5, 'web', 'input', 'keywords', '关键词', 'melog');
INSERT INTO `melog_site` VALUES (6, 'web', 'textarea', 'description', '网站简介', '一个基于melog搭建的简单轻量级博客！');
INSERT INTO `melog_site` VALUES (7, 'web', 'textarea', 'beian', '网站备案信息', '<a href=\"https://icp.gov.moe/?keyword=20200002\" rel=\"nofollow\" target=\"_blank\">萌ICP备 20200002号</a> <script>!function(p){\"use strict\";!function(t){var s=window,e=document,i=p,c=\"\".concat(\"https:\"===e.location.protocol?\"https://\":\"http://\",\"sdk.51.la/js-sdk-pro.min.js\"),n=e.createElement(\"script\"),r=e.getElementsByTagName(\"script\")[0];n.type=\"text/javascript\",n.setAttribute(\"charset\",\"UTF-8\"),n.async=!0,n.src=c,n.id=\"LA_COLLECT\",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:\"JFnMP2IgdFm3vb1n\",ck:\"JFnMP2IgdFm3vb1n\"});</script>');
INSERT INTO `melog_site` VALUES (15, 'other', 'input', 'img_width', '图片限制宽度', '800');
INSERT INTO `melog_site` VALUES (16, 'other', 'input', 'img_height', '图片限制高度', '2000');
INSERT INTO `melog_site` VALUES (19, 'other', 'input', 'list_rows', '列表显示行数', '10');
INSERT INTO `melog_site` VALUES (22, 'self', 'input', 'keyname', '自定义参数', 'keyvalue');
INSERT INTO `melog_site` VALUES (2, 'web', 'input', 'admin_alias', '后台目录别名', 'admin');
INSERT INTO `melog_site` VALUES (31, 'other', 'input', 'is_comment', '开启评论(1/0)', '1');

-- ----------------------------
-- Table structure for melog_user
-- ----------------------------
DROP TABLE IF EXISTS `melog_user`;
CREATE TABLE `melog_user`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `uname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `tname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '名字',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `salt` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '加盐',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  `update_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '更新时间',
  `login_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '登录时间',
  `is_lock` tinyint(1) NOT NULL DEFAULT -5 COMMENT '账号锁定',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of melog_user
-- ----------------------------
INSERT INTO `melog_user` VALUES (1, 'admin', '', 'melog@i-i.me', '64ce231b2bd266afc8d14c1ca426d55f', 'B6wotRyO', 0, 1630380592, 1630381454, -5);

SET FOREIGN_KEY_CHECKS = 1;
