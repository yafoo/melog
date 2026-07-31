#! /bin/bash
[ ! -f config/app.js ] && cp config.demo/app.js config/app.js
[ ! -f config/db.js ] && cp config.demo/db.js config/db.js
[ ! -f config/routes.js ] && cp config.demo/routes.js config/routes.js
[ ! -f config/view.js ] && cp config.demo/view.js config/view.js
if [ ! -d "node_modules" ]; then
  echo "安装依赖"
  npm i --registry=https://registry.npmmirror.com
else
  echo "依赖已安装"
fi
echo "启动服务"
node server.js