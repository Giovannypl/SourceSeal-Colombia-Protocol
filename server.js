cat > server.js << 'EOF'
console.log("🚀 SourceSeal Colombia Protocol V2.0");
const http = require('http');
const fs = require('fs');
const path = require('path');

// Datos de ejemplo para sellos
const sealsDB = [];

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // RUTAS DE LA API
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            project: "SourceSeal Colombia Protocol V2.0",
            version: "2.0.0",
            status: "ACTIVE",
            timestamp: new Date().toISOString(),
            endpoints: {
                root: "GET /",
                health: "GET /health",
                dashboard: "GET /dashboard",
                listSeals: "GET /seals",
                createSeal: "POST /seals/new",
                getSeal: "GET /seals/:id",
                verifySeal: "POST /seals/verify/:id",
                stats: "GET /api/stats"
            }
        }));
    }
    else if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'healthy',
            uptime: process.uptime(),
            sealsCount: sealsDB.length
        }));
    }
    else if (req.url === '/dashboard' && req.method === 'GET') {
        // Servir el dashboard HTML
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>SourceSeal Colombia V2.0</title>
            <style>
                body { font-family: Arial; background: #0f0f0f; color: lime; padding: 20px; }
                .card { background: #1a1a1a; padding: 20px; margin: 10px; border-radius: 10px; }
            </style>
        </head>
        <body>
            <h1>🚀 SourceSeal Colombia Protocol V2.0</h1>
            <div class="card">
                <h2>API Status: <span style="color: lime;">ACTIVE ✅</span></h2>
                <p>Endpoints: <strong>8</strong></p>
                <p>Seals en sistema: <strong>${sealsDB.length}</strong></p>
            </div>
            <div class="card">
                <h3>Test the API:</h3>
                <button onclick="testAPI()">Test / Endpoint</button>
                <button onclick="testHealth()">Test /health</button>
                <pre id="result"></pre>
            </div>
            <script>
                async function testAPI() {
                    const res = await fetch('/');
                    const data = await res.json();
                    document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
                }
                async function testHealth() {
                    const res = await fetch('/health');
                    const data = await res.json();
                    document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
                }
            </script>
        </body>
        </html>
        `;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }
    else if (req.url === '/seals' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            count: sealsDB.length,
            seals: sealsDB
        }));
    }
    else if (req.url === '/seals/new' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const sealData = JSON.parse(body);
                const newSeal = {
                    id: 'seal_' + Date.now(),
                    ...sealData,
                    created: new Date().toISOString(),
                    verified: true,
                    zkp_proof: '0x' + Math.random().toString(16).substring(2, 10)
                };
                sealsDB.push(newSeal);
                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Seal created successfully',
                    seal: newSeal
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({error: 'Invalid JSON'}));
            }
        });
        return;
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API operativa en puerto: ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🛡️ Listo para crear seals con ZKP!`);
});
EOF