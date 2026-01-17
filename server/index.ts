import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Health check para Railway (por si acaso)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'SourceSeal Protocol V1.2',
        timestamp: new Date().toISOString()
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'SourceSeal Colombia Protocol',
        version: '1.2.0',
        endpoints: ['/', '/health']
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SourceSeal ejecutándose en puerto ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});