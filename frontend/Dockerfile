# frontend/Dockerfile
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Copie du package
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Serveur web léger pour la prod
RUN npm install -g serve

# Lancement du serveur
CMD ["serve", "-s", "build", "-l", "3000"]
