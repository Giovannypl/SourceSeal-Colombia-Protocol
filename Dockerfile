# Dockerfile optimizado para SourceSeal
FROM node:18-alpine AS builder

RUN apk add --no-cache git curl bash build-base python3 linux-headers
RUN npm install -g circom@2.1.5 snarkjs@0.7.0

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY circuits/ ./circuits/
RUN cd circuits && \
    circom integrity.circom --r1cs --wasm --sym && \
    echo "✔ Circuito compilado"

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server/index.js"]