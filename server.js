// =============================================
// SOURCE SEAL COLOMBIA - SERVER 100% FUNCIONAL
// =============================================

console.log("🔐 INICIANDO SOURCE SEAL COLOMBIA...");

// Usar HTTP nativo de Node (sin dependencias)
const http = require('http');
const crypto = require('crypto');
const url = require('url');

// Base de datos en memoria
let database = {
  seals: [],
  stats: {
    totalCreated: 0,
    honeytokens: 0,
    verifications: 0
  }
};

// ===============================
// CONFIGURACIÓN DEL SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  console.log(`${req.method} ${pathname}`);
  
  // ===============================
  // RUTA PRINCIPAL - INTERFAZ WEB
  // ===============================
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>🔐 SourceSeal Colombia</title>
      <style>
        /* ESTILOS PROFESIONALES PERO SIMPLES */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0c2461 0%, #1e3799 100%);
          color: white;
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        h1 {
          font-size: 3.2rem;
          background: linear-gradient(90deg, #00dbde 0%, #fc00ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 10px;
        }
        
        .tagline {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-bottom: 10px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 30px 0;
          text-align: center;
        }
        
        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 25px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .stat-number {
          font-size: 3rem;
          font-weight: bold;
          color: #00dbde;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 0.95rem;
          opacity: 0.8;
        }
        
        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .feature-title {
          color: #00dbde;
          margin-bottom: 20px;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        textarea, input[type="text"] {
          width: 100%;
          padding: 18px;
          border-radius: 12px;
          border: 2px solid #2c5364;
          background: rgba(0, 0, 0, 0.4);
          color: white;
          font-size: 16px;
          margin-bottom: 15px;
          resize: vertical;
          transition: border-color 0.3s ease;
          font-family: 'Consolas', monospace;
        }
        
        textarea:focus, input[type="text"]:focus {
          outline: none;
          border-color: #00dbde;
        }
        
        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          padding: 15px;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .action-button {
          background: linear-gradient(45deg, #00dbde, #fc00ff);
          color: white;
          border: none;
          padding: 18px 36px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .action-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        
        .action-button:active {
          transform: translateY(0);
        }
        
        .result-container {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          padding: 25px;
          margin-top: 25px;
          border-left: 4px solid #00dbde;
          display: none;
        }
        
        .result-container.honeytoken {
          border-left-color: #ff416c;
          background: rgba(255, 65, 108, 0.1);
        }
        
        .result-title {
          color: #00dbde;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }
        
        .result-data {
          font-family: 'Consolas', monospace;
          background: rgba(0, 0, 0, 0.4);
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          word-break: break-all;
          font-size: 14px;
        }
        
        .copy-button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.3s ease;
        }
        
        .copy-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .alert-banner {
          background: rgba(255, 65, 108, 0.2);
          border: 1px solid #ff416c;
          color: #ffcccc;
          padding: 20px;
          border-radius: 12px;
          margin: 25px 0;
          text-align: center;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
          margin: 5px;
        }
        
        .status-valid {
          background: rgba(0, 255, 128, 0.2);
          color: #00ff80;
        }
        
        .status-honeytoken {
          background: rgba(255, 215, 0, 0.2);
          color: #ffd700;
        }
        
        .status-invalid {
          background: rgba(255, 65, 108, 0.2);
          color: #ff416c;
        }
        
        footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0.7;
          font-size: 0.9rem;
        }
        
        .api-info {
          background: rgba(0, 0, 0, 0.2);
          padding: 15px;
          border-radius: 10px;
          margin: 20px 0;
          font-family: 'Consolas', monospace;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>🔐 SOURCE SEAL COLOMBIA</h1>
          <p class="tagline">Protocolo ZKP para Integridad de Datos y Detección de Intrusos</p>
          <p>Genera sellos criptográficos únicos y detecta accesos no autorizados con honeytokens</p>
        </header>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number" id="totalSeals">0</div>
            <div class="stat-label">Sellos Totales</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="honeytokensCount">0</div>
            <div class="stat-label">Honeytokens</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="verificationsCount">0</div>
            <div class="stat-label">Verificaciones</div>
          </div>
        </div>
        
        <!-- SECCIÓN 1: CREAR SELLO -->
        <div class="feature-card" id="createSection">
          <h2 class="feature-title">✨ Crear Nuevo Sello ZKP</h2>
          <p>Protege cualquier dato con un sello criptográfico único basado en Zero-Knowledge Proof.</p>
          
          <textarea 
            id="sealData" 
            rows="5" 
            placeholder="Ingresa los datos que deseas proteger (ej: contrato, documento, credencial, información sensible)..."></textarea>
          
          <div class="checkbox-container">
            <input type="checkbox" id="isHoneytoken">
            <label for="isHoneytoken">
              <strong>🍯 Marcar como Honeytoken</strong> - Generará una alerta cuando sea verificado
            </label>
          </div>
          
          <button class="action-button" onclick="createSeal()">
            <span>🚀 Generar Sello ZKP</span>
          </button>
          
          <div class="result-container" id="createResult">
            <h3 class="result-title">✅ Sello Creado Exitosamente</h3>
            <div class="result-data">
              <strong>ID del Sello:</strong><br>
              <span id="sealIdResult"></span>
            </div>
            <div class="result-data">
              <strong>Hash ZKP (SHA-256):</strong><br>
              <span id="sealHashResult"></span>
            </div>
            <div class="result-data">
              <strong>URL de Verificación:</strong><br>
              <a id="verifyUrlResult" target="_blank"></a>
            </div>
            <button class="copy-button" onclick="copySealInfo()">📋 Copiar Información</button>
            <button class="copy-button" onclick="openVerification()">🔍 Verificar Ahora</button>
          </div>
        </div>
        
        <!-- SECCIÓN 2: VERIFICAR SELLO -->
        <div class="feature-card" id="verifySection">
          <h2 class="feature-title">🔍 Verificar Sello Existente</h2>
          <p>Verifica la autenticidad de un sello y detecta si es un honeytoken.</p>
          
          <input 
            type="text" 
            id="verifySealId" 
            placeholder="Pega aquí el ID del sello que deseas verificar...">
          
          <button class="action-button" onclick="verifySeal()">
            <span>🔍 Verificar Autenticidad</span>
          </button>
          
          <div class="result-container" id="verifyResult">
            <h3 class="result-title" id="verifyResultTitle"></h3>
            <div class="result-data">
              <strong>Estado:</strong> <span class="status-badge" id="verifyStatusBadge"></span>
            </div>
            <div class="result-data">
              <strong>Mensaje:</strong><br>
              <span id="verifyMessage"></span>
            </div>
            <div class="result-data">
              <strong>Fecha de Creación:</strong><br>
              <span id="verifyTimestamp"></span>
            </div>
            <div class="result-data">
              <strong>Número de Verificaciones:</strong><br>
              <span id="verifyCount"></span>
            </div>
          </div>
        </div>
        
        <div class="alert-banner">
          ⚠️ <strong>Nota de Seguridad:</strong> Los honeytokens son "señuelos digitales" que se colocan en datos falsos o sensibles. 
          Cuando alguien verifica un honeytoken, se activa una alerta de posible acceso no autorizado.
        </div>
        
        <!-- SECCIÓN 3: ESTADO DEL SISTEMA -->
        <div class="feature-card">
          <h2 class="feature-title">📊 Estado del Sistema</h2>
          <p>Verifica el estado actual del servidor y las estadísticas del sistema.</p>
          
          <button class="action-button" onclick="checkSystemHealth()">
            <span>🩺 Comprobar Salud del Sistema</span>
          </button>
          
          <div class="result-container" id="healthResult">
            <h3 class="result-title">✅ Sistema Operativo</h3>
            <div class="api-info" id="healthInfo"></div>
          </div>
          
          <div class="api-info">
            <strong>Endpoints API Disponibles:</strong><br>
            • POST <code>/api/seal</code> - Crear nuevo sello<br>
            • GET <code>/api/verify/:id</code> - Verificar sello<br>
            • GET <code>/api/health</code> - Estado del sistema<br>
            • GET <code>/api/stats</code> - Estadísticas
          </div>
        </div>
        
        <footer>
          <p>🔒 <strong>SourceSeal Colombia Protocol v2.0</strong> - Sistema ZKP para garantizar la integridad y procedencia de datos</p>
          <p>🌐 <strong>URL Pública:</strong> <span id="currentUrl">https://workspace.paredesharold62.repl.co</span></p>
          <p>🕐 <strong>Servidor Activo:</strong> <span id="serverTime"></span></p>
          <p>📞 <strong>API Disponible para integraciones</strong></p>
        </footer>
      </div>
      
      <script>
        // =============================================
        // CONFIGURACIÓN Y UTILIDADES
        // =============================================
        const API_BASE = window.location.origin;
        let currentSealId = '';
        
        // Actualizar URL y hora del servidor
        document.getElementById('currentUrl').textContent = API_BASE;
        updateServerTime();
        setInterval(updateServerTime, 1000);
        
        function updateServerTime() {
          document.getElementById('serverTime').textContent = new Date().toLocaleString();
        }
        
        // =============================================
        // FUNCIÓN: CREAR SELLO ZKP
        // =============================================
        async function createSeal() {
          const sealData = document.getElementById('sealData').value;
          const isHoneytoken = document.getElementById('isHoneytoken').checked;
          
          if (!sealData.trim()) {
            alert('❌ Por favor, ingresa datos para crear el sello.');
            return;
          }
          
          const button = event.target.closest('.action-button');
          const originalText = button.innerHTML;
          button.innerHTML = '<span>⏳ Generando sello ZKP...</span>';
          button.disabled = true;
          
          try {
            const response = await fetch('/api/seal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                data: sealData,
                metadata: {
                  isHoneytoken: isHoneytoken,
                  source: 'web_interface',
                  timestamp: new Date().toISOString()
                }
              })
            });
            
            if (!response.ok) {
              throw new Error(\`Error HTTP: \${response.status}\`);
            }
            
            const result = await response.json();
            
            if (result.success) {
              // Guardar ID actual
              currentSealId = result.sealId;
              
              // Mostrar resultados
              document.getElementById('sealIdResult').textContent = result.sealId;
              document.getElementById('sealHashResult').textContent = result.sealHash;
              document.getElementById('verifyUrlResult').href = \`\${API_BASE}/api/verify/\${result.sealId}\`;
              document.getElementById('verifyUrlResult').textContent = \`\${API_BASE}/api/verify/\${result.sealId}\`;
              
              // Mostrar contenedor de resultados
              const resultContainer = document.getElementById('createResult');
              resultContainer.style.display = 'block';
              
              if (result.isHoneytoken) {
                resultContainer.classList.add('honeytoken');
              } else {
                resultContainer.classList.remove('honeytoken');
              }
              
              // Actualizar estadísticas
              updateStats();
              
              // Scroll a los resultados
              resultContainer.scrollIntoView({ behavior: 'smooth' });
              
              // Notificación de éxito
              alert(\`✅ Sello creado exitosamente!\\nID: \${result.sealId}\`);
              
            } else {
              throw new Error(result.message || 'Error desconocido al crear el sello');
            }
            
          } catch (error) {
            console.error('Error:', error);
            alert(\`❌ Error al crear el sello: \${error.message}\`);
          } finally {
            button.innerHTML = originalText;
            button.disabled = false;
          }
        }
        
        // =============================================
        // FUNCIÓN: VERIFICAR SELLO
        // =============================================
        async function verifySeal() {
          const sealId = document.getElementById('verifySealId').value.trim();
          
          if (!sealId) {
            alert('❌ Por favor, ingresa un ID de sello para verificar.');
            return;
          }
          
          const button = event.target.closest('.action-button');
          const originalText = button.innerHTML;
          button.innerHTML = '<span>⏳ Verificando sello...</span>';
          button.disabled = true;
          
          try {
            const response = await fetch(\`/api/verify/\${encodeURIComponent(sealId)}\`);
            
            if (!response.ok && response.status !== 404) {
              throw new Error(\`Error HTTP: \${response.status}\`);
            }
            
            const result = await response.json();
            const resultContainer = document.getElementById('verifyResult');
            resultContainer.style.display = 'block';
            
            if (result.success) {
              // Sello válido
              document.getElementById('verifyResultTitle').textContent = '✅ Sello Verificado';
              document.getElementById('verifyStatusBadge').textContent = result.isHoneytoken ? 'HONEYTOKEN' : 'VÁLIDO';
              document.getElementById('verifyStatusBadge').className = result.isHoneytoken ? 'status-badge status-honeytoken' : 'status-badge status-valid';
              document.getElementById('verifyMessage').textContent = result.message;
              document.getElementById('verifyTimestamp').textContent = new Date(result.timestamp).toLocaleString();
              document.getElementById('verifyCount').textContent = \`\${result.verificationCount || 1} vez(es)\`;
              
              if (result.isHoneytoken) {
                resultContainer.classList.add('honeytoken');
              } else {
                resultContainer.classList.remove('honeytoken')