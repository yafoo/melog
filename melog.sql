/*
 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 50651
 Source Host           : localhost:3306
 Source Schema         : melog

 Target Server Type    : MySQL
 Target Server Version : 50651
 File Encoding         : 65001

 Date: 20/08/2022 12:10:12
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
  `thumb` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '缩略图',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  `update_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '更新时间',
  `comment_count` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论总数',
  `comment_set` int(10) NOT NULL DEFAULT 0 COMMENT '评论设置（0跟随系统，1强制开启，-1强制关闭）',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `click`(`click`) USING BTREE,
  INDEX `cate_id`(`cate_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of melog_article
-- ----------------------------
INSERT INTO `melog_article` VALUES (1, 1, 1, '我的博客上线了', '雨思', 'me', '', 1, 'melog,博客', '我的个人博客上线了，基于melog搭建', '# me\r\n我的个人博客上线了，博客名字：`me`，网址：[https://me.i-i.me](https://me.i-i.me \"me\")\r\n\r\n本人兴趣广泛，爱好很多，喜欢一切新奇的事物！\r\n\r\n# melog\r\n本博客使用简单、轻量级博客程序[melog](https://me.i-i.me/melog/ \"melog\")搭建。', '', 1577808000, 1631959741, 0, 0);
INSERT INTO `melog_article` VALUES (2, 1, 1, '留言本', 'admin', 'Melog', '', 1, '留言本', '留言本', '## 我的留言本\r\n\r\n> 既然来了，就留个纪念吧，和我谈天说地！\r\n\r\n你有什么想说的，请在评论留言吧！', '', 1660967862, 0, 0, 1);

-- ----------------------------
-- Table structure for melog_cate
-- ----------------------------
DROP TABLE IF EXISTS `melog_cate`;
CREATE TABLE `melog_cate`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '栏目ID',
  `cate_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目名字',
  `cate_dir` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目文件夹',
  `seo_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT 'SEO标题',
  `keywords` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目关键词',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '栏目简介',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '栏目排序',
  `is_show` tinyint(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT '是否显示',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sort`(`sort`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of melog_cate
-- ----------------------------
INSERT INTO `melog_cate` VALUES (1, 'melog', 'melog', '', 'melog,jj.js,nodejs,blog,博客', '一个基于jj.js(nodejs)构建的简单轻量级blog系统', 1, 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

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
  `title` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '标题',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '图标',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '链接',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  `update_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pid`(`pid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of melog_link
-- ----------------------------
INSERT INTO `melog_link` VALUES (1, 0, '友情链接', '', '', 0, 0, 0);
INSERT INTO `melog_link` VALUES (2, 0, '底部链接', '', '', 0, 0, 0);
INSERT INTO `melog_link` VALUES (3, 1, '爱主页', '', 'https://www.i-i.me/', 2, 0, 0);
INSERT INTO `melog_link` VALUES (4, 1, 'melog', '', 'https://me.i-i.me/melog/', 1, 0, 0);
INSERT INTO `melog_link` VALUES (5, 2, 'github', '', 'https://github.com/yafoo/melog', 1, 0, 0);
INSERT INTO `melog_link` VALUES (6, 0, '顶部导航', '', '', 0, 0, 0);
INSERT INTO `melog_link` VALUES (7, 6, '首页', '', '/', 1, 0, 0);
INSERT INTO `melog_link` VALUES (8, 6, '留言', '', '/article/2.html', 2, 0, 0);
INSERT INTO `melog_link` VALUES (9, 6, '关于', '', '/article/1.html', 3, 0, 0);

-- ----------------------------
-- Table structure for melog_site
-- ----------------------------
DROP TABLE IF EXISTS `melog_site`;
CREATE TABLE `melog_site`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `group` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分组',
  `type` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类型',
  `key` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '参数key',
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '参数名字',
  `value` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '参数值',
  `options` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT 'radio、select选项值',
  `tips` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '字段提示语',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 40 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of melog_site
-- ----------------------------
INSERT INTO `melog_site` VALUES (1, 'web', 'input', 'basehost', '网站根网址', 'http://127.0.0.1:3003', '', '需要带http或https，结尾不要带斜杠', 0);
INSERT INTO `melog_site` VALUES (3, 'web', 'input', 'webname', '网站名字', 'Melog', '', '', 1);
INSERT INTO `melog_site` VALUES (4, 'image', 'input', 'upload', '文件上传目录', '/upload', '', '目录前需带斜杠，默认为\"/upload\"', 0);
INSERT INTO `melog_site` VALUES (5, 'web', 'input', 'keywords', '网站关键词', 'melog', '', '', 3);
INSERT INTO `melog_site` VALUES (6, 'web', 'textarea', 'description', '网站简介', '一个基于melog搭建的简单轻量级博客！', '', '', 4);
INSERT INTO `melog_site` VALUES (7, 'web', 'textarea', 'beian', '网站备案信息', '<a href=\"https://icp.gov.moe/?keyword=20200002\" rel=\"nofollow\" target=\"_blank\">萌ICP备 20200002号</a> <script>!function(p){\"use strict\";!function(t){var s=window,e=document,i=p,c=\"\".concat(\"https:\"===e.location.protocol?\"https://\":\"http://\",\"sdk.51.la/js-sdk-pro.min.js\"),n=e.createElement(\"script\"),r=e.getElementsByTagName(\"script\")[0];n.type=\"text/javascript\",n.setAttribute(\"charset\",\"UTF-8\"),n.async=!0,n.src=c,n.id=\"LA_COLLECT\",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:\"JFnMP2IgdFm3vb1n\",ck:\"JFnMP2IgdFm3vb1n\"});</script>', '', '支持html、javascript代码', 5);
INSERT INTO `melog_site` VALUES (15, 'image', 'input', 'img_width', '图片限制宽度', '1920', '', '', 1);
INSERT INTO `melog_site` VALUES (16, 'image', 'input', 'img_height', '图片限制高度', '2000', '', '', 2);
INSERT INTO `melog_site` VALUES (19, 'other', 'input', 'list_rows', '列表显示行数', '10', '', '', 0);
INSERT INTO `melog_site` VALUES (22, 'self', 'input', 'keyname', '自定义参数', 'keyvalue', '', '', 0);
INSERT INTO `melog_site` VALUES (2, 'web', 'input', 'admin_alias', '后台目录别名', 'admin', '', '用来隐藏后台地址，设置后，只能通过此地址进入后台', 6);
INSERT INTO `melog_site` VALUES (31, 'other', 'radio', 'is_comment', '开启评论', '1', '开启|1||关闭|0', '', 1);
INSERT INTO `melog_site` VALUES (32, 'image', 'input', 'thumb_width', '缩略图宽度', '400', '', '', 3);
INSERT INTO `melog_site` VALUES (33, 'image', 'input', 'thumb_height', '缩略图高度', '300', '', '', 4);
INSERT INTO `melog_site` VALUES (34, 'image', 'radio', 'img_origin', '保留原始图片', '1', '保留|1||不保留|0', '', 5);
INSERT INTO `melog_site` VALUES (35, 'web', 'input', 'seo_title', '主页SEO标题', '', '', '', 2);
INSERT INTO `melog_site` VALUES (36, 'web', 'radio', 'style', '网站导航风格', 'cms', 'cms|cms||blog|blog', '', 7);
INSERT INTO `melog_site` VALUES (37, 'web', 'input', 'nav_id', 'blog导航ID', '6', '', '即顶级链接ID', 8);
INSERT INTO `melog_site` VALUES (38, 'web', 'input', 'theme', '网站模板主题', '', '', '即模板目录名，为空时默认为\"view\"', 9);
INSERT INTO `melog_site` VALUES (39, 'other', 'input', 'map_ak', '百度地图ak', '465c0734722cfde06f7d7eac68559354', '', '', 2);

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for melog_upload
-- ----------------------------
DROP TABLE IF EXISTS `melog_upload`;
CREATE TABLE `melog_upload`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `user_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '文件标题',
  `thumb` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '图片地址',
  `image` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '图片地址',
  `extname` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '文件类型',
  `size` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '文件大小',
  `add_time` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  `original` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '原图地址',
  `origin_size` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '原图大小',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for melog_user
-- ----------------------------
DROP TABLE IF EXISTS `melog_user`;
CREATE TABLE `melog_user`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `uname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `true_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '真实名字',
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
