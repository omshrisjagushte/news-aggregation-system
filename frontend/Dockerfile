FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5000", "--strictPort"]
