cat > server.js << 'EOF'
console.log("🔄 Iniciando reconstrucción...");

const express = require('express');
const app = express();
const PORT = 3000;

// Solo 1 ruta para probar
app.get('/', (req, res) => {
    res.json({
        message: "✅ ¡RECONSTRUIDO! SourceSeal V1.2",
        status: "ACTIVE",
        timestamp: new Date().toISOString(),
        note: "Proyecto reconstruido después del reinicio"
    });
});