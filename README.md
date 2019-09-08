# iime
一个基于iijs构建的简单轻量级blog系统

### 项目介绍

源码：[github](https://github.com/yafoo/iime "github")　[码云](https://gitee.com/yafu/iime "码云")

### 其他

1. [爱主页](https://www.i-i.me/ "爱主页 - 网址收藏分享平台！")
2. [iijs MVC框架](https://github.com/yafoo/iijs "iijs MVC框架")

### Nginx代理设置

```
location / {
    proxy_pass       http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### License

[MIT](LICENSE)