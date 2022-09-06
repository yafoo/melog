#! /bin/bash
[ ! -f config/app.js ] && cp config.demo/app.js config/app.js
[ ! -f config/cache.js ] && cp config.demo/cache.js config/cache.js
[ ! -f config/db.js ] && cp config.demo/db.js config/db.js
[ ! -f config/routes.js ] && cp config.demo/routes.js config/routes.js
[ ! -f config/view.js ] && cp config.demo/view.js config/view.js
node server.js