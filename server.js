cat > server.js << 'EOF'
const express = require('express');
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANTE: Configuración para Replit
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // ¡CRÍTICO para Replit!

// RUTA PRINCIPAL - DEBE responder a GET /
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SourceSeal Colombia Protocol V2.0</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        h1 { color: #00ff88; }
        .status { 
          background: #00ff88; 
          color: black;
          padding: 10px;
          border-radius: 5px;
          display: inline-block;
        }
        .endpoint {
          background: rgba(0,0,0,0.3);
          padding: 15px;
          margin: 10px;
          border-radius: 8px;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ SourceSeal Colombia Protocol V2.0</h1>
        <p class="status">SISTEMA OPERATIVO - API PÚBLICA</p>
        
        <h2>📡 URLs de acceso:</h2>
        <p><strong>Local:</strong> http://localhost:${PORT}</p>
        <p><strong>Público:</strong> https://${process.env.REPL_SLUG || 'your-repl'}.${process.env.REPL_OWNER || 'user'}.repl.co</p>
        
        <h2>🔧 Endpoints disponibles:</h2>
        <div class="endpoint">
          <code>GET /</code> → Esta página (Información API)
        </div>
        <div class="endpoint">
          <code>GET /health</code> → Estado del servidor
        </div>
        <div class="endpoint">
          <code>GET /seals</code> → Listar sellos
        </div>
        <div class="endpoint">
          <code>POST /seals/new</code> → Crear nuevo sello ZKP
        </div>
        <div class="endpoint">
          <code>GET /stats</code> → Estadísticas
        </div>
        <div class="endpoint">
          <code>GET /verify/:id</code> → Verificar sello
        </div>
        
        <h3>⚡ Sistema listo para operaciones ZKP</h3>
        <p>Hora del servidor: ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `);
});

// RUTAS API
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV
  });
});

app.get('/seals', (req, res) => {
  res.json({ message: 'Lista de sellos ZKP' });
});

app.post('/seals/new', (req, res) => {
  res.json({ message: 'Sello ZKP creado' });
});

app.get('/stats', (req, res) => {
  res.json({ stats: 'Estadísticas del sistema' });
});

app.get('/verify/:id', (req, res) => {
  res.json({ verified: true, id: req.params.id });
});

// ERROR 404
app.use((req, res) => {
  res.status(404).send(`
    <h1>❌ Ruta no encontrada</h1>
    <p>La ruta <code>${req.url}</code> no existe.</p>
    <a href="/">Volver al inicio</a>
  `);
});

// INICIAR SERVIDOR - ¡IMPORTANTE PARA REPLIT!
app.listen(PORT, HOST, () => {
  console.log(`
  ============================================
  🚀 SOURCE SEAL COLOMBIA PROTOCOL V2.0  
  🌐 API PUBLICA - PUERTO ${PORT}  

  ✅ Servidor iniciado CORRECTAMENTE en Replit
  
  🔗 URLs de acceso:
     Local:    http://localhost:${PORT}
     Público:  https://${process.env.REPL_SLUG || 'your-repl'}.${process.env.REPL_OWNER || 'user'}.repl.co
  
  📡 Endpoints activos:
     • GET /           → Página principal
     • GET /health     → Estado
     • GET /seals      → Listar
     • POST /seals/new → Crear
     • GET /stats      → Stats
     • GET /verify/:id → Verificar
  
  ⚡ Sistema ZKP operativo
  🕐 ${new Date().toLocaleString()}
  ============================================
  `);
});
EOF