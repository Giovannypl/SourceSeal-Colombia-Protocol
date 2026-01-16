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
RUN npm run build

# Verificar estructura
RUN ls -la dist/index.cjs && echo "✅ Build exitoso"

# Exponer puerto y ejecutar
EXPOSE 3000
CMD ["node", "dist/index.cjs"]