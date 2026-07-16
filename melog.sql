
-- ----------------------------
-- Table structure for melog_article
-- ----------------------------
DROP TABLE IF EXISTS `melog_article`;
CREATE TABLE `melog_article` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `cate_id` INTEGER NOT NULL DEFAULT 0,
  `user_id` INTEGER NOT NULL DEFAULT 0,
  `title` VARCHAR(150) NOT NULL DEFAULT '',
  `writer` VARCHAR(50) NOT NULL DEFAULT '',
  `source` VARCHAR(50) NOT NULL DEFAULT '',
  `source_url` VARCHAR(255) NOT NULL DEFAULT '',
  `click` INTEGER NOT NULL DEFAULT 0,
  `keywords` VARCHAR(100) NOT NULL DEFAULT '',
  `description` VARCHAR(255) NOT NULL DEFAULT '',
  `content` TEXT NOT NULL DEFAULT '',
  `thumb` VARCHAR(255) NOT NULL DEFAULT '',
  `add_time` INTEGER NOT NULL DEFAULT 0,
  `update_time` INTEGER NOT NULL DEFAULT 0,
  `comment_count` INTEGER NOT NULL DEFAULT 0,
  `comment_set` INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX `idx_article_click` ON `melog_article` (`click`);
CREATE INDEX `idx_article_cate_id` ON `melog_article` (`cate_id`);

-- ----------------------------
-- Records of melog_article
-- ----------------------------
INSERT INTO `melog_article` VALUES (1, 1, 1, '我的博客上线了', '雨思', 'me', '', 1, 'melog,博客', '我的个人博客上线了，基于melog搭建', '# me
我的个人博客上线了，博客名字：`me`，网址：[https://me.i-i.me](https://me.i-i.me "me")

本人兴趣广泛，爱好很多，喜欢一切新奇的事物！

# melog
本博客使用简单、轻量级博客程序[melog](https://me.i-i.me/special/melog.html "melog")搭建。', '', 1577808000, 1631959741, 0, 0);
INSERT INTO `melog_article` VALUES (2, 1, 1, '留言本', 'admin', 'Melog', '', 1, '留言本', '留言本', '## 我的留言本

> 既然来了，就留个纪念吧，和我谈天说地！

你有什么想说的，请在评论留言吧！', '', 1660967862, 0, 0, 1);

-- ----------------------------
-- Table structure for melog_cate
-- ----------------------------
DROP TABLE IF EXISTS `melog_cate`;
CREATE TABLE `melog_cate` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `cate_name` VARCHAR(150) NOT NULL DEFAULT '',
  `cate_dir` VARCHAR(50) NOT NULL DEFAULT '',
  `seo_title` VARCHAR(255) NOT NULL DEFAULT '',
  `keywords` VARCHAR(100) NOT NULL DEFAULT '',
  `description` VARCHAR(255) NOT NULL DEFAULT '',
  `sort` INTEGER NOT NULL DEFAULT 0,
  `is_show` INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX `idx_cate_sort` ON `melog_cate` (`sort`);

-- ----------------------------
-- Records of melog_cate
-- ----------------------------
INSERT INTO `melog_cate` VALUES (1, 'melog', 'melog', '', 'melog,jj.js,nodejs,blog,博客', '一个基于jj.js开发的简单轻量级blog系统', 1, 1);

-- ----------------------------
-- Table structure for melog_comment
-- ----------------------------
DROP TABLE IF EXISTS `melog_comment`;
CREATE TABLE `melog_comment` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `pid` INTEGER NOT NULL DEFAULT 0,
  `comment_id` INTEGER NOT NULL DEFAULT 0,
  `article_id` INTEGER NOT NULL DEFAULT 0,
  `user_id` INTEGER NOT NULL DEFAULT 0,
  `uname` VARCHAR(50) NOT NULL DEFAULT '',
  `email` VARCHAR(50) NOT NULL DEFAULT '',
  `url` VARCHAR(255) NOT NULL DEFAULT '',
  `content` TEXT NOT NULL DEFAULT '',
  `ip` VARCHAR(16) NOT NULL DEFAULT '',
  `add_time` INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX `idx_comment` ON `melog_comment` (`id`, `pid`, `article_id`);
CREATE INDEX `idx_comment_id` ON `melog_comment` (`comment_id`);

-- ----------------------------
-- Records of melog_comment
-- ----------------------------
INSERT INTO `melog_comment` VALUES (1, 0, 1, 1, 1, '雨思', 'zhyaphoo@qq.com', 'https://me.i-i.me/', '评论测试，(,,•́ . •̀,,)', '127.0.0.1', 1582032240);

-- ----------------------------
-- Table structure for melog_link
-- ----------------------------
DROP TABLE IF EXISTS `melog_link`;
CREATE TABLE `melog_link` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `pid` INTEGER NOT NULL DEFAULT 0,
  `title` VARCHAR(150) NOT NULL DEFAULT '',
  `icon` VARCHAR(255) NOT NULL DEFAULT '',
  `url` VARCHAR(255) NOT NULL DEFAULT '',
  `sort` INTEGER NOT NULL DEFAULT 0,
  `add_time` INTEGER NOT NULL DEFAULT 0,
  `update_time` INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX `idx_link_pid` ON `melog_link` (`pid`);

-- ----------------------------
-- Records of melog_link
-- ----------------------------
INSERT INTO `melog_link` VALUES (1, 0, '友情链接', '', '', 0, 0, 0);
INSERT INTO `melog_link` VALUES (2, 0, '底部链接', '', '', 0, 0, 0);
INSERT INTO `melog_link` VALUES (3, 1, '爱主页', '', 'https://www.i-i.me/', 2, 0, 0);
INSERT INTO `melog_link` VALUES (4, 1, 'melog', '', 'https://me.i-i.me/special/melog.html', 1, 0, 0);
INSERT INTO `melog_link` VALUES (5, 2, 'github', '', 'https://github.com/yafoo/melog', 1, 0, 0);
INSERT INTO `melog_link` VALUES (6, 2, '留言本', '', '/article/2.html', 1, 0, 0);
INSERT INTO `melog_link` VALUES (7, 0, '顶部导航', '', '', 0, 0, 0);
INSERT INTO `melog_link` VALUES (8, 6, '首页', '', '/', 1, 0, 0);
INSERT INTO `melog_link` VALUES (9, 6, '留言', '', '/article/2.html', 2, 0, 0);
INSERT INTO `melog_link` VALUES (10, 6, '关于', '', '/article/1.html', 3, 0, 0);

-- ----------------------------
-- Table structure for melog_site
-- ----------------------------
DROP TABLE IF EXISTS `melog_site`;
CREATE TABLE `melog_site` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `group` VARCHAR(10) NOT NULL DEFAULT '',
  `type` VARCHAR(10) NOT NULL DEFAULT '',
  `key` VARCHAR(30) NOT NULL DEFAULT '',
  `title` VARCHAR(100) NOT NULL DEFAULT '',
  `value` TEXT NOT NULL DEFAULT '',
  `options` VARCHAR(255) NOT NULL DEFAULT '',
  `tips` VARCHAR(255) NOT NULL DEFAULT '',
  `sort` INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------
-- Records of melog_site
-- ----------------------------
INSERT INTO `melog_site` VALUES (1, 'web', 'input', 'basehost', '网站根网址', 'http://127.0.0.1:3003', '', '需要带http或https，结尾不要带斜杠', 0);
INSERT INTO `melog_site` VALUES (3, 'web', 'input', 'webname', '网站名字', 'Melog', '', '', 1);
INSERT INTO `melog_site` VALUES (4, 'image', 'input', 'upload', '文件上传目录', '/upload', '', '目录前需带斜杠，默认为"/upload"', 0);
INSERT INTO `melog_site` VALUES (5, 'web', 'input', 'keywords', '网站关键词', 'melog', '', '', 3);
INSERT INTO `melog_site` VALUES (6, 'web', 'textarea', 'description', '网站简介', '一个基于melog搭建的简单轻量级博客！', '', '', 4);
INSERT INTO `melog_site` VALUES (7, 'web', 'textarea', 'beian', '网站备案信息', '<a href="https://icp.gov.moe/?keyword=20200002" rel="nofollow" target="_blank">萌ICP备 20200002号</a> <script>!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https:":"http:","//sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"JFnMP2IgdFm3vb1n",ck:"JFnMP2IgdFm3vb1n"});</script>', '', '支持html、javascript代码', 5);
INSERT INTO `melog_site` VALUES (15, 'image', 'input', 'img_width', '图片限制宽度', '1920', '', '', 1);
INSERT INTO `melog_site` VALUES (16, 'image', 'input', 'img_height', '图片限制高度', '2000', '', '', 2);
INSERT INTO `melog_site` VALUES (19, 'other', 'input', 'list_rows', '列表显示行数', '10', '', '', 0);
INSERT INTO `melog_site` VALUES (22, 'self', 'input', 'keyname', '自定义参数', 'keyvalue', '', '', 0);
INSERT INTO `melog_site` VALUES (31, 'other', 'radio', 'is_comment', '开启评论', '1', '开启|1||关闭|0', '', 1);
INSERT INTO `melog_site` VALUES (32, 'image', 'input', 'thumb_width', '缩略图宽度', '400', '', '', 3);
INSERT INTO `melog_site` VALUES (33, 'image', 'input', 'thumb_height', '缩略图高度', '300', '', '', 4);
INSERT INTO `melog_site` VALUES (34, 'image', 'radio', 'img_origin', '保留原始图片', '1', '保留|1||不保留|0', '', 5);
INSERT INTO `melog_site` VALUES (35, 'web', 'input', 'seo_title', '主页SEO标题', '', '', '', 2);
INSERT INTO `melog_site` VALUES (36, 'web', 'radio', 'style', '网站导航风格', 'cms', 'cms|cms||blog|blog', '', 7);
INSERT INTO `melog_site` VALUES (37, 'web', 'input', 'nav_id', 'blog导航ID', '6', '', '即顶级链接ID', 8);
INSERT INTO `melog_site` VALUES (38, 'web', 'input', 'theme', '网站模板主题', '', '', '即模板目录名，为空时默认为"view"', 9);
INSERT INTO `melog_site` VALUES (39, 'other', 'input', 'map_ak', '百度地图ak', '465c0734722cfde06f7d7eac68559354', '', '', 2);
INSERT INTO `melog_site` VALUES (40, 'other', 'input', 'push_key', 'PushMe推送Key', '', '', '用于评论通知推送，填写PushMe的push_key', 3);

-- ----------------------------
-- Table structure for melog_special
-- ----------------------------
DROP TABLE IF EXISTS `melog_special`;
CREATE TABLE `melog_special` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `title` VARCHAR(150) NOT NULL DEFAULT '',
  `short_title` VARCHAR(150) NOT NULL DEFAULT '',
  `seo_title` VARCHAR(255) NOT NULL DEFAULT '',
  `click` INTEGER NOT NULL DEFAULT 0,
  `keywords` VARCHAR(100) NOT NULL DEFAULT '',
  `description` VARCHAR(255) NOT NULL DEFAULT '',
  `thumb` VARCHAR(255) NOT NULL DEFAULT '',
  `special_dir` VARCHAR(100) NOT NULL DEFAULT '',
  `aside` INTEGER NOT NULL DEFAULT 1,
  `page_width` VARCHAR(50) NOT NULL DEFAULT '',
  `sort` INTEGER NOT NULL DEFAULT 0,
  `flag` INTEGER NOT NULL DEFAULT 0,
  `add_time` INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------
-- Table structure for melog_special_item
-- ----------------------------
DROP TABLE IF EXISTS `melog_special_item`;
CREATE TABLE `melog_special_item` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `special_id` INTEGER NOT NULL DEFAULT 0,
  `type` VARCHAR(50) NOT NULL DEFAULT '',
  `data` TEXT NOT NULL DEFAULT '',
  `sort` INTEGER NOT NULL DEFAULT 0,
  `enable` INTEGER NOT NULL DEFAULT 0,
  `add_time` INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------
-- Table structure for melog_upload
-- ----------------------------
DROP TABLE IF EXISTS `melog_upload`;
CREATE TABLE `melog_upload` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `user_id` INTEGER NOT NULL DEFAULT 0,
  `title` VARCHAR(100) NOT NULL DEFAULT '',
  `thumb` VARCHAR(255) NOT NULL DEFAULT '',
  `image` VARCHAR(255) NOT NULL DEFAULT '',
  `extname` VARCHAR(10) NOT NULL DEFAULT '',
  `size` INTEGER NOT NULL DEFAULT 0,
  `add_time` INTEGER NOT NULL DEFAULT 0,
  `original` VARCHAR(255) NOT NULL DEFAULT '',
  `origin_size` INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------
-- Table structure for melog_user
-- ----------------------------
DROP TABLE IF EXISTS `melog_user`;
CREATE TABLE `melog_user` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `uname` VARCHAR(50) NOT NULL DEFAULT '',
  `true_name` VARCHAR(50) NOT NULL DEFAULT '',
  `email` VARCHAR(50) NOT NULL DEFAULT '',
  `password` VARCHAR(50) NOT NULL DEFAULT '',
  `salt` VARCHAR(20) NOT NULL DEFAULT '',
  `add_time` INTEGER NOT NULL DEFAULT 0,
  `update_time` INTEGER NOT NULL DEFAULT 0,
  `login_time` INTEGER NOT NULL DEFAULT 0,
  `is_lock` INTEGER NOT NULL DEFAULT -5
);

-- ----------------------------
-- Records of melog_user
-- ----------------------------
INSERT INTO `melog_user` VALUES (1, 'admin', '', 'melog@i-i.me', '64ce231b2bd266afc8d14c1ca426d55f', 'B6wotRyO', 0, 1630380592, 1630381454, -5);
