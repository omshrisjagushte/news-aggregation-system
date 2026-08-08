# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY frontend/.
RUN npm run build


# Serve stage  
FROM node:18-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
EXPOSE $PORT
CMD sh -c "serve -s dist -I $PORT"
