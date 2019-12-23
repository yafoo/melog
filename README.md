# melog

![melog](https://me.i-i.me/static/images/melog_360.png "melog")

melog，一个基于iijs(nodejs)构建的简单轻量级blog系统。代码极简，无需编译，方便二次开发。

项目地址：[https://github.com/yafoo/melog](https://github.com/yafoo/melog "https://github.com/yafoo/melog")

文档地址：[https://me.i-i.me/melog/](https://me.i-i.me/melog/ "https://me.i-i.me/melog/")

## 安装

```bash
git clone https://github.com/yafoo/melog.git
npm i
```

## 运行

修改配置

```javascript
// config/app.js
app_debug: false, //关闭调试模式

// config/db.js
type      : 'mysql', // 数据库类型
host      : '127.0.0.1', // 服务器地址
database  : 'melog', // 数据库名
user      : 'root', // 数据库用户名
password  : '', // 数据库密码
port      : '3306', // 数据库连接端口
charset   : 'utf8', // 数据库编码默认采用utf8
prefix    : 'melog_' // 数据库表前缀
```

执行程序

```bash
node server.js
```

## 访问首页

```
http://127.0.0.1:3000
```

## 使用手册

使用手册：[https://me.i-i.me/melog/](https://me.i-i.me/melog/ "https://me.i-i.me/melog/")

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