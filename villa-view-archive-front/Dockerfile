# Étape 1 - Build du frontend
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 - Serveur Nginx
FROM nginx:alpine

# Copie le build React
COPY --from=build /app/dist /usr/share/nginx/html

# 🧠 Ajout d’un fichier de config personnalisé
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
