# melog

![melog](https://me.i-i.me/static/images/melog_360.png "melog")

melog，一个基于jj.js(nodejs)构建的简单轻量级blog系统。代码极简，无需编译，方便二次开发。

仓库地址：[https://github.com/yafoo/melog](https://github.com/yafoo/melog "https://github.com/yafoo/melog")

码云镜像：[https://gitee.com/yafu/melog](https://gitee.com/yafu/melog "https://gitee.com/yafu/melog")

官网地址：[https://me.i-i.me/special/melog.html](https://me.i-i.me/special/melog.html "https://me.i-i.me/special/melog.html")

演示demo：[https://js.i-i.me/](https://js.i-i.me/ "https://js.i-i.me/")（后台：[/admin](https://js.i-i.me/admin "https://js.i-i.me/admin")，账号：`melog@i-i.me`，密码：`123456`）

## 特性

1. 速度极快，超越大部分博客程序
2. 轻量，前台无框架依赖，移动优先，自适应pc
3. 简单，基于jj.js（类thinkphp）经典mvc框架，方便二次开发
4. 安全，后台目录可自定义，密码重试次数限制
5. 支持更换导航风格（cms或blog）
6. 支持更换主题，自定义主题可以共用默认主题文件
7. 专题功能，可以定制个性页面
8. Markdown编辑，支持实时预览，支持手机端，支持截图、图片文件粘贴上传

## 运行环境
nodejs >= v12
mysql >= 5.3

## 安装

```bash
# 也可以直接到github或gitee上下载压缩文件
git clone https://github.com/yafoo/melog.git
cd melog
npm i
```

## 运行

### 1. 修改配置

修改`/config/app.js`文件，关闭调试模式。如遇运行失败，请打开调试模式，查看错误提示。

```javascript
app_debug: false,
```

修改`/config/db.js`文件，配置数据库

```
type      : 'mysql', // 数据库类型
host      : '127.0.0.1', // 服务器地址
database  : 'melog', // 数据库名
user      : 'root', // 数据库用户名
password  : '', // 数据库密码
port      : '3306', // 数据库连接端口
charset   : 'utf8', // 数据库编码默认采用utf8
prefix    : 'melog_' // 数据库表前缀
```

### 2. 导入数据

将根目录下`melog.sql`文件导入数据库。

> V2版本升级V3，请运行`v2_to_v3.sql`数据库升级文件。

### 3. 运行程序

```bash
node server.js
```

## 访问首页

```
http://127.0.0.1:3003
```

## 访问后台

后台地址：`http://127.0.0.1:3003/admin`  
默认账号：`melog@i-i.me`  
默认密码：`123456`

## 其他

### 开发者博客
[https://me.i-i.me/](https://me.i-i.me/ "https://me.i-i.me/")

### jj.js MVC框架
Github: [https://github.com/yafoo/jj.js](https://github.com/yafoo/jj.js "https://github.com/yafoo/jj.js")

Gitee: [https://gitee.com/yafu/jj.js](https://gitee.com/yafu/jj.js "https://gitee.com/yafu/jj.js")

### 爱主页网址导航
[https://www.i-i.me/](https://www.i-i.me/ "https://www.i-i.me/")

### Nginx代理设置

```
location / {
    proxy_pass       http://127.0.0.1:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## License

[MIT](LICENSE)