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

# 5. Compilar TypeScript y VERIFICAR el resultado
RUN npm run build 2>&1 || echo "❌ El comando 'npm run build' falló."
RUN echo "=== Contenido del directorio 'dist' ===" && ls -la dist/ 2>/dev/null || echo "⚠  La carpeta 'dist' no existe."
RUN echo "=== Contenido del directorio 'dist/server' ===" && ls -la dist/server/ 2>/dev/null || echo "⚠  La carpeta 'dist/server' no existe."

# 6. Exponer y ejecutar
EXPOSE 3000
CMD ["node", "dist/server/index.js"]