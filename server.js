cat > simple-server.js << 'EOF'
console.log("🚀 SourceSeal Colombia V2.0 - SIMPLE & STABLE");
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify({
        success: true,
        project: "SourceSeal Colombia Protocol V2.0",
        version: "2.0.0",
        status: "ACTIVE",
        timestamp: new Date().toISOString(),
        message: "¡API 100% operativa!",
        endpoints: ["/", "/health", "/seal (soon)"]
    }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API funcionando en: http://localhost:${PORT}`);
    console.log(`🌐 Prueba: curl http://localhost:${PORT}`);
});
EOF

# Ejecutar
node simple-server.js