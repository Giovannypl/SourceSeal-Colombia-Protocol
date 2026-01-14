# Dockerfile optimizado para SourceSeal v2.0 - Node.js + TypeScript + Circom
# Multi-stage build para seguridad y tamaño mínimo

# ========== ETAPA 1: BUILDER =======
FROM node:18-alpine AS builder

# Instalar dependencias de sistema para circom
RUN apk add --no-cache \
    git \
    curl \
    bash \
    build-base \
    python3 \
    linux-headers

# Instalar circom y snarkjs GLOBALMENTE
RUN npm install -g circom@2.1.5 snarkjs@0.7.0

WORKDIR /app

# 1. Copiar package.json e instalar dependencias Node.js
COPY package*.json ./
RUN npm ci

# 2. Copiar y compilar circuitos circom
COPY circuits/ ./circuits/
RUN cd circuits && \
    circom integrity.circom --r1cs --wasm --sym && \
    echo "✔ Circuito circom compilado"

# 3. Configurar ceremonia de confianza (trusted setup simulado)
RUN cd circuits && \
    snarkjs powersoftau new bn128 12 pot12_0000.ptau && \
    snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v && \
    snarkjs powersoftau verify pot12_0001.ptau && \
    snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau && \
    snarkjs groth16 setup integrity.r1cs pot12_final.ptau integrity_0000.zkey && \
    snarkjs zkey contribute integrity_0000.zkey integrity_0001.zkey --name="Contribución MinTIC" -v && \
    snarkjs zkey export verificationkey integrity_0001.zkey verification_key.json && \
    echo "✅ Trusted setup completado"

# 4. Copiar y compilar TypeScript
COPY . .
RUN npm run build

# ========== ETAPA 2: PRODUCCIÓN =====
FROM node:18-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar solo lo necesario desde builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/circuits ./circuits
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Cambiar a usuario no-root
USER nodejs

# Variables de entorno para SourceSeal
ENV NODE_ENV=production
ENV SHARD=COL-01
ENV ZKP_CIRCUITS_PATH=/app/circuits
ENV PORT=3000

EXPOSE 3000

# Health check para Kubernetes
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Comando de inicio optimizado
CMD ["node", "--max-old-space-size=512", "dist/server.js"]