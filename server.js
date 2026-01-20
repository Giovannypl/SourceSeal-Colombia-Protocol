const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint principal
app.get('/', (req, res) => {
    res.json({
        message: 'SourceSeal Colombia Protocol V1.2',
        status: 'ACTIVE',
        timestamp: new Date().toISOString(),
        endpoints: ['/', '/health'],
        deployed: true
    });
});

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('✅ SourceSeal Colombia Protocol V1.2 funcionando');
    console.log(`🌐 Puerto: ${PORT}`);
    console.log(`🕐 Iniciado: ${new Date().toISOString()}`);
});