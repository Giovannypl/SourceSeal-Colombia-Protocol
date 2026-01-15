FROM node:18-alpine
WORKDIR /app

# 1. Instalar herramientas necesarias
RUN apk add --no-cache python3 make g++

# 2. Copiar y instalar dependencias
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 3. Copiar todo el código
COPY . .

# 4. Compilar TypeScript
RUN npm run build

# 5. Verificar que se creó el archivo principal
RUN ls -la dist/server/index.js && echo "✅ Build COMPLETADO con éxito"

# 6. Exponer puerto y ejecutar
EXPOSE 3000
CMD ["node", "dist/server/index.js"]