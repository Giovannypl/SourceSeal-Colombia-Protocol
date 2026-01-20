cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Base de datos en memoria
let seals = [];
let sealCounter = 1;

// 1. Home
app.get('/', (req, res) => {
  res.json({
    project: "SourceSeal Colombia Protocol",
    version: "V1.2",
    status: "ACTIVE",
    endpoints: [
      "GET  /",
      "GET  /health",
      "GET  /seals",
      "POST /seals/new",
      "GET  /seals/:id",
      "POST /seals/verify/:id"
    ]
  });
});

// 2. Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    seals_count: seals.length
  });
});

// 3. Get all seals
app.get('/seals', (req, res) => {
  res.json({
    total: seals.length,
    seals: seals
  });
});

// 4. NEW SEAL - ¡EL MÁS IMPORTANTE!
app.post('/seals/new', (req, res) => {
  const { documentHash, owner, metadata } = req.body;
  
  if (!documentHash) {
    return res.status(400).json({ error: "documentHash es requerido" });
  }
  
  const newSeal = {
    id: sealCounter++,
    documentHash: documentHash,
    owner: owner || "Anonymous",
    metadata: metadata || {},
    status: "CREATED",
    timestamp: new Date().toISOString(),
    verified: false
  };
  
  seals.push(newSeal);
  
  console.log(`✅ New Seal #${newSeal.id} creado para ${newSeal.owner}`);
  
  res.status(201).json({
    success: true,
    message: "✅ Seal creado exitosamente",
    seal: newSeal
  });
});

// 5. Get specific seal
app.get('/seals/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const seal = seals.find(s => s.id === id);
  
  if (!seal) {
    return res.status(404).json({ error: "Seal no encontrado" });
  }
  
  res.json(seal);
});

// 6. Verify seal
app.post('/seals/verify/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const sealIndex = seals.findIndex(s => s.id === id);
  
  if (sealIndex === -1) {
    return res.status(404).json({ error: "Seal no encontrado" });
  }
  
  // Simulación de verificación
  const isVerified = Math.random() > 0.2;
  
  seals[sealIndex].verified = isVerified;
  seals[sealIndex].verificationTimestamp = new Date().toISOString();
  
  res.json({
    verified: isVerified,
    message: isVerified ? "✅ Seal verificado" : "❌ Falló verificación",
    sealId: id
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  🎉 ¡SERVIDOR LISTO PARA NEW SEAL! 🎉
  
  🌐 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co
  📍 Puerto: ${PORT}
  
  📋 ENDPOINTS:
  1. Home: GET /
  2. Health: GET /health
  3. List seals: GET /seals
  4. New Seal: POST /seals/new
  5. Get seal: GET /seals/{id}
  6. Verify: POST /seals/verify/{id}
  `);
});
EOF