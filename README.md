<p align="center">
  <img src="./public/logo.png" alt="melog" width="120">
</p>

<h1 align="center">melog</h1>

<p align="center">
  一个基于 <a href="https://github.com/yafoo/jj.js">jj.js</a> 开发的简单轻量级博客系统
</p>

<p align="center">
  <a href="https://github.com/yafoo/melog"><img src="https://img.shields.io/badge/GitHub-melog-181717?logo=github" alt="GitHub"></a>
  <a href="https://gitee.com/yafu/melog"><img src="https://img.shields.io/badge/Gitee-melog-C71D23?logo=gitee" alt="Gitee"></a>
  <a href="https://js.i-i.me/"><img src="https://img.shields.io/badge/Demo-在线演示-0969da" alt="Demo"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green" alt="License"></a>
</p>

---

代码极简，无需编译，方便二次开发。

## ✨ 特性

- **极速** — 轻量内核，响应迅速
- **简洁** — 前台无框架依赖，移动优先，自适应 PC
- **易用** — 基于 jj.js（类 ThinkPHP）经典 MVC 架构，上手快，方便二次开发
- **安全** — 后台目录可自定义，密码重试次数限制
- **灵活** — 支持更换导航风格（cms / blog），支持主题切换，自定义主题可共用默认主题文件
- **专题** — 内置专题功能，轻松定制个性页面
- **编辑** — Markdown 实时预览，支持手机端，支持截图及图片粘贴上传

## 🔧 运行环境

| 环境 | 要求 |
|------|------|
| Node.js | >= 20.19.0 |
| 数据库 | MySQL >= 5.5 或 SQLite |

## 🚀 快速开始

### 1. Docker 部署（推荐）

```bash
# 拉取镜像
docker pull yafoo/melog

# 运行容器
docker run -p 3003:3003 --restart unless-stopped --name melog -d yafoo/melog

# 持久化配置与上传目录
docker run -p 3003:3003 --restart unless-stopped --name melog -d \
  -v $PWD/melog/config:/melog/config \
  -v $PWD/melog/upload:/melog/public/upload \
  yafoo/melog
```

### 2. npx 部署

```bash
# 创建博客项目
npx melog init myblog

# 进入项目目录
cd myblog

# 启动服务
npx melog start
```

> 💡 不指定目录名时，会提示输入，直接回车则在当前目录初始化。

### 3. Git 部署

```bash
git clone https://github.com/yafoo/melog.git
cd melog
npm install

# 启动服务（默认端口 3003）
node server.js
```

> 💡 也可以直接到 [GitHub](https://github.com/yafoo/melog) 或 [Gitee](https://gitee.com/yafu/melog) 下载压缩包。

### 4. 初始化配置

浏览器打开 `http://127.0.0.1:3003/install`，配置数据库并点击安装即可完成部署。

> 💡 如遇问题，可将 `/config/app.js` 中的 `app_debug` 设为 `true` 开启调试模式，重启后在控制台查看运行日志。

## 📖 使用

| 页面 | 地址 |
|------|------|
| 前台首页 | `http://127.0.0.1:3003` |
| 后台管理 | `http://127.0.0.1:3003/admin` |

## ⚙️ Nginx 反向代理

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

## 🔗 相关链接

- **开发者博客**：[https://me.i-i.me/](https://me.i-i.me/)
- **jj.js 框架**：[GitHub](https://github.com/yafoo/jj.js) · [Gitee](https://gitee.com/yafu/jj.js)
- **爱主页导航**：[https://www.i-i.me/](https://www.i-i.me/)

## 📄 License

[MIT](LICENSE) © 雨思
