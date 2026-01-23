cat > start.sh << 'EOF'
#!/bin/bash

echo "🔄 LIMPIANDO PROCESOS ANTERIORES..."
# Mata TODOS los procesos que puedan interferir
pkill -9 node 2>/dev/null || true
pkill -9 nodemon 2>/dev/null || true
pkill -9 npm 2>/dev/null || true
pkill -9 server 2>/dev/null || true
pkill -f "server.js" 2>/dev/null || true

echo "⏳ ESPERANDO 3 SEGUNDOS..."
sleep 3

echo "🚀 INICIANDO SOURCE SEAL COLOMBIA..."
echo "🔍 Buscando puerto disponible..."

# Usa un puerto dinámico
export PORT=0  # Esto hará que Express use un puerto aleatorio disponible

# Inicia el servidor
npm run dev
EOF

chmod +x start.sh