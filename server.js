cat > server.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());

// Página principal - DISEÑO PROFESIONAL
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 SourceSeal Colombia Protocol v2.0</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
      :root {
        --primary: #00ff88;
        --secondary: #00ccff;
        --dark: #0a0a0a;
        --darker: #050505;
        --light: #ffffff;
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: var(--darker);
        color: var(--light);
        min-height: 100vh;
        line-height: 1.6;
        background-image: 
          radial-gradient(circle at 10% 20%, rgba(0, 255, 136, 0.05) 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, rgba(0, 204, 255, 0.05) 0%, transparent 20%);
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      
      /* HEADER */
      .header {
        text-align: center;
        margin-bottom: 60px;
        padding: 40px 0;
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.1));
        border-radius: 25px;
        border: 1px solid rgba(0, 255, 136, 0.2);
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
      }
      
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .logo {
        font-size: 4.5rem;
        color: var(--primary);
        margin-bottom: 20px;
        text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      h1 {
        font-size: 3.5rem;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin-bottom: 15px;
      }
      
      .subtitle {
        font-size: 1.4rem;
        color: rgba(255, 255, 255, 0.8);
        max-width: 800px;
        margin: 0 auto 30px;
      }
      
      .status-badge {
        display: inline-block;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        color: var(--dark);
        padding: 18px 45px;
        border-radius: 100px;
        font-size: 1.8rem;
        font-weight: bold;
        margin: 20px 0;
        box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
        animation: float 3s ease-in-out infinite;
        position: relative;
        z-index: 2;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      
      /* CARDS */
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
      }
      
      .card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 35px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
      }
      
      .card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
      }
      
      .card:hover {
        transform: translateY(-10px);
        border-color: var(--primary);
        box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2);
      }
      
      .card h2 {
        color: var(--primary);
        font-size: 1.8rem;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      .card h2 i {
        font-size: 2rem;
      }
      
      .url-display {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid var(--primary);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        font-family: 'Courier New', monospace;
        font-size: 1.1rem;
        word-break: break-all;
        color: var(--primary);
        transition: all 0.3s;
      }
      
      .url-display:hover {
        background: rgba(0, 255, 136, 0.1);
        transform: scale(1.01);
      }
      
      /* BUTTONS */
      .btn-group {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin: 25px 0;
        justify-content: center;
      }
      
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        color: var(--dark);
        padding: 18px 35px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.2rem;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .btn::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s;
      }
      
      .btn:hover::after {
        transform: translateX(100%);
      }
      
      .btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0, 255, 136, 0.4);
      }
      
      /* STATS */
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 25px;
        margin: 50px 0;
      }
      
      .stat-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 30px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s;
      }
      
      .stat-item:hover {
        border-color: var(--primary);
        transform: translateY(-5px);
      }
      
      .stat-value {
        font-size: 3rem;
        color: var(--primary);
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .stat-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 1.1rem;
      }
      
      /* FEATURES */
      .features {
        background: rgba(0, 255, 136, 0.05);
        border-radius: 25px;
        padding: 50px;
        margin: 60px 0;
        border: 1px solid rgba(0, 255, 136, 0.2);
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
        margin-top: 40px;
      }
      
      .feature-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 25px;
        border-radius: 15px;
        border-left: 5px solid var(--primary);
        transition: all 0.3s;
      }
      
      .feature-item:hover {
        background: rgba(0, 255, 136, 0.1);
        transform: translateX(10px);
      }
      
      .feature-item i {
        color: var(--primary);
        font-size: 2rem;
        margin-bottom: 15px;
      }
      
      /* FOOTER */
      footer {
        text-align: center;
        padding: 40px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin-top: 60px;
        color: rgba(255, 255, 255, 0.6);
      }
      
      .social-links {
        display: flex;
        justify-content: center;
        gap: 25px;
        margin: 25px 0;
      }
      
      .social-links a {
        color: var(--primary);
        font-size: 1.5rem;
        transition: all 0.3s;
      }
      
      .social-links a:hover {
        color: var(--secondary);
        transform: scale(1.3);
      }
      
      /* RESPONSIVE */
      @media (max-width: 768px) {
        h1 { font-size: 2.5rem; }
        .logo { font-size: 3.5rem; }
        .subtitle { font-size: 1.2rem; }
        .status-badge { font-size: 1.4rem; padding: 15px 30px; }
        .cards-grid { grid-template-columns: 1fr; }
        .card { padding: 25px; }
        .btn-group { flex-direction: column; }
        .btn { width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- HEADER -->
      <header class="header">
        <div class="logo">
          <i class="fas fa-seedling"></i>
        </div>
        <h1>SOURCE SEAL COLOMBIA</h1>
        <p class="subtitle">Protocolo de autenticación ZKP para la verificación segura de documentos y transacciones digitales en Colombia</p>
        <div class="status-badge">
          <i class="fas fa-check-circle"></i> SISTEMA 100% OPERATIVO
        </div>
      </header>
      
      <!-- STATS -->
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">${PORT}</div>
          <div class="stat-label">PUERTO ACTIVO</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">ZKP</div>
          <div class="stat-label">TECNOLOGÍA</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">24/7</div>
          <div class="stat-label">DISPONIBILIDAD</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">v2.0</div>
          <div class="stat-label">VERSIÓN</div>
        </div>
      </div>
      
      <!-- CARDS GRID -->
      <div class="cards-grid">
        <!-- URL Card -->
        <div class="card">
          <h2><i class="fas fa-globe"></i> URLs DE ACCESO</h2>
          <p>Conéctate al sistema usando cualquiera de estas URLs:</p>
          
          <div class="url-display">
            https://${process.env.REPL_SLUG || 'workspace'}.${process.env.REPL_OWNER || 'paredesharold62'}.repl.co
          </div>
          
          <div class="url-display">
            https://${process.env.REPL_SLUG || 'workspace'}--${process.env.REPL_OWNER || 'paredesharold62'}.repl.co
          </div>
          
          <div class="btn-group">
            <button class="btn" onclick="window.open('https://${process.env.REPL_SLUG || 'workspace'}.${process.env.REPL_OWNER || 'paredesharold62'}.repl.co', '_blank')">
              <i class="fas fa-external-link-alt"></i> ABRIR SITIO
            </button>
            <button class="btn" onclick="copyURL('https://${process.env.REPL_SLUG || 'workspace'}.${process.env.REPL_OWNER || 'paredesharold62'}.repl.co')">
              <i class="fas fa-copy"></i> COPIAR URL
            </button>
          </div>
        </div>
        
        <!-- API Card -->
        <div class="card">
          <h2><i class="fas fa-bolt"></i> ENDPOINTS API</h2>
          <p>Interfaces disponibles para integración:</p>
          
          <div class="features-grid" style="margin-top: 20px;">
            <div class="feature-item">
              <i class="fas fa-home"></i>
              <h3>GET /</h3>
              <p>Página principal</p>
            </div>
            <div class="feature-item">
              <i class="fas fa-heartbeat"></i>
              <h3>GET /health</h3>
              <p>Estado del servidor</p>
            </div>
            <div class="feature-item">
              <i class="fas fa-seedling"></i>
              <h3>POST /seal</h3>
              <p>Crear sello ZKP</p>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <h3>GET /verify/:id</h3>
              <p>Verificar sello</p>
            </div>
          </div>
          
          <div class="btn-group">
            <button class="btn" onclick="testAPI()">
              <i class="fas fa-vial"></i> PROBAR API
            </button>
            <button class="btn" onclick="testSeal()">
              <i class="fas fa-seedling"></i> CREAR SELLO
            </button>
          </div>
        </div>
      </div>
      
      <!-- FEATURES -->
      <div class="features">
        <h2 style="text-align: center; color: var(--primary); margin-bottom: 40px; font-size: 2.5rem;">
          <i class="fas fa-star"></i> CARACTERÍSTICAS PRINCIPALES
        </h2>
        
        <div class="features-grid">
          <div class="feature-item">
            <i class="fas fa-user-shield"></i>
            <h3>Autenticación ZKP</h3>
            <p>Verificación sin revelar información sensible usando Zero-Knowledge Proofs</p>
          </div>
          
          <div class="feature-item">
            <i class="fas fa-bolt"></i>
            <h3>Alta Velocidad</h3>
            <p>Procesamiento en tiempo real con latencia mínima</p>
          </div>
          
          <div class="feature-item">
            <i class="fas fa-lock"></i>
            <h3>Seguridad Total</h3>
            <p>Encriptación de extremo a extremo con claves únicas</p>
          </div>
          
          <div class="feature-item">
            <i class="fas fa-code"></i>
            <h3>API RESTful</h3>
            <p>Integración sencilla con cualquier sistema o plataforma</p>
          </div>
        </div>
      </div>
      
      <!-- CALL TO ACTION -->
      <div style="text-align: center; margin: 60px 0;">
        <h2 style="color: var(--primary); margin-bottom: 30px; font-size: 2.5rem;">
          <i class="fas fa-rocket"></i> ¿LISTO PARA COMENZAR?
        </h2>
        
        <div class="btn-group">
          <button class="btn" onclick="showDemo()" style="background: linear-gradient(90deg, #ff0080, #00ccff);">
            <i class="fas fa-play-circle"></i> VER DEMOSTRACIÓN
          </button>
          <button class="btn" onclick="window.open('https://github.com/Giovannyp/L/SourceSeal-Colombia-Protocol', '_blank')">
            <i class="fab fa-github"></i> VER CÓDIGO FUENTE
          </button>
          <button class="btn" onclick="document.getElementById('docs').scrollIntoView()">
            <i class="fas fa-book"></i> DOCUMENTACIÓN
          </button>
        </div>
      </div>
      
      <!-- FOOTER -->
      <footer>
        <div class="logo" style="font-size: 2.5rem; margin-bottom: 20px;">
          <i class="fas fa-seedling"></i>
        </div>
        
        <p>© 2024 SourceSeal Colombia Protocol v2.0</p>
        <p>Sistema de autenticación ZKP para la transformación digital de Colombia</p>
        
        <div class="social-links">
          <a href="#"><i class="fab fa-github"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-linkedin"></i></a>
          <a href="#"><i class="fab fa-discord"></i></a>
        </div>
        
        <p style="margin-top: 25px; color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;">
          <i class="fas fa-server"></i> Puerto: ${PORT} | 
          <i class="fas fa-code"></i> Node.js ${process.version} | 
          <i class="fas fa-clock"></i> ${new Date().toLocaleString('es-CO')}
        </p>
      </footer>
    </div>
    
    <!-- JavaScript -->
    <script>
      console.log('🚀 SourceSeal Colombia Protocol v2.0');
      console.log('✅ Servidor operativo en puerto: ${PORT}');
      console.log('🌐 URL Principal: https://${process.env.REPL_SLUG || 'workspace'}.${process.env.REPL_OWNER || 'paredesharold62'}.repl.co');
      
      // Función para copiar URL
      function copyURL(url) {
        navigator.clipboard.writeText(url)
          .then(() => {
            alert('✅ URL copiada al portapapeles:\\n' + url);
          })
          .catch(err => {
            console.error('Error al copiar: ', err);
          });
      }
      
      // Función para probar la API
      function testAPI() {
        fetch('/health')
          .then(response => response.json())
          .then(data => {
            const message = 
              '✅ API funcionando correctamente\\n\\n' +
              '📊 Estado: ' + data.status + '\\n' +
              '🚀 Versión: ' + data.version + '\\n' +
              '📡 Puerto: ' + data.port + '\\n' +
              '⏰ Hora: ' + new Date(data.timestamp).toLocaleTimeString();
            
            alert(message);
          })
          .catch(error => {
            alert('❌ Error al conectar con la API: ' + error.message);
          });
      }
      
      // Función para crear un sello de prueba
      function testSeal() {
        fetch('/seal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: 'Documento de prueba ZKP',
            timestamp: new Date().toISOString()
          })
        })
        .then(response => response.json())
        .then(data => {
          const message = 
            '✅ Sello ZKP creado exitosamente\\n\\n' +
            '🆔 ID: ' + data.seal.id + '\\n' +
            '⏰ Fecha: ' + new Date(data.seal.timestamp).toLocaleString() + '\\n' +
            '🔒 Estado: ' + (data.seal.verified ? 'Verificado' : 'Pendiente');
          
          alert(message);
        })
        .catch(error => {
          alert('❌ Error al crear sello: ' + error.message);
        });
      }
      
      // Función para mostrar demostración
      function showDemo() {
        alert('🚀 Demostración del Sistema ZKP\\n\\n' +
              '1. Autenticación sin contraseñas\\n' +
              '2. Verificación de documentos\\n' +
              '3. Transacciones seguras\\n\\n' +
              '📧 Contacta al equipo para una demo completa.');
      }
      
      // Efecto de escritura para el título
      const title = document.querySelector('h1');
      const originalText = title.textContent;
      title.textContent = '';
      let charIndex = 0;
      
      function typeWriter() {
        if (charIndex < originalText.length) {
          title.textContent += originalText.charAt(charIndex);
          charIndex++;
          setTimeout(typeWriter, 50);
        }
      }
      
      // Iniciar efecto después de cargar
      window.addEventListener('load', () => {
        setTimeout(typeWriter, 1000);
        
        // Actualizar hora cada minuto
        setInterval(() => {
          const timeElement = document.querySelector('footer p:last-child');
          if (timeElement) {
            timeElement.innerHTML = 
              `<i class="fas fa-server"></i> Puerto: ${PORT} | ` +
              `<i class="fas fa-code"></i> Node.js ${process.version} | ` +
              `<i class="fas fa-clock"></i> ${new Date().toLocaleString('es-CO')}`;
          }
        }, 60000);
      });
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: '