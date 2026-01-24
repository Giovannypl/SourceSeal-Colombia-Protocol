cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base de datos en memoria (simulada)
let sealsDatabase = [];
let stats = {
  totalSeals: 0,
  verifiedSeals: 0,
  failedVerifications: 0,
  createdToday: 0
};

// Ruta principal - Dashboard COMPLETO
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 SourceSeal Colombia - Sistema ZKP Completo</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
      :root {
        --primary: #00ff88;
        --secondary: #00ccff;
        --dark: #0a0a0a;
        --darker: #050505;
      }
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: var(--darker);
        color: white;
        min-height: 100vh;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      
      /* HEADER */
      .header {
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.1));
        border-radius: 20px;
        margin-bottom: 40px;
        border: 2px solid var(--primary);
      }
      
      h1 {
        font-size: 3.5rem;
        color: var(--primary);
        margin-bottom: 20px;
        text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
      }
      
      .status {
        background: var(--primary);
        color: black;
        padding: 15px 40px;
        border-radius: 50px;
        font-size: 1.8rem;
        font-weight: bold;
        display: inline-block;
        margin: 20px 0;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      /* STATS */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 30px 0;
      }
      
      .stat-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 25px;
        border-radius: 15px;
        text-align: center;
        border-top: 5px solid var(--primary);
      }
      
      .stat-number {
        font-size: 2.5rem;
        color: var(--primary);
        font-weight: bold;
      }
      
      /* SECTIONS */
      .section {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 20px;
        padding: 30px;
        margin: 30px 0;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .section-title {
        color: var(--primary);
        font-size: 2rem;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      /* FORMS */
      .form-group {
        margin-bottom: 25px;
      }
      
      label {
        display: block;
        margin-bottom: 10px;
        color: var(--primary);
        font-weight: bold;
      }
      
      input, textarea, select {
        width: 100%;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        color: white;
        font-size: 1rem;
      }
      
      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: var(--primary);
      }
      
      /* BUTTONS */
      .btn {
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        color: black;
        padding: 18px 35px;
        border-radius: 50px;
        border: none;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        margin: 10px;
      }
      
      .btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
      }
      
      /* SEALS LIST */
      .seals-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .seal-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 15px;
        border-left: 5px solid var(--primary);
      }
      
      .seal-id {
        color: var(--primary);
        font-family: monospace;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .verified {
        color: var(--primary);
        background: rgba(0, 255, 136, 0.1);
        padding: 5px 15px;
        border-radius: 20px;
        display: inline-block;
      }
      
      .not-verified {
        color: #ff5555;
        background: rgba(255, 85, 85, 0.1);
        padding: 5px 15px;
        border-radius: 20px;
        display: inline-block;
      }
      
      /* RESPONSIVE */
      @media (max-width: 768px) {
        h1 { font-size: 2.5rem; }
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .seals-list { grid-template-columns: 1fr; }
        .btn { width: 100%; margin: 10px 0; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- HEADER -->
      <div class="header">
        <h1><i class="fas fa-seedling"></i> SOURCE SEAL COLOMBIA</h1>
        <div class="status">
          <i class="fas fa-check-circle"></i> SISTEMA ZKP COMPLETO ACTIVO
        </div>
        <p>Sistema de creación y verificación de sellos con Zero-Knowledge Proofs</p>
      </div>
      
      <!-- STATISTICS -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number" id="totalSeals">${stats.totalSeals}</div>
          <div class="stat-label">SELLOS CREADOS</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="verifiedSeals">${stats.verifiedSeals}</div>
          <div class="stat-label">VERIFICADOS</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="todaySeals">${stats.createdToday}</div>
          <div class="stat-label">HOY</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${PORT}</div>
          <div class="stat-label">PUERTO</div>
        </div>
      </div>
      
      <!-- CREATE SEAL -->
      <div class="section">
        <h2 class="section-title"><i class="fas fa-plus-circle"></i> CREAR NUEVO SELLO ZKP</h2>
        <form id="createSealForm">
          <div class="form-group">
            <label for="documentData"><i class="fas fa-file-alt"></i> Datos del Documento</label>
            <textarea id="documentData" rows="4" placeholder="Ingresa los datos que quieres sellar con ZKP..." required></textarea>
          </div>
          
          <div class="form-group">
            <label for="sealType"><i class="fas fa-tag"></i> Tipo de Sello</label>
            <select id="sealType">
              <option value="legal">Documento Legal</option>
              <option value="financial">Transacción Financiera</option>
              <option value="identity">Verificación de Identidad</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          
          <button type="submit" class="btn">
            <i class="fas fa-seedling"></i> CREAR SELLO ZKP
          </button>
          <button type="button" class="btn" onclick="generateRandomSeal()" style="background: linear-gradient(90deg, #ff0080, #00ccff);">
            <i class="fas fa-random"></i> GENERAR ALEATORIO
          </button>
        </form>
        
        <div id="sealResult" style="margin-top: 30px; display: none;">
          <h3 style="color: var(--primary);"><i class="fas fa-check-circle"></i> ¡SELLO CREADO!</h3>
          <div id="resultContent" style="background: rgba(0,255,136,0.1); padding: 20px; border-radius: 10px;"></div>
        </div>
      </div>
      
      <!-- VERIFY SEAL -->
      <div class="section">
        <h2 class="section-title"><i class="fas fa-check-circle"></i> VERIFICAR SELLO</h2>
        <div class="form-group">
          <label for="sealId"><i class="fas fa-fingerprint"></i> ID del Sello</label>
          <input type="text" id="sealId" placeholder="Ingresa el ID del sello a verificar (ej: SEAL-123456...)" />
        </div>
        <button class="btn" onclick="verifySeal()">
          <i class="fas fa-search"></i> VERIFICAR SELLO
        </button>
        <div id="verifyResult" style="margin-top: 30px; display: none;"></div>
      </div>
      
      <!-- RECENT SEALS -->
      <div class="section">
        <h2 class="section-title"><i class="fas fa-history"></i> SELLOS RECIENTES</h2>
        <div class="seals-list" id="recentSeals">
          <!-- Los sellos se cargarán aquí dinámicamente -->
          <div class="seal-card">
            <div class="seal-id">SEAL-EXAMPLE-123</div>
            <p>Documento de ejemplo</p>
            <span class="verified"><i class="fas fa-check"></i> VERIFICADO</span>
            <div style="margin-top: 10px; font-size: 0.9rem; color: #aaa;">
              Creado: ${new Date().toLocaleString()}
            </div>
          </div>
        </div>
        <button class="btn" onclick="loadSeals()" style="margin-top: 20px;">
          <i class="fas fa-sync-alt"></i> ACTUALIZAR LISTA
        </button>
      </div>
      
      <!-- API INFO -->
      <div class="section">
        <h2 class="section-title"><i class="fas fa-code"></i> API ENDPOINTS</h2>
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px;">
          <p><strong>POST</strong> /api/seals - Crear nuevo sello</p>
          <p><strong>GET</strong> /api/seals/:id - Obtener sello específico</p>
          <p><strong>GET</strong> /api/seals - Listar todos los sellos</p>
          <p><strong>GET</strong> /api/verify/:id - Verificar sello</p>
          <p><strong>GET</strong> /api/stats - Estadísticas del sistema</p>
        </div>
      </div>
      
      <!-- FOOTER -->
      <footer style="text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.6); border-top: 1px solid rgba(255,255,255,0.1); margin-top: 50px;">
        <p>🚀 SourceSeal Colombia Protocol v3.0 - Sistema ZKP Completo</p>
        <p>Puerto: ${PORT} | URL: https://${process.env.REPL_SLUG || 'workspace'}.${process.env.REPL_OWNER || 'paredesharold62'}.repl.co</p>
        <p><i class="fas fa-clock"></i> ${new Date().toLocaleString('es-CO')}</p>
      </footer>
    </div>
    
    <!-- JavaScript -->
    <script>
      // Variables globales
      let seals = [];
      
      // Cargar sellos al iniciar
      document.addEventListener('DOMContentLoaded', () => {
        loadSeals();
        loadStats();
      });
      
      // Crear sello
      document.getElementById('createSealForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const documentData = document.getElementById('documentData').value;
        const sealType = document.getElementById('sealType').value;
        
        const response = await fetch('/api/seals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: documentData, type: sealType })
        });
        
        const result = await response.json();
        
        if (result.success) {
          const seal = result.seal;
          document.getElementById('resultContent').innerHTML = \`
            <p><strong>ID del Sello:</strong> <code>\${seal.id}</code></p>
            <p><strong>Prueba ZKP:</strong> <code>\${seal.zkpProof}</code></p>
            <p><strong>Timestamp:</strong> \${new Date(seal.timestamp).toLocaleString()}</p>
            <p><strong>Hash:</strong> <code>\${seal.hash}</code></p>
            <button class="btn" onclick="copyToClipboard('\${seal.id}')" style="background: #333; color: white; padding: 10px 20px;">
              <i class="fas fa-copy"></i> COPIAR ID
            </button>
            <button class="btn" onclick="verifySealById('\${seal.id}')" style="margin-left: 10px;">
              <i class="fas fa-check-circle"></i> VERIFICAR AHORA
            </button>
          \`;
          document.getElementById('sealResult').style.display = 'block';
          
          // Limpiar formulario
          document.getElementById('documentData').value = '';
          
          // Actualizar lista y estadísticas
          setTimeout(() => {
            loadSeals();
            loadStats();
          }, 1000);
        }
      });
      
      // Generar sello aleatorio
      function generateRandomSeal() {
        const randomData = 'Documento aleatorio #' + Math.floor(Math.random() * 1000) + ' - ' + new Date().toLocaleTimeString();
        document.getElementById('documentData').value = randomData;
        document.getElementById('sealType').value = ['legal', 'financial', 'identity', 'custom'][Math.floor(Math.random() * 4)];
      }
      
      // Verificar sello por ID
      async function verifySealById(sealId) {
        if (!sealId) {
          sealId = document.getElementById('sealId').value;
        }
        
        if (!sealId) {
          alert('Por favor ingresa un ID de sello');
          return;
        }
        
        const response = await fetch(\`/api/verify/\${sealId}\`);
        const result = await response.json();
        
        const verifyResult = document.getElementById('verifyResult');
        if (result.success) {
          const verification = result.verification;
          verifyResult.innerHTML = \`
            <div style="background: \${verification.verified ? 'rgba(0,255,136,0.1)' : 'rgba(255,85,85,0.1)'}; padding: 20px; border-radius: 10px; border-left: 5px solid \${verification.verified ? '#00ff88' : '#ff5555'}">
              <h3 style="color: \${verification.verified ? '#00ff88' : '#ff5555'}">
                <i class="fas \${verification.verified ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                \${verification.message}
              </h3>
              <p><strong>ID:</strong> \${verification.id}</p>
              <p><strong>Confianza:</strong> \${(verification.confidence * 100).toFixed(1)}%</p>
              <p><strong>Algoritmo:</strong> \${verification.details.algorithm}</p>
              <p><strong>Tiempo de verificación:</strong> \${verification.details.verificationTime}</p>
              <p><strong>Fecha:</strong> \${new Date(verification.timestamp).toLocaleString()}</p>
            </div>
          \`;
        } else {
          verifyResult.innerHTML = \`
            <div style="background: rgba(255,85,85,0.1); padding: 20px; border-radius: 10px; color: #ff5555;">
              <i class="fas fa-exclamation-triangle"></i> Error: \${result.error || 'Sello no encontrado'}
            </div>
          \`;
        }
        verifyResult.style.display = 'block';
        
        // Actualizar estadísticas
        setTimeout(loadStats, 500);
      }
      
      // Cargar sellos recientes
      async function loadSeals() {
        const response = await fetch('/api/seals');
        const result = await response.json();
        
        if (result.success) {
          seals = result.seals;
          const recentSealsDiv = document.getElementById('recentSeals');
          recentSealsDiv.innerHTML = '';
          
          // Mostrar los últimos 5 sellos
          seals.slice(-5).reverse().forEach(seal => {
            const sealCard = document.createElement('div');
            sealCard.className = 'seal-card';
            sealCard.innerHTML = \`
              <div class="seal-id">\${seal.id}</div>
              <p>\${seal.data.substring(0, 50)}\${seal.data.length > 50 ? '...' : ''}</p>
              <span class="\${seal.verified ? 'verified' : 'not-verified'}">
                <i class="fas \${seal.verified ? 'fa-check' : 'fa-times'}"></i>
                \${seal.verified ? 'VERIFICADO' : 'NO VERIFICADO'}
              </span>
              <div style="margin-top: 10px; font-size: 0.9rem; color: #aaa;">
                Creado: \${new Date(seal.timestamp).toLocaleString()}
              </div>
              <button onclick="verifySealById('\${seal.id}')" style="background: rgba(255,255,255,0.1); color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-top: 10px; cursor: pointer;">
                <i class="fas fa-search"></i> Verificar
              </button>
            \`;
            recentSealsDiv.appendChild(sealCard);
          });
        }
      }
      
      // Cargar estadísticas
      async function loadStats() {
        const response = await fetch('/api/stats');
        const result = await response.json();
        
        if (result.success) {
          const stats = result.stats;
          document.getElementById('totalSeals').textContent = stats.totalSeals;
          document.getElementById('verifiedSeals').textContent = stats.verifiedSeals;
          document.getElementById('todaySeals').textContent = stats.createdToday;
        }
      }
      
      // Copiar al portapapeles
      function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
          .then(() => alert('✅ ID copiado al portapapeles'))
          .catch(err => console.error('Error al copiar:', err));
      }
      
      // Alias para verificar
      window.verifySeal = verifySealById;
      
      console.log('✅ Sistema ZKP cargado correctamente');
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

// API: Crear nuevo sello ZKP
app.post('/api/seals', (req, res) => {
  const { data, type } = req.body;
  
  if (!data) {
    return res.json({ success: false, error: 'Se requieren datos para crear el sello' });
  }
  
  // Generar ID único
  const sealId = `SEAL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  // Generar hash simulado (en un sistema real sería un hash criptográfico)
  const hash = `zkp_${Math.random().toString(36).substr(2, 16)}_${Date.now().toString(36)}`;
  
  // Crear sello
  const newSeal = {
    id: sealId,
    data: data,
    type: type || 'custom',
    hash: hash,
    zkpProof: `proof_${Math.random().toString(36).substr(2, 24)}`,
    timestamp: new Date().toISOString(),
    verified: false,
    verificationCount: 0
  };
  
  // Guardar en "base de datos"
  sealsDatabase.push(newSeal);
  
  // Actualizar estadísticas
  stats.totalSeals++;
  stats.createdToday++;
  
  res.json({
    success: true,
    message: 'Sello ZKP creado exitosamente',
    seal: newSeal
  });
});

// API: Obtener todos los sellos
app.get('/api/seals', (req, res) => {
  res.json({
    success: true,
    seals: sealsDatabase,
    count: sealsDatabase.length
  });
});

// API: Obtener sello específico
app.get('/api/seals/:id', (req, res) => {
  const seal = sealsDatabase.find(s => s.id === req.params.id);
  
  if (!seal) {
    return res.json({ success: false, error: 'Sello no encontrado' });
  }
  
  res.json({ succes