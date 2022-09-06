## 镜像制作
```bash
docker build -f ./docker/Dockerfile --tag yafoo/melog .
```

## 镜像发布
```bash
docker tag yafoo/melog yafoo/melog:version
docker push yafoo/melog:version
docker push yafoo/melog
```

## 容器运行
```bash
docker run -p 3003:3003 --restart unless-stopped --name melog -d yafoo/melog
```

## 容器运行（配置文件、站点数据保存到宿主机）
```bash
docker run -p 3003:3003 --restart unless-stopped --name melog -d -v $PWD/melog/config:/melog/config -v $PWD/melog/upload:/melog/public/upload yafoo/melog
```