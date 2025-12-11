FROM node:24

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci --ignore-scripts

COPY frontend/ .

RUN npm run build

COPY start.sh .

RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]
