FROM node:18-alpine
WORKDIR /app
# 1. Copiar los archivos de dependencias PRIMERO
COPY package.json package-lock.json ./
# 2. Instalar EXACTAMENTE lo que dice package-lock.json
RUN npm ci
# 3. Copiar todo el código del proyecto
COPY . .
# 4. Compilar TypeScript (si tu package.json tiene script 'build')
RUN npm run build
# 5. Exponer puerto y ejecutar
EXPOSE 3000
CMD ["npm", "start"]