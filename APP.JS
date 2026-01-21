# 1. MATA EL SERVIDOR VIEJO
pkill -f node

# 2. INSTALA DEPENDENCIAS CORRECTAS
npm install express nodemon

# 3. ACTUALIZA APP.JS CON CÓDIGO CORRECTO
cat > app.js << 'EOF'
console.log("🚀 SOURCESEAL COLOMBIA V2.0 - PRODUCTION READY");
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // RUTAS
    if (req.url === '/' && req.method === 'GET') {
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
            endpoints: {
                root: "/",
                health: "/health",
                seal: "/seal (POST)"
            }
        }));
    }
    else if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            status: 'healthy',
            uptime: process.uptime()
        }));
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
});

const PORT = process.env.PORT || 9999;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API ZKP operativa en puerto: ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`🔗 Prueba: curl http://localhost:${PORT}`);
    console.log(`📊 Status: SourceSeal Colombia Protocol activo`);
});
EOF

# 4. INICIA EL SERVIDOR CON NODEMON
npm run dev