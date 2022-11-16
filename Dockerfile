FROM node:alpine
RUN apk add --no-cache socat
WORKDIR /app
RUN npm i -g devdb-cli
ENTRYPOINT ["devdb"]