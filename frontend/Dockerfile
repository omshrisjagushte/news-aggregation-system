FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "vite preview --host 0.0.0.0 --port $PORT --allowedHosts all"]
