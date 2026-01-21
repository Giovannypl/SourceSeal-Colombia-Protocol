log("🚀 SourceSeal Colombia Protocol V2.0");

const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));  // sirve tu dashboard HTML/CSS/JS

// Catch-all para SPA (reactividad del dashboard)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(cors());
app.use(express.json());

// Base de datos en memoria
let seals = [];
let nextId = 1;

// ===== ENDPOINTS PRINCIPALES =====

// 1. Home
app.get('/', (req, res) => {
  res.json({
    project: "SourceSeal Colombia Protocol",
    version: "V2.0",
    status: "ACTIVE",
    description: "Sistema de sellado digital con Zero-Knowledge Proofs",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET  /",
      "GET  /health",
      "GET  /seals",
      "POST /seals/new",
      "GET  /seals/:id",
      "POST /seals/verify/:id",
      "GET  /api/stats"
    ]
  });
});

// 2. Health check
app.get('/health', (req, res) => {
  res.json({
    status: "HEALTHY",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    sealsCount: seals.length,
    timestamp: new Date().toISOString()
  });
});

// 3. Listar todos los seals
app.get('/seals', (req, res) => {
  res.json({
    success: true,
    count: seals.length,
    seals: seals
  });
});

// 4. ¡NEW SEAL! - El más importante
app.post('/seals/new', (req, res) => {
  const { documentHash, owner, metadata } = req.body;
  
  if (!documentHash) {
    return res.status(400).json({
      success: false,
      error: "El campo 'documentHash' es requerido"
    });
  }
  
  const newSeal = {
    id: nextId++,
    documentHash: documentHash,
    owner: owner || "Anonymous",
    metadata: metadata || {
      documentType: "contract",
      country: "Colombia",
      zkpEnabled: true
    },
    status: "CREATED",
    createdAt: new Date().toISOString(),
    verified: false,
    zkpProof: null
  };
  
  seals.push(newSeal);
  
  console.log(`✅ New Seal creado: #${newSeal.id} - ${newSeal.owner}`);
  
  res.status(201).json({
    success: true,
    message: "✅ New Seal creado exitosamente",
    seal: newSeal,
    nextSteps: [
      `Verificar el seal: POST /seals/verify/${newSeal.id}`,
      `Consultar el seal: GET /seals/${newSeal.id}`
    ]
  });
});

// 5. Obtener un seal específico
app.get('/seals/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const seal = seals.find(s => s.id === id);
  
  if (!seal) {
    return res.status(404).json({
      success: false,
      error: `Seal con ID ${id} no encontrado`
    });
  }
  
  res.json({
    success: true,
    seal: seal
  });
});

// 6. Verificar un seal (simulación ZKP)
app.post('/seals/verify/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const sealIndex = seals.findIndex(s => s.id === id);
  
  if (sealIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Seal con ID ${id} no encontrado`
    });
  }
  
  // Simulación de verificación ZKP
  const isVerified = Math.random() > 0.2; // 80% de éxito
  
  seals[sealIndex].verified = isVerified;
  seals[sealIndex].zkpProof = isVerified 
    ? `zkp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    : null;
  seals[sealIndex].verificationTimestamp = new Date().toISOString();
  
  console.log(`🔍 Seal #${id} verificado: ${isVerified ? '✅' : '❌'}`);
  
  res.json({
    success: true,
    verified: isVerified,
    message: isVerified 
      ? "✅ Seal verificado exitosamente con ZKP" 
      : "❌ Falló la verificación ZKP",
    proofId: seals[sealIndex].zkpProof,
    sealId: id,
    timestamp: new Date().toISOString()
  });
});

// 7. Estadísticas para dashboard
app.get('/api/stats', (req, res) => {
  const total = seals.length;
  const verified = seals.filter(s => s.verified).length;
  const pending = seals.filter(s => !s.verified).length;
  
  res.json({
    success: true,
    stats: {
      totalSeals: total,
      verifiedSeals: verified,
      pendingVerification: pending,
      verificationRate: total > 0 ? (verified / total * 100).toFixed(2) + '%' : '0%'
    }
  });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`✅ SourceSeal Colombia Protocol V2.0`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL Local: http://localhost:${PORT}`);
  console.log(`🔗 URL Pública: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  console.log(`🕐 Iniciado: ${new Date().toLocaleTimeString()}`);
  console.log(``);
  console.log(`📋 ENDPOINTS DISPONIBLES:`);
  console.log(`   GET  /               - Información del API`);
  console.log(`   GET  /health         - Estado del servidor`);
  console.log(`   GET  /seals          - Listar todos los seals`);
  console.log(`   POST /seals/new      - Crear nuevo seal (¡IMPORTANTE!)`);
  console.log(`   GET  /seals/:id      - Obtener un seal específico`);
  console.log(`   POST /seals/verify/:id - Verificar seal con ZKP`);
  console.log(`   GET  /api/stats      - Estadísticas para dashboard`);
  console.log(``);
  console.log(`🚀 ¡Listo para crear New Seals!`);
});