# Fase 1: Build dell'applicazione
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase 2: Service con Nginx
FROM nginx:stable-alpine
# Copiamo la build di Vite nella cartella di Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copiamo la configurazione personalizzata di Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]