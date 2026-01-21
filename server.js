console.log("🚀 SourceSeal Colombia Protocol V2.0 - CORREGIDO");
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            project: "SourceSeal Colombia Protocol V2.0",
            version: "2.0.0",
            status: "ACTIVE",
            timestamp: new Date().toISOString(),
            message: "¡API 100% operativa!",
            endpoints: [
                "GET /",
                "GET /health", 
                "GET /seals",
                "POST /seals/new",
                "GET /seals/:id",
                "POST /seals/verify/:id",
                "GET /api/stats"
            ]
        }));
    }
    else if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }));
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API operativa en puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Prueba: curl http://localhost:${PORT}`);
});
