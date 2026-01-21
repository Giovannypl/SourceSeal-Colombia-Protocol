log("🚀 SOURCESEAL COLOMBIA V2.0 - PRODUCTION");
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': 'SourceSeal-ZKP'
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
});

const PORT = process.env.PORT || 9999;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API ZKP operativa en puerto: ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
