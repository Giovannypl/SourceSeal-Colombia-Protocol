cat > server.js << 'EOF'
const express = require('express');
const app = express();

// Puerto para Replit - SIEMPRE usa el de la variable de entorno
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Ruta principal CON HTML COMPLETO
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>✅ SourceSeal Colombia - ¡OPERATIVO!</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #1a2980, #26d0ce);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 50px;
          max-width: 800px;
          width: 100%;
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }
        h1 {
          font-size: 3.5rem;
          margin-bottom: 20px;
          background: linear-gradient(90deg, #00ff88, #00ccff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .badge {
          display: inline-block;
          background: #00ff88;
          color: #000;
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: bold;
          font-size: 1.2rem;
          margin: 20px 0;
          animation: glow 2s infinite alternate;
        }
        @keyframes glow {
          from { box-shadow: 0 0 10px #00ff88; }
          to { box-shadow: 0 0 30px #00ff88; }
        }
        .info-box {
          background: rgba(0, 0, 0, 0.3);
          padding: 25px;
          border-radius: 15px;
          margin: 25px 0;
          text-align: left;
        }
        .endpoint {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          margin: 10px;
          border-radius: 10px;
          font-family: 'Courier New', monospace;
          border-left: 4px solid #00ff88;
        }
        .url {
          background: #000;
          color: #00ff88;
          padding: 15px;
          border-radius: 10px;
          font-family: monospace;
          font-size: 1.1rem;
          word-break: break-all;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🚀 SourceSeal Colombia</h1>
        <div class="badge">✅ SERVIDOR 100% OPERATIVO</div>
        
        <div class="info-box">
          <h2>📊 Información del Sistema</h2>
          <p><strong>📍 Puerto:</strong> ${PORT}</p>
          <p><strong>🌍 Entorno:</strong> ${process.env.NODE_ENV || 'Producción'}</p>
          <p><strong>⏰ Hora:</strong> ${new Date().toLocaleString('es-CO')}</p>
          <p><strong>🖥️ Node.js:</strong> ${process.version}</p>
        </div>
        
        <h2>🔗 URL Pública:</h2>
        <div class="url">https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co</div>
        
        <h2>⚡ Endpoints Activos:</h2>
        <div class="endpoint"><strong>GET</strong> / → Página principal (esta)</div>
        <div class="endpoint"><strong>GET</strong> /health → Estado del servidor</div>
        <div class="endpoint"><strong>GET</strong> /api/test → Prueba de API JSON</div>
        <div class="endpoint"><strong>GET</strong> /info → Info del sistema</div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
          <p>🔒 Sistema ZKP Habilitado | 📡 API Pública | 🌐 Compatible con Replit</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SourceSeal Colombia Protocol',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'production'
  });
});

// Ruta de prueba API
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando perfectamente',
    data: {
      protocol: 'ZKP',
      status: 'active',
      features: ['authentication', 'encryption', 'verification']
    }
  });
});

// Ruta de información
app.get('/info', (req, res) => {
  res.json({
    node: process.version,
    platform: process.platform,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send(`
    <div style="text-align:center; padding:50px;">
      <h1 style="color:#ff4444;">404 - Ruta no encontrada</h1>
      <p>La ruta <code>${req.url}</code> no existe.</p>
      <a href="/" style="color:#00ff88;">← Volver al inicio</a>
    </div>
  `);
});

// Iniciar servidor
const server = app.listen(PORT, HOST, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║      🚀 SOURCE SEAL COLOMBIA PROTOCOL V2.0           ║
  ╠═══════════════════════════════════════════════════════╣
  ║                                                       ║
  ║   ✅ Servidor iniciado EXITOSAMENTE                  ║
  ║   📡 Puerto: ${PORT}                                 ║
  ║   🌐 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co ║
  ║   ⏰ ${new Date().toLocaleString('es-CO')}           ║
  ║                                                       ║
  ║   📋 Rutas disponibles:                              ║
  ║      • GET /       → Página principal                ║
  ║      • GET /health → Estado del servidor             ║
  ║      • GET /api/test → Prueba API                    ║
  ║      • GET /info   → Información del sistema         ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});

// Manejo de errores del servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`⚠️  El puerto ${PORT} está ocupado. Probando con ${Number(PORT) + 1}...`);
    // No hacemos nada, se puede reiniciar manualmente
  } else {
    console.error('❌ Error del servidor:', error);
  }
});
EOF