FROM node:alpine

WORKDIR /app

# Copiez d'abord les fichiers de package pour profiter du cache des couches Docker
COPY package*.json ./

# Installez les dépendances, y compris les dépendances de développement pour `prisma`
RUN npm install

# Copiez le reste de l'application
COPY . .

# Générez le client Prisma
RUN npx prisma generate

# Compilez le projet TypeScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
