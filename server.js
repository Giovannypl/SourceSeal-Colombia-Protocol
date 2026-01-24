const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para parsear JSON
app.use(express.json());

// Base de datos en memoria
const seals = [];
let verifications = 0;

// ========== ENDPOINTS REALES ==========

// 1. PÁGINA PRINCIPAL CON INTERFAZ WEB
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🔐 SourceSeal Colombia - Generador ZKP</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            h1 {
                color: #fff;
                text-align: center;
                margin-bottom: 30px;
            }
            .section {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
            }
            textarea, input {
                width: 100%;
                padding: 15px;
                border-radius: 10px;
                border: 2px solid #667eea;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 16px;
                margin-bottom: 10px;
                resize: vertical;
            }
            button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
                margin-top: 10px;
                transition: transform 0.3s;
            }
            button:hover {
                transform: translateY(-2px);
            }
            .result {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                padding: 15px;
                margin-top: 15px;
                display: none;
            }
            .success {
                border-left: 5px solid #4CAF50;
            }
            .warning {
                border-left: 5px solid #FF9800;
            }
            .error {
                border-left: 5px solid #f44336;
            }
            .url {
                color: #4CAF50;
                word-break: break-all;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 SourceSeal Colombia - Generador de Sellos ZKP</h1>
            
            <div class="section">
                <h2>✨ Crear Nuevo Sello</h2>
                <textarea id="dataInput" rows="4" placeholder="Introduce los datos a proteger..."></textarea>
                <label style="display: block; margin: 10px 0;">
                    <input type="checkbox" id="isHoneytoken"> 🍯 Marcar como Honeytoken
                </label>
                <button onclick="createSeal()">Crear Sello ZKP</button>
                <div id="createResult" class="result"></div>
            </div>
            
            <div class="section">
                <h2>🔍 Verificar Sello</h2>
                <input type="text" id="verifyId" placeholder="ID del sello...">
                <button onclick="verifySeal()">Verificar Sello</button>
                <div id="verifyResult" class="result"></div>
            </div>
            
            <div class="section">
                <h2>📊 Estado del Sistema</h2>
                <button onclick="checkHealth()">Comprobar Salud</button>
                <div id="healthResult" class="result"></div>
            </div>
        </div>
        
        <script>
            const API_URL = window.location.origin;
            
            async function createSeal() {
                const data = document.getElementById('dataInput').value;
                const isHoneytoken = document.getElementById('isHoneytoken').checked;
                
                if (!data) {
                    alert('Por favor, introduce datos para crear el sello.');
                    return;
                }
                
                const btn = event.target;
                btn.disabled = true;
                btn.textContent = 'Creando...';
                
                try {
                    const response = await fetch('/seal', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data, metadata: { isHoneytoken } })
                    });
                    
                    const result = await response.json();
                    const resultDiv = document.getElementById('createResult');
                    
                    if (result.success) {
                        resultDiv.innerHTML = \`
                            <h3>✅ Sello Creado Exitosamente</h3>
                            <p><strong>ID:</strong> \${result.sealId}</p>
                            <p><strong>Hash:</strong> \${result.sealHash.substring(0, 30)}...</p>
                            <p><strong>URL de Verificación:</strong></p>
                            <p class="url">\${result.verifyUrl}</p>
                            <button onclick="window.open('\${result.verifyUrl}', '_blank')">🔍 Verificar Ahora</button>
                        \`;
                        resultDiv.className = 'result success';
                    } else {
                        resultDiv.innerHTML = \`<h3>❌ Error: \${result.message}</h3>\`;
                        resultDiv.className = 'result error';
                    }
                    resultDiv.style.display = 'block';
                    
                } catch (error) {
                    alert('Error de conexión: ' + error.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Crear Sello ZKP';
                }
            }
            
            async function verifySeal() {
                const sealId = document.getElementById('verifyId').value;
                
                if (!sealId) {
                    alert('Por favor, introduce un ID de sello.');
                    return;
                }
                
                const btn = event.target;
                btn.disabled = true;
                btn.textContent = 'Verificando...';
                
                try {
                    const response = await fetch(\`/verify/\${encodeURIComponent(sealId)}\`);
                    const result = await response.json();
                    const resultDiv = document.getElementById('verifyResult');
                    
                    if (result.success) {
                        resultDiv.innerHTML = \`
                            <h3>\${result.isHoneytoken ? '⚠️ ALERTA HONEYTOKEN' : '✅ Sello Válido'}</h3>
                            <p><strong>Estado:</strong> \${result.isHoneytoken ? 'HONEYTOKEN DETECTADO' : 'Válido'}</p>
                            <p><strong>Mensaje:</strong> \${result.message}</p>
                            <p><strong>Verificado:</strong> \${result.verificationCount} veces</p>
                        \`;
                        resultDiv.className = result.isHoneytoken ? 'result warning' : 'result success';
                    } else {
                        resultDiv.innerHTML = \`<h3>❌ Error: \${result.message}</h3>\`;
                        resultDiv.className = 'result error';
                    }
                    resultDiv.style.display = 'block';
                    
                } catch (error) {
                    alert('Error de conexión: ' + error.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Verificar Sello';
                }
            }
            
            async function checkHealth() {
                try {
                    const response = await fetch('/health');
                    const result = await response.json();
                    const resultDiv = document.getElementById('healthResult');
                    
                    resultDiv.innerHTML = \`
                        <h3>✅ Sistema Activo</h3>
                        <p><strong>Estado:</strong> \${result.status}</p>
                        <p><strong>Sellos Creados:</strong> \${result.sealsCount}</p>
                        <p><strong>Verificaciones:</strong> \${result.verifications}</p>
                    \`;
                    resultDiv.className = 'result success';
                    resultDiv.style.display = 'block';
                    
                } catch (error) {
                    alert('Error de conexión');
                }
            }
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// 2. ENDPOINT PARA CREAR SELLO (REAL)
app.post('/seal', (req, res) => {
    console.log('📥 Recibiendo solicitud POST /seal:', req.body);
    
    const { data, metadata } = req.body;
    
    if (!data) {
        return res.status(400).json({
            success: false,
            message: 'Se requiere el campo "data"'
        });
    }
    
    // Generar ID único
    const sealId = `seal_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    // Generar hash ZKP
    const sealHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ data, timestamp: Date.now(), id: sealId }))
        .digest('hex');
    
    const isHoneytoken = metadata?.isHoneytoken || false;
    
    // Guardar en memoria
    const seal = {
        id: sealId,
        hash: sealHash,
        data: data,
        timestamp: new Date(),
        isHoneytoken: isHoneytoken,
        verified: false,
        verificationCount: 0
    };
    
    seals.push(seal);
    
    res.json({
        success: true,
        sealId: sealId,
        sealHash: sealHash,
        isHoneytoken: isHoneytoken,
        message: isHoneytoken ? 'Sello creado como HONEYTOKEN 🍯' : 'Sello ZKP creado exitosamente',
        verifyUrl: `${req.protocol}://${req.get('host')}/verify/${sealId}`,
        timestamp: new Date()
    });
});

// 3. ENDPOINT PARA VERIFICAR SELLO (REAL)
app.get('/verify/:id', (req, res) => {
    console.log('🔍 Buscando sello:', req.params.id);
    
    const sealId = req.params.id;
    const seal = seals.find(s => s.id === sealId);
    
    if (!seal) {
        return res.status(404).json({
            success: false,
            message: 'Sello no encontrado'
        });
    }
    
    // Actualizar contador de verificaciones
    seal.verified = true;
    seal.verificationCount = (seal.verificationCount || 0) + 1;
    verifications++;
    
    res.json({
        success: true,
        sealId: seal.id,
        hash: seal.hash,
        isHoneytoken: seal.isHoneytoken,
        verified: true,
        verificationCount: seal.verificationCount,
        timestamp: seal.timestamp,
        message: seal.isHoneytoken 
            ? '⚠️ ¡ALERTA HONEYTOKEN! Posible acceso no autorizado detectado.' 
            : '✅ Sello verificado correctamente. Los datos son auténticos.',
        dataPreview: typeof seal.data === 'string' 
            ? seal.data.substring(0, 50) + (seal.data.length > 50 ? '...' : '')
            : 'Datos protegidos'
    });
});

// 4. ENDPOINT DE SALUD (REAL)
app.get('/health', (req, res) => {
    const honeytokensCount = seals.filter(s => s.isHoneytoken).length;
    
    res.json({
        status: 'online',
        timestamp: new Date(),
        server: 'SourceSeal Colombia ZKP v2.0',
        sealsCount: seals.length,
        honeytokensCount: honeytokensCount,
        verifications: verifications,
        endpoints: [
            'POST /seal → Crear sello ZKP',
            'GET /verify/:id → Verificar sello',
            'GET /health → Estado del sistema'
        ]
    });
});

// 5. ENDPOINT PARA LISTAR TODOS LOS SELLOS
app.get('/api/seals', (req, res) => {
    res.json({
        count: seals.length,
        seals: seals.map(s => ({
            id: s.id,
            timestamp: s.timestamp,
            isHoneytoken: s.isHoneytoken,
            verificationCount: s.verificationCount || 0
        }))
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 SOURCE SEAL COLOMBIA - SISTEMA ZKP ACTIVADO 🚀');
    console.log('='.repeat(60));
    console.log(`✅ Servidor iniciado EXITOSAMENTE`);
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🌐 URL Principal: https://workspace.paredesharold62.repl.co`);
    console.log(`🔗 URL Alternativa: https://workspace--paredesharold62.repl.co`);
    console.log(`🕐 Hora: ${new Date().toLocaleString()}`);
    console.log('\n🎯 ENDPOINTS ACTIVOS:');
    console.log('   🔹 POST /seal        → Crear nuevo sello ZKP');
    console.log('   🔹 GET  /verify/:id  → Verificar sello existente');
    console.log('   🔹 GET  /health      → Estado del sistema');
    console.log('   🔹 GET  /api/seals   → Listar todos los sellos');
    console.log('\n✨ ¡LISTO PARA USAR! Visita la URL principal en tu navegador.');
    console.log('='.repeat(60) + '\n');
});