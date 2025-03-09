FROM node:alpine
RUN apk add --no-cache socat stunnel


WORKDIR /usr/lib/node_modules/devdb-cli
COPY . .
RUN npm i && ln -s /usr/lib/node_modules/devdb-cli/app.js /usr/bin/devdb
WORKDIR /app
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]