const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({
    project: 'SourceSeal v2.0',
    status: '🚀 DEPLOYED & RUNNING',
    shard: 'COL-01',
    infrastructure: 'Multi-shard (Colombia & EU)',
    deployment: 'Railway.app',
    timestamp: new Date().toISOString(),
    message: 'Despliegue completado exitosamente'
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SourceSeal ejecutándose en puerto ${PORT}`);
  console.log(`🌐 URL: https://sourceseal-colombia-protocol-production.up.railway.app`);
});
