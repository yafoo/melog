# melog

![melog](https://me.i-i.me/static/images/melog_360.png "melog")

melog，一个基于jj.js(nodejs)构建的简单轻量级blog系统。代码极简，无需编译，方便二次开发。

仓库地址：[https://github.com/yafoo/melog](https://github.com/yafoo/melog "https://github.com/yafoo/melog")

码云镜像：[https://gitee.com/yafu/melog](https://gitee.com/yafu/melog "https://gitee.com/yafu/melog")

官网地址：[https://me.i-i.me/special/melog.html](https://me.i-i.me/special/melog.html "https://me.i-i.me/special/melog.html")

演示demo：[https://js.i-i.me/](https://js.i-i.me/ "https://js.i-i.me/")（后台：[/admin](https://js.i-i.me/admin "https://js.i-i.me/admin")，账号：`melog@i-i.me`，密码：`123456`）

## 特性

1. 速度极快
2. 轻量，前台无框架依赖，移动优先，自适应pc
3. 简单，基于jj.js（类thinkphp）经典mvc框架，方便二次开发
4. 安全，后台目录可自定义，密码重试次数限制
5. 支持更换导航风格（cms或blog）
6. 支持更换主题，自定义主题可以共用默认主题文件
7. 专题功能，可以定制个性页面
8. Markdown编辑、实时预览，支持手机端，支持截图、图片文件粘贴上传

## 运行环境
nodejs >= v12
mysql >= v5.5

## 安装

### 1、程序部署

- Docker方式部署

```bash
# 镜像拉取
docker pull yafoo/melog

# 容器运行
docker run -p 3003:3003 --restart unless-stopped --name melog -d yafoo/melog

# 容器运行（配置文件、站点数据保存到宿主机）
docker run -p 3003:3003 --restart unless-stopped --name melog -d -v $PWD/melog/config:/melog/config -v $PWD/melog/upload:/melog/public/upload yafoo/melog
```

- Git方式部署

```bash
# 也可以直接到github或gitee上下载压缩文件
git clone https://github.com/yafoo/melog.git
cd melog
npm i

# 运行程序，系统默认运行在3003端口
node server.js
```

### 2、配置数据库

- 浏览器打开网址 `http://127.0.0.1:3003/install`，配置并点击安装

> 提示：如果网址打开出错，或者安装失败，可以修改 `/config/app.js` 文件，将 `app_debug` 设置为 `true`，打开调试模式，重启程序并重新安装，在控制台可以看到运行日志。

## 访问首页

```
http://127.0.0.1:3003
```

## 访问后台

- 后台地址：`http://127.0.0.1:3003/admin`  
- 默认账号：`melog@i-i.me`  
- 默认密码：`123456`

> 提示：登录后请及时在后台修改账号密码

## 旧版升级

### 1、V2版本升级

v2版本升级v3，请手工运行 `v2_to_v3.sql` 文件升级数据库，然后创建文件 `/config/install.js`，内容如下：

```javascript
module.exports = {
    install: true
};
```

### 2、V3.0版本升级

系统从v3.1版开始支持系统安装。v3.0版升级后，也需手工创建 `/config/install.js` 文件，内容同v2升级。

## 其他

#### 开发者博客
-  [https://me.i-i.me/](https://me.i-i.me/ "https://me.i-i.me/")

#### jj.js MVC框架
-  Github: [https://github.com/yafoo/jj.js](https://github.com/yafoo/jj.js "https://github.com/yafoo/jj.js")
-  Gitee: [https://gitee.com/yafu/jj.js](https://gitee.com/yafu/jj.js "https://gitee.com/yafu/jj.js")

#### 爱主页网址导航
-  [https://www.i-i.me/](https://www.i-i.me/ "https://www.i-i.me/")

## Nginx代理设置

```nginx
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