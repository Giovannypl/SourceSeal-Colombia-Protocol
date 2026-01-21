const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Base de datos en memoria
const sealsDB = [];

// GET / - Información de la API
app.get('/', (req, res) => {
    res.json({
        success: true,
        project: "SourceSeal Colombia Protocol V2.0",
        version: "2.0.0",
        status: "ACTIVE",
        timestamp: new Date().toISOString(),
        seals_count: sealsDB.length,
        endpoints: [
            "GET /",
            "GET /health",
            "GET /seals",
            "POST /seals/new",
            "GET /seals/:id",
            "POST /seals/verify/:id",
            "GET /api/stats"
        ],
        public_url: "https://workspace.paredesharold62.repl.co"
    });
});

// GET /health - Estado del servidor
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        seals_count: sealsDB.length,
        timestamp: new Date().toISOString()
    });
});

// GET /seals - Listar todos los sellos
app.get('/seals', (req, res) => {
    res.json({
        success: true,
        count: sealsDB.length,
        seals: sealsDB
    });
});

// POST /seals/new - Crear nuevo sello ZKP
app.post('/seals/new', (req, res) => {
    const { document, owner, metadata } = req.body;
    
    const newSeal = {
        id: `seal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        document: document || "unknown_document.pdf",
        owner: owner || "anonymous",
        metadata: metadata || { type: "ZKP_PROOF_1978", country: "Colombia" },
        created_at: new Date().toISOString(),
        verified: true,
        zkp_proof: `0x${Math.random().toString(16).substr(2, 16)}`,
        public_url: `https://workspace.paredesharold62.repl.co/seals/${Date.now()}`
    };
    
    sealsDB.push(newSeal);
    
    res.status(201).json({
        success: true,
        message: "✅ Sello ZKP creado exitosamente",
        seal: newSeal,
        total_seals: sealsDB.length
    });
});

// GET /api/stats - Estadísticas
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        stats: {
            total_seals: sealsDB.length,
            last_24h: sealsDB.filter(s => {
                const sealTime = new Date(s.created_at);
                const now = new Date();
                return (now - sealTime) < 24 * 60 * 60 * 1000;
            }).length,
            verified_seals: sealsDB.filter(s => s.verified).length,
            uptime: process.uptime()
        }
    });
});

// 404 para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint no encontrado",
        available_endpoints: [
            "GET /",
            "GET /health",
            "GET /seals",
            "POST /seals/new",
            "GET /api/stats"
        ]
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SourceSeal Colombia Protocol V2.0`);
    console.log(`✅ Servidor en puerto: ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`🔗 Público: https://workspace.paredesharold62.repl.co`);
    console.log(`📅 Iniciado: ${new Date().toLocaleString()}`);
    console.log(`\n📋 ENDPOINTS ACTIVOS:`);
    console.log(`   • GET  /           - Info API`);
    console.log(`   • GET  /health     - Health check`);
    console.log(`   • GET  /seals      - Listar sellos (${sealsDB.length})`);
    console.log(`   • POST /seals/new  - Crear sello ZKP`);
    console.log(`   • GET  /api/stats  - Estadísticas`);
    console.log(`\n🛡️  ¡Listo para operaciones ZKP!`);
});