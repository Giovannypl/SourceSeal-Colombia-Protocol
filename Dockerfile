FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install express
COPY server-minimal.js .
EXPOSE 5000
CMD ["node", "server-minimal.js"]