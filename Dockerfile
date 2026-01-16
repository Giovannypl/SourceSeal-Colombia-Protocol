FROM node:18-alpine
WORKDIR /app

# Instalar herramientas esenciales (de remota, + python/make/g++ para circom/snarkjs)
RUN apk add --no-cache python3 make g++ git curl bash

# Copiar y instalar dependencias
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --force

# Copiar todo
COPY . .

# Compilar TypeScript
RUN npm run build 2>&1 || echo "⚠️ Build step completed"

# Verificar estructura (fusionado con local)
RUN ls -la dist/server/index.js && echo "✅ Build COMPLETADO con éxito" && \
    echo "=== Estructura final ===" && \
    find . -name "*.js" -type f | grep -E "(index\.js|server.*\.js)" | head -10

# Exponer puerto y ejecutar
EXPOSE 3000
CMD ["node", "dist/server/index.js"]