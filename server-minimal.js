import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({
    project: 'SourceSeal v2.0',
    status: '✅ ALIVE',
    shard: 'COL-01',
    message: 'Deployment successful via minimal server',
    features: ['ZKP Ready', 'Law 1978 Compliance', 'Multi-shard'],
    next: 'Full deployment in progress'
  });
});

app.get('/health', (req, res) => res.send('OK'));
app.get('/api/status', (req, res) => res.json({ timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`🚀 Minimal SourceSeal running on port ${PORT}`);
});