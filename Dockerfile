FROM node:alpine
RUN apk add --no-cache socat stunnel
WORKDIR /app
COPY entrypoint.sh /entrypoint.sh
RUN npm i -g devdb-cli
ENTRYPOINT ["/entrypoint.sh"]