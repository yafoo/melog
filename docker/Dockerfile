# syntax=docker/dockerfile:1

FROM node:20-alpine
ENV NODE_ENV=production

EXPOSE 3003
VOLUME /melog/config
VOLUME /melog/public/upload

WORKDIR /melog
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
COPY config config.demo

CMD [ "sh", "docker/Run.sh" ]
