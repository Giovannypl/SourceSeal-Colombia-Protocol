const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static('public'));

// Ruta principal - HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    message: 'SourceSeal Colombia Protocol V1.2',
    status: 'ACTIVE',
    ley: '1978-COL',
    zkp_shards: ['COL', 'UE'],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SourceSeal ejecutándose en puerto ${PORT}`);
});