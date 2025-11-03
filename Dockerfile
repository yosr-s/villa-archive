# =========================
# Étape 1 : Build du frontend
# =========================
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY villa-view-archive-front/package*.json ./
RUN npm install
COPY villa-view-archive-front/ .
RUN npm run build

# =========================
# Étape 2 : Build du backend
# =========================
FROM node:18 AS backend
WORKDIR /app
COPY villa-archive-backend/package*.json ./
RUN npm install
COPY villa-archive-backend/ .
# Copier le build frontend dans le dossier public du backend
COPY --from=frontend /app/frontend/dist ./public

EXPOSE 4000
CMD ["node", "server.js"]
