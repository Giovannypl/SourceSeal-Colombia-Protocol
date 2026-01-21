cat > simple-server.js << 'EOF'
console.log("🚀 SourceSeal Colombia V2.0 - SIMPLE & STABLE");
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify({
        success: true,
        project: "SourceSeal Colombia Protocol V2.0",
        version: "2.0.0",
        status: "ACTIVE",
        timestamp: new Date().toISOString(),
        message: "¡API 100% operativa!",
        endpoints: ["/", "/health", "/seal (soon)"]
    }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API funcionando en: http://localhost:${PORT}`);
    console.log(`🌐 Prueba: curl http://localhost:${PORT}`);
});
EOF

# Ejecutar
node simple-server.js
// Endpoint para crear un nuevo sello (ZKP)
app.post('/seals/new', (req, res) => {
  const { data, owner, metadata } = req.body;
  
  // Simulación de generación de ZKP
  const sealId = `zkp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  // En un sistema real, aquí iría la generación del proof ZKP
  const proof = {
    sealId,
    timestamp,
    dataHash: require('crypto').createHash('sha256').update(data).digest('hex'),
    owner,
    metadata,
    zkpProof: "simulated_proof_placeholder", // En realidad sería un proof ZKP real
    verified: true
  };
  
  res.json({
    success: true,
    message: "Sello ZKP creado exitosamente",
    seal: proof
  });
});
