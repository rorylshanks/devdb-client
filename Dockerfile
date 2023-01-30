FROM node:alpine
RUN apk add --no-cache socat
WORKDIR /app
COPY entrypoint.sh /entrypoint.sh
RUN npm i -g devdb-cli
ENTRYPOINT ["/entrypoint.sh"]