cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración para Replit
const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '✅ SourceSeal Colombia Protocol - Funcionando en Replit',
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    instructions: 'El servidor está funcionando correctamente'
  });
});

// Ruta de salud para Replit
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Ruta de información del sistema
app.get('/info', (req, res) => {
  res.json({
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    availableRoutes: ['/', '/health', '/info']
  });
});

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor SourceSeal Colombia iniciado`);
  console.log(`🌐 URL: http://${HOST}:${PORT}`);
  console.log(`📁 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Hora: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
  
  // Mostrar rutas disponibles
  console.log('\n📋 Rutas disponibles:');
  console.log(`   GET /        → Mensaje de bienvenida`);
  console.log(`   GET /health  → Estado del servidor`);
  console.log(`   GET /info    → Información del sistema`);
  console.log('='.repeat(50));
});

// Manejo de cierre limpio
process.on('SIGTERM', () => {
  console.log('\n🔴 Recibida señal SIGTERM. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🔴 Recibida señal SIGINT (Ctrl+C). Cerrando servidor...');
  process.exit(0);
});
EOF