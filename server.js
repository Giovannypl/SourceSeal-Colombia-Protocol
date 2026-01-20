const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        message: 'SourceSeal Colombia Protocol V1.2',
        status: 'ACTIVE',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(PORT, () => {
    console.log('✅ SourceSeal Colombia Protocol V1.2 funcionando');
    console.log(`🌐 Puerto: ${PORT}`);
});