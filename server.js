# Crea un nuevo server.js que BUSCA puertos automáticamente
cat > server.js << 'EOF'
const express = require('express');
const app = express();
const net = require('net');

// FUNCIÓN MÁGICA: Encuentra puerto disponible
function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// CONFIGURACIÓN INTELIGENTE PARA REPLIT
async function startServer() {
  // En Replit, usa el puerto dinámico O busca uno disponible
  let PORT = process.env.PORT || 5000;
  
  // Si el puerto está ocupado, busca otro
  try {
    PORT = await findAvailablePort(PORT);
  } catch (e) {
    // Si falla, usa puertos alternativos
    PORT = 8080;
  }
  
  const HOST = '0.0.0.0';
  
  // RUTA PRINCIPAL - SIEMPRE FUNCIONA
  app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>🚀 SourceSeal Colombia - ¡FUNCIONANDO!</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
        }
        h1 {
          color: #00ff88;
          font-size: 3em;
          margin-bottom: 20px;
          text-shadow: 0 2px 10px rgba(0,255,136,0.3);
        }
        .success-badge {
          background: #00ff88;
          color: #000;
          padding: 15px 30px;
          border-radius: 50px;
          font-size: 1.5em;
          font-weight: bold;
          display: inline-block;
          margin: 20px 0;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .url-box {
          background: rgba(0,0,0,0.3);
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          font-family: monospace;
          font-size: 1.2em;
          border-left: 5px solid #00ff88;
          text-align: left;
        }
        .endpoint {
          background: rgba(255,255,255,0.1);
          margin: 10px;
          padding: 15px;
          border-radius: 8px;
          text-align: left;
          border-left: 4px solid #00ff88;
        }
        .status {
          display: inline-block;
          padding: 8px 16px;
          background: #00ff88;
          color: #000;
          border-radius: 20px;
          font-weight: bold;
          margin: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ ¡SOURCE SEAL COLOMBIA!</h1>
        <div class="success-badge">🚀 SERVIDOR OPERATIVO EN REPLIT</div>
        
        <div style="margin: 30px 0;">
          <span class="status">PUERTO: ${PORT}</span>
          <span class="status">NODE: ${process.version}</span>
          <span class="status">ONLINE</span>
        </div>
        
        <h2>🌐 URL PÚBLICA:</h2>
        <div class="url-box">
          https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co
        </div>
        
        <h2>🔧 ENDPOINTS ACTIVOS:</h2>
        <div class="endpoint"><strong>GET /</strong> → Esta página principal</div>
        <div class="endpoint"><strong>GET /health</strong> → Estado del servidor</div>
        <div class="endpoint"><strong>GET /api/test</strong> → Prueba de API</div>
        <div class="endpoint"><strong>GET /info</strong> → Información del sistema</div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
          <p>⏰ Hora del servidor: ${new Date().toLocaleString('es-CO')}</p>
          <p>🔄 Actualizado automáticamente | 🛡️ Seguro ZKP | 🔗 Conectado</p>
        </div>
      </div>
    </body>
    </html>
    `;
    res.send(html);
  });

  // OTRAS RUTAS
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  });

  app.get('/api/test', (req, res) => {
    res.json({ 
      success: true, 
      message: 'API SourceSeal Colombia funcionando',
      version: '2.0.0',
      features: ['ZKP', 'Secure API', 'Replit Ready']
    });
  });

  app.get('/info', (req, res) => {
    res.json({
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      cwd: process.cwd()
    });
  });

  // INICIAR SERVIDOR - ¡ÉXITO GARANTIZADO!
  app.listen(PORT, HOST, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 SOURCE SEAL COLOMBIA PROTOCOL V2.0');
    console.log('='.repeat(60));
    console.log(`✅ Servidor iniciado EXITOSAMENTE`);
    console.log(`📡 Puerto: ${PORT} | Host: ${HOST}`);
    console.log(`🌐 URL pública: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
    console.log(`🔗 URL local: http://localhost:${PORT}`);
    console.log(`🕐 ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
    console.log('\n📋 Rutas disponibles:');
    console.log('   GET /          → Página principal (HTML)');
    console.log('   GET /health    → Estado del servidor');
    console.log('   GET /api/test  → Prueba de API');
    console.log('   GET /info      → Información del sistema');
    console.log('='.repeat(60) + '\n');
  });

  return PORT;
}

// INICIAR TODO
startServer().catch(console.error);
EOF