#!/bin/bash

set -e

echo "🚀 Starting deployment..."

NETWORK_NAME="app_network"
DOMAIN="bewerbung-test.generation-d.org"  

if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo "➕ Creating network: $NETWORK_NAME"
  docker network create "$NETWORK_NAME"
else
  echo "✔ Network already exists: $NETWORK_NAME"
fi

echo "📦 Ensuring volumes exist..."
docker volume create caddy_data >/dev/null
docker volume create caddy_config >/dev/null

echo "🐳 Starting frontend container..."
docker rm -f frontend >/dev/null 2>&1 || true

docker run -d \
  --name frontend \
  --network "$NETWORK_NAME" \
  -e NEXT_PUBLIC_SITE_URL="$DOMAIN" \
  -e NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -e NEXT_PUBLIC_LOGFLARE_API_TOKEN="$NEXT_PUBLIC_LOGFLARE_API_TOKEN" \
  -e NEXT_PUBLIC_LOGFLARE_CLIENT_TOKEN="$NEXT_PUBLIC_LOGFLARE_CLIENT_TOKEN" \
  -e NEXT_PUBLIC_TURNSTILE_SITE_KEY="$NEXT_PUBLIC_TURNSTILE_SITE_KEY" \
  -e SMTP_HOST="$SMTP_HOST" \
  -e SMTP_PORT="$SMTP_PORT" \
  -e SMTP_USER="$SMTP_USER" \
  -e SMTP_PASSWORD="$SMTP_PASSWORD" \
  -e TURNSTILE_SECRET_KEY="$TURNSTILE_SECRET_KEY" \
  -e SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  application-platform:latest

echo "🌐 Starting Caddy container..."
docker rm -f caddy >/dev/null 2>&1 || true

docker run -d \
  --name caddy \
  --network "$NETWORK_NAME" \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -v "/home/core/Caddyfile:/etc/caddy/Caddyfile" \
  -v caddy_data:/data \
  -v caddy_config:/config \
  -e DOMAIN="$DOMAIN" \
  caddy:latest

echo "✅ Deployment complete!"
echo "Frontend container: frontend"
echo "Caddy container: caddy"
