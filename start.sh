cat > start.sh << 'EOF'
#!/bin/bash
echo "========================================="
echo "🚀 INICIANDO SOURCE SEAL COLOMBIA..."
echo "========================================="

# Mata procesos anteriores (silenciosamente)
pkill -f node 2>/dev/null || true
pkill -f nodemon 2>/dev/null || true
sleep 2

# Usa un puerto diferente si 3000 está ocupado
PORT=3000
if ss -tuln | grep :$PORT > /dev/null; then
  PORT=4000
fi
if ss -tuln | grep :$PORT > /dev/null; then
  PORT=5000
fi
if ss -tuln | grep :$PORT > /dev/null; then
  PORT=8080
fi

echo "✅ Usando puerto: $PORT"
export PORT=$PORT

# Inicia el servidor
node server.js
EOF

chmod +x start.sh