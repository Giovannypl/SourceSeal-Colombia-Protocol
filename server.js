cat > server.js << 'EOF'
const express = require('express');
const app = express();

// Configuración para Replit
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Middleware para CORS y headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('X-Powered-By', 'SourceSeal Colombia');
  next();
});

// Ruta principal
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>✅ SourceSeal Colombia - ¡ACTIVO!</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #0a0a0a;
        color: white;
        text-align: center;
        padding: 50px;
        margin: 0;
      }
      h1 {
        color: #00ff88;
        font-size: 4rem;
        text-shadow: 0 0 30px rgba(0,255,136,0.5);
        margin-bottom: 30px;
      }
      .success {
        background: #00ff88;
        color: black;
        padding: 30px;
        border-radius: 20px;
        font-size: 2.5rem;
        font-weight: bold;
        margin: 40px auto;
        max-width: 600px;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 30px #00ff88; }
        50% { transform: scale(1.05); box-shadow: 0 0 60px #00ff88; }
        100% { transform: scale(1); box-shadow: 0 0 30px #00ff88; }
      }
      .info {
        background: rgba(255,255,255,0.1);
        padding: 30px;
        border-radius: 15px;
        margin: 30px auto;
        max-width: 800px;
        border-left: 5px solid #00ff88;
      }
    </style>
  </head>
  <body>
    <h1>🚀 SOURCE SEAL COLOMBIA</h1>
    <div class="success">✅ ¡SISTEMA 100% OPERATIVO!</div>
    
    <div class="info">
      <h2>📊 Información del Sistema</h2>
      <p><strong>Puerto:</strong> ${PORT}</p>
      <p><strong>URL Replit:</strong> https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co</p>
      <p><strong>Estado:</strong> Servidor HTTP activo y escuchando</p>
      <p><strong>Hora:</strong> ${new Date().toLocaleString('es-CO')}</p>
    </div>
    
    <div class="info">
      <h2>⚡ Instrucciones</h2>
      <p>1. Espera 10-20 segundos para que Replit configure el proxy</p>
      <p>2. Recarga esta página si ves error inicial</p>
      <p>3. El servidor está funcionando correctamente en el puerto ${PORT}</p>
      <button onclick="location.reload()" style="background:#00ff88; color:black; padding:15px 30px; border:none; border-radius:10px; font-size:1.2rem; margin:15px; cursor:pointer;">
        🔄 RECARGAR PÁGINA
      </button>
    </div>
    
    <div style="margin-top: 50px; color: rgba(255,255,255,0.7);">
      <p>© 2024 SourceSeal Colombia Protocol v2.0</p>
      <p>🚀 Optimizado para Replit - ¡Gracias por tu persistencia!</p>
    </div>
    
    <script>
      console.log('✅ SourceSeal Colombia - Puerto ${PORT} activo');
      console.log('🌐 URL: ' + window.location.href);
      
      // Verificar conexión cada 5 segundos
      setInterval(() => {
        fetch('/')
          .then(() => console.log('✅ Conexión estable - ' + new Date().toLocaleTimeString()))
          .catch(e => console.log('⚠️  Error de conexión: ' + e.message));
      }, 5000);
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

// Ruta de salud para Replit
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SourceSeal Colombia Protocol',
    version: '2.0.0',
    port: PORT,
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    replit: {
      slug: process.env.REPL_SLUG,
      owner: process.env.REPL_OWNER,
      publicUrl: `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    }
  });
});

// Ruta específica para diagnóstico de Replit
app.get('/replit-status', (req, res) => {
  res.json({
    server: 'running',
    port: PORT,
    host: HOST,
    time: new Date().toISOString(),
    headers: req.headers
  });
});

// Iniciar servidor con manejo de errores
const server = app.listen(PORT, HOST, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════════════╗
  ║                                                                  ║
  ║        🚀 SOURCE SEAL COLOMBIA PROTOCOL v2.0                    ║
  ║                                                                  ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║                                                                  ║
  ║   ✅ SERVIDOR HTTP INICIADO                                     ║
  ║   📡 Puerto: ${PORT}                                            ║
  ║   🌐 Host: ${HOST}                                              ║
  ║   🔗 URL Pública: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co ║
  ║   ⏰ ${new Date().toLocaleString('es-CO')}                      ║
  ║                                                                  ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║                                                                  ║
  ║   📋 PARA ACCEDER EN REPLIT:                                   ║
  ║                                                                  ║
  ║   1. Haz clic en el botón "🔴 Stop" (rojo)                      ║
  ║   2. Luego haz clic en "▶️ Run" (verde)                         ║
  ║   3. Espera 20 segundos                                         ║
  ║   4. Haz clic en "🌐 Webview" o usa la URL pública             ║
  ║                                                                  ║
  ╚══════════════════════════════════════════════════════════════════╝
  `);
});

// Manejo de errores específicos
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} está ocupado. Intenta con otro puerto.`);
    process.exit(1);
  } else {
    console.error('❌ Error del servidor:', error);
  }
});

// Manejo de cierre
process.on('SIGINT', () => {
  console.log('\n🔴 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  });
});
EOF