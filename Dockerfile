FROM node:24 AS build

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci --ignore-scripts

COPY frontend/ .

RUN npm run build

COPY start.sh .

RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]

FROM caddy:2 AS reverse_proxy

COPY Caddyfile /etc/caddy/Caddyfile

