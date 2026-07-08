FROM node:24 AS build

ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_LOGFLARE_API_TOKEN
ARG NEXT_PUBLIC_LOGFLARE_CLIENT_TOKEN
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci --ignore-scripts

COPY frontend/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

FROM caddy:2 AS reverse_proxy

COPY Caddyfile /etc/caddy/Caddyfile
