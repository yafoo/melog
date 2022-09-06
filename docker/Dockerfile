# syntax=docker/dockerfile:1

FROM node:12-alpine
ENV NODE_ENV=production

EXPOSE 3003

WORKDIR /melog
COPY . .
COPY config config.demo
RUN npm i --production

CMD [ "sh", "docker/Run.sh" ]