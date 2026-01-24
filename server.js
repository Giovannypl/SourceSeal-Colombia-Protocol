const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ MIDDLEWARE ESENCIAL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Crear carpeta public si no existe
if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
}

// ✅ Servir archivos estáticos desde public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ BASE DE DATOS EN MEMORIA (para demo)
let sealsDatabase = [];
let sealCounter = 1;

// ✅ PÁGINA PRINCIPAL
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>🔐 SourceSeal Colombia - ZKP Generator</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', system-ui, sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
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
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            }
            
            header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            }
            
            h1 {
                font-size: 3rem;
                background: linear-gradient(to right, #00dbde, #fc00ff);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                margin-bottom: 10px;
            }
            
            .subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
                margin-bottom: 20px;
            }
            
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 30px;
                margin-bottom: 40px;
            }
            
            .card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 30px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                transition: all 0.3s ease;
            }
            
            .card:hover {
                transform: translateY(-5px);
                border-color: rgba(255, 255, 255, 0.2);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .card h2 {
                color: #00dbde;
                margin-bottom: 20px;
                font-size: 1.8rem;
            }
            
            textarea, input {
                width: 100%;
                padding: 16px;
                border-radius: 12px;
                border: 2px solid #2c5364;
                background: rgba(0, 0, 0, 0.4);
                color: white;
                font-size: 16px;
                margin-bottom: 15px;
                resize: vertical;
                transition: border 0.3s;
            }
            
            textarea:focus, input:focus {
                outline: none;
                border-color: #00dbde;
            }
            
            .btn {
                background: linear-gradient(45deg, #00dbde, #fc00ff);
                color: white;
                border: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
                margin-top: 10px;
            }
            
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            }
            
            .btn:active {
                transform: translateY(0);
            }
            
            .btn-secondary {
                background: linear-gradient(45deg, #8a2be2, #4a00e0);
            }
            
            .checkbox-group {
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 15px 0;
                padding: 10px;
                background: rgba(255, 215, 0, 0.1);
                border-radius: 10px;
            }
            
            .result-box {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 20px;
                margin-top: 20px;
                border-left: 4px solid #00dbde;
                word-wrap: break-word;
                display: none;
            }
            
            .honeytoken {
                border-left-color: #ff416c;
                background: rgba(255, 65, 108, 0.1);
            }
            
            .alert {
                background: rgba(255, 65, 108, 0.2);
                border: 1px solid #ff416c;
                color: #ffcccc;
                padding: 15px;
                border-radius: 12px;
                margin: 20px 0;
            }
            
            .status {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
            }
            
            .status-valid {
                background: rgba(0, 255, 128, 0.2);
                color: #00ff80;
            }
            
            .status-invalid {
                background: rgba(255, 65, 108, 0.2);
                color: #ff416c;
            }
            
            .status-honeytoken {
                background: rgba(255, 215, 0, 0.2);
                color: #ffd700;
            }
            
            footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                opacity: 0.7;
            }
            
            .stats {
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: bold;
                color: #00dbde;
            }
            
            .stat-label {
                font-size: 0.9rem;
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🔐 SourceSeal Colombia</h1>
                <p class="subtitle">Sistema de Verificación ZKP (Zero-Knowledge Proof) & Honeytokens</p>
                <p>Genera sellos criptográficos y detecta accesos no autorizados con honeytokens</p>
            </header>
            
            <div class="stats" id="stats">
                <div class="stat-item">
                    <div class="stat-number" id="totalSeals">0</div>
                    <div class="stat-label">Sellos Totales</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="honeytokensCount">0</div>
                    <div class="stat-label">Honeytokens</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="verificationsCount">0</div>
                    <div class="stat-label">Verificaciones</div>
                </div>
            </div>
            
            <div class="grid">
                <div class="card">
                    <h2>✨ Crear Sello ZKP</h2>
                    <p>Crea un sello criptográfico único para cualquier dato. Opcionalmente marca como honeytoken.</p>
                    
                    <textarea id="dataInput" rows="6" placeholder="Ingresa los datos a proteger (ej: documento, contrato, información sensible)..."></textarea>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="honeytokenCheck">
                        <label for="honeytokenCheck">🍯 <strong>Marcar como Honeytoken</strong> (alertará cuando sea verificado)</label>
                    </div>
                    
                    <button class="btn" onclick="createSeal()">✨ Generar Sello ZKP</button>
                    
                    <div id="createResult" class="result-box">
                        <h3>✅ Sello Creado Exitosamente</h3>
                        <p><strong>ID del Sello:</strong> <span id="sealId"></span></p>
                        <p><strong>Hash ZKP:</strong> <span id="sealHash"></span></p>
                        <p><strong>Tipo:</strong> <span id="sealType"></span></p>
                        <p><strong>URL de Verificación:</strong> <br>
                        <a id="verifyUrl" target="_blank" style="color: #00dbde; word-break: break-all;"></a></p>
                        <button class="btn btn-secondary" onclick="copyToClipboard()" style="margin-top: 10px;">📋 Copiar URL</button>
                    </div>
                </div>
                
                <div class="card">
                    <h2>🔍 Verificar Sello</h2>
                    <p>Verifica la autenticidad de un sello existente. Detecta si es un honeytoken.</p>
                    
                    <input type="text" id="verifyInput" placeholder="Pega aquí el ID del sello...">
                    
                    <button class="btn" onclick="verifySeal()">🔍 Verificar Sello</button>
                    
                    <div id="verifyResult" class="result-box">
                        <h3 id="verifyTitle"></h3>
                        <p><strong>Estado:</strong> <span class="status" id="verifyStatus"></span></p>
                        <p><strong>Tipo:</strong> <span class="status" id="verifyType"></span></p>
                        <p><strong>Fecha de Creación:</strong> <span id="verifyTimestamp"></span></p>
                        <p><strong>Mensaje:</strong> <span id="verifyMessage"></span></p>
                    </div>
                </div>
            </div>
            
            <div class="alert">
                ⚠️ <strong>Nota de Seguridad:</strong> Los honeytokens son "señuelos" que se colocan en datos falsos. Cuando alguien los verifica, se activa una alerta de posible acceso no autorizado.
            </div>
            
            <div class="card">
                <h2>📊 Estado del Sistema</h2>
                <p>Verifica que todos los servicios estén funcionando correctamente.</p>
                <button class="btn btn-secondary" onclick="checkHealth()">🩺 Comprobar Salud del Servidor</button>
                <div id="healthResult" class="result-box"></div>
            </div>
            
            <footer>
                <p>🔒 <strong>SourceSeal Colombia Protocol v2.0</strong> - Sistema ZKP para integridad de datos</p>
                <p>🌐 <strong>URL Pública:</strong> <span id="currentUrl"></span></p>
                <p>🕐 <strong>Servidor Activo:</strong> <span id="serverTime"></span></p>
                <p>📞 <strong>API Endpoints:</strong> POST /seal | GET /verify/:id | GET /health</p>
            </footer>
        </div>
        
        <script>
            // Configuración
            const API_URL = window.location.origin;
            
            // Actualizar UI
            document.getElementById('currentUrl').textContent = API_URL;
            updateServerTime();
            setInterval(updateServerTime, 1000);
            
            function updateServerTime() {
                document.getElementById('serverTime').textContent = new Date().toLocaleString();
            }
            
            // Actualizar estadísticas
            async function updateStats() {
                try {
                    const response = await fetch(API_URL + '/health');
                    const data = await response.json();
                    
                    document.getElementById('totalSeals').textContent = data.sealsCount || 0;
                    document.getElementById('honeytokensCount').textContent = data.honeytokensCount || 0;
                    document.getElementById('verificationsCount').textContent = data.verificationsCount || 0;
                } catch (error) {
                    console.error('Error actualizando estadísticas:', error);
                }
            }
            
            // Crear sello
            async function createSeal() {
                const dataInput = document.getElementById('dataInput').value;
                const isHoneytoken = document.getElementById('honeytokenCheck').checked;
                const btn = document.querySelector('#createCard .btn');
                
                if (!dataInput.trim()) {
                    alert('❌ Por favor, ingresa datos para crear el sello.');
                    return;
                }
                
                btn.disabled = true;
                btn.textContent = '⏳ Generando...';
                
                try {
                    const response = await fetch(API_URL + '/seal', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: dataInput,
                            metadata: {
                                isHoneytoken: isHoneytoken,
                                source: 'web_interface'
                            }
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        // Mostrar resultados
                        document.getElementById('sealId').textContent = result.sealId;
                        document.getElementById('sealHash').textContent = result.sealHash.substring(0, 40) + '...';
                        document.getElementById('sealType').textContent = result.isHoneytoken ? '🍯 HONEYTOKEN' : '🔐 Sello Normal';
                        document.getElementById('verifyUrl').href = result.verifyUrl;
                        document.getElementById('verifyUrl').textContent = result.verifyUrl;
                        
                        const resultBox = document.getElementById('createResult');
                        resultBox.style.display = 'block';
                        
                        if (result.isHoneytoken) {
                            resultBox.classList.add('honeytoken');
                        } else {
                            resultBox.classList.remove('honeytoken');
                        }
                        
                        // Actualizar stats
                        updateStats();
                        
                        alert('✅ Sello creado exitosamente!\nID: ' + result.sealId);
                    } else {
                        alert('❌ Error: ' + (result.message || 'Error desconocido'));
                    }
                } catch (error) {
                    alert('❌ Error de conexión: ' + error.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = '✨ Generar Sello ZKP';
                }
            }
            
            // Verificar sello
            async function verifySeal() {
                const sealId = document.getElementById('verifyInput').value.trim();
                const btn = document.querySelector('#verifyCard .btn');
                
                if (!sealId) {
                    alert('❌ Por favor, ingresa un ID de sello.');
                    return;
                }
                
                btn.disabled = true;
                btn.textContent = '⏳ Verificando...';
                
                try {
                    const response = await fetch(API_URL + '/verify/' + encodeURIComponent(sealId));
                    const result = await response.json();
                    
                    const resultBox = document.getElementById('verifyResult');
                    resultBox.style.display = 'block';
                    
                    if (result.success) {
                        document.getElementById('verifyTitle').textContent = '✅ Sello Verificado';
                        document.getElementById('verifyStatus').textContent = 'VÁLIDO';
                        document.getElementById('verifyStatus').className = 'status status-valid';
                        
                        if (result.isHoneytoken) {
                            document.getElementById('verifyType').textContent = '🍯 HONEYTOKEN';
                            document.getElementById('verifyType').className = 'status status-honeytoken';
                            resultBox.classList.add('honeytoken');
                        } else {
                            document.getElementById('verifyType').textContent = '🔐 Sello Normal';
                            document.getElementById('verifyType').className = 'status status-valid';
                            resultBox.classList.remove('honeytoken');
                        }
                        
                        document.getElementById('verifyTimestamp').textContent = new Date(result.timestamp).toLocaleString();
                        document.getElementById('verifyMessage').textContent = result.message;
                    } else {
                        document.getElementById('verifyTitle').textContent = '❌ Error de Verificación';
                        document.getElementById('verifyStatus').textContent = 'INVÁLIDO';
                        document.getElementById('verifyStatus').className = 'status status-invalid';
                        document.getElementById('verifyType').textContent = 'N/A';
                        document.getElementById('verifyTimestamp').textContent = 'N/A';
                        document.getElementById('verifyMessage').textContent = result.message;
                        resultBox.classList.remove('honeytoken');
                    }
                    
                    // Actualizar stats
                    updateStats();
                    
                } catch (error) {
                    alert('❌ Error de conexión: ' + error.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = '🔍 Verificar Sello';
                }
            }
            
            // Comprobar salud del servidor
            async function checkHealth() {
                try {
                    const response = await fetch(API_URL + '/health');
                    const result = await response.json();
                    
                    const healthBox = document.getElementById('healthResult');
                    healthBox.innerHTML = \`
                        <h3>✅ Servidor Funcionando</h3>
                        <p><strong>Estado:</strong> <span class="status status-valid">ACTIVO</span></p>
       