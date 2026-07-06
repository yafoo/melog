-- 添加 PushMe 推送 Key 配置项
INSERT INTO `melog_site` (`group`, `type`, `key`, `title`, `value`, `options`, `tips`, `sort`) 
VALUES ('other', 'input', 'push_key', 'PushMe推送Key', '', '', '用于评论通知推送，填写PushMe的push_key', 3);
