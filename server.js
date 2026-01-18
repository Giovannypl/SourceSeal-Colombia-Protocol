const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANTE: Servir archivos estáticos de la carpeta 'public'
app.use(express.static('public'));

// Tu API sigue funcionando en /api
app.get('/api/status', (req, res) => {
    res.json({
        message: 'SourceSeal Colombia Protocol V1.2',
        status: 'ACTIVE',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        endpoints: {
            health: '/api/health',
            zkp: '/api/zkp',
            honeytokens: '/api/honeytokens'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/api/zkp', (req, res) => {
    res.json({
        protocol: 'Zero-Knowledge Proofs',
        shards: [
            { id: 'COL', status: 'active', last_verified: new Date().toISOString() },
            { id: 'UE', status: 'active', last_verified: new Date().toISOString() }
        ],
        commitments: 5,
        verification_time: '~2.3s'
    });
});

app.get('/api/honeytokens', (req, res) => {
    res.json({
        total_tokens: 5,
        active: 5,
        triggered: 0,
        last_trigger: null,
        monitoring: '24/7'
    });
});

// Ruta para compatibilidad (opcional)
app.get('/', (req, res) => {
    // Redirige al index.html que ya está siendo servido por express.static
    // O puedes enviar el mismo JSON para API requests
    if (req.headers['content-type'] === 'application/json' || 
        req.query.format === 'json') {
        res.json({
            message: 'SourceSeal Colombia Protocol V1.2',
            status: 'ACTIVE',
            timestamp: new Date().toISOString(),
            ui_available: true,
            documentation: 'Visita la interfaz web en esta misma URL'
        });
    } else {
        // El static middleware ya sirve index.html
        // Esta ruta es solo para el JSON API
        res.redirect('/');
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SourceSeal ejecutándose en puerto ${PORT}`);
    console.log(`🌐 Interfaz web: https://sourcesealcolombiaprotocol.vercel.app`);
    console.log(`📡 API disponible en: /api/status, /api/health, etc.`);
});