FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

# Ejecutar el seeder durante el build
RUN node src/seeds/menuSeeder.js || echo "Seeder falló o ya hay datos"

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001
RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 8003
CMD ["npm", "start"]