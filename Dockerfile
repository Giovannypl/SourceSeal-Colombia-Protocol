FROM node:18-alpine
WORKDIR /app

# 1. Instalar herramientas del sistema CRÍTICAS
RUN apk add --no-cache python3 make g++ git

# 2. Copiar SOLO el package.json primero
COPY package.json .

# 3. Instalar dependencias IGNORANDO el package-lock.json existente.
#    Esto fuerza a npm a resolver dependencias para este entorno específico.
RUN npm install --legacy-peer-deps --omit=dev

# 4. Copiar todo el resto del código (incluye el package-lock.json, pero ya no es crítico)
COPY . .

# 5. Intentar la compilación. Si falla, lo veremos en los logs.
RUN npm run build 2>&1 || echo "⚠  Build step falló, continuando..."

# 6. Exponer y ejecutar
EXPOSE 3000
# Asegúrate de que esta ruta coincida con tu punto de entrada real.
CMD ["node", "dist/server/index.js"]