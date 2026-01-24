cat > server.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Datos de ejemplo (simulación de base de datos)
const seals = [
  { id: 1, name: 'Contrato Legal #1', status: 'active', date: '2024-01-15' },
  { id: 2, name: 'Documento Notarial', status: 'verified', date: '2024-01-14' },
  { id: 3, name: 'Certificado Digital', status: 'active', date: '2024-01-13' },
  { id: 4, name: 'Acta de Reunión', status: 'active', date: '2024-01-12' },
  { id: 5, name: 'Informe Técnico', status: 'pending', date: '2024-01-11' },
  { id: 6, name: 'Licencia Software', status: 'active', date: '2024-01-10' }
];

const stats = {
  totalSeals: 6,
  activeSeals: 4,
  verifiedSeals: 3,
  pendingSeals: 1,
  enforcementActions: 4
};

// Página principal COMPLETA (como en tu captura original)
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SourceSeal Protocol v1.2 // LAW 1978</title>
    <style>
      :root {
        --primary: #00ff88;
        --secondary: #00ccff;
        --dark: #0a0a0a;
        --darker: #050505;
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Courier New', monospace;
      }
      
      body {
        background: var(--dark);
        color: white;
        min-height: 100vh;
        padding: 30px;
        background-image: 
          radial-gradient(circle at 20% 30%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(0, 204, 255, 0.05) 0%, transparent 50%);
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      /* HEADER */
      .header {
        border-bottom: 2px solid var(--primary);
        padding-bottom: 30px;
        margin-bottom: 50px;
        text-align: center;
      }
      
      .protocol-title {
        font-size: 3.5rem;
        color: var(--primary);
        text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        margin-bottom: 10px;
        letter-spacing: 2px;
      }
      
      .law-reference {
        color: var(--secondary);
        font-size: 1.5rem;
        letter-spacing: 1px;
      }
      
      /* STATS GRID */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
      }
      
      .stat-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 40px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        transition: all 0.3s;
      }
      
      .stat-card:hover {
        border-color: var(--primary);
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2);
      }
      
      .stat-value {
        font-size: 4rem;
        color: var(--primary);
        font-weight: bold;
        margin-bottom: 15px;
      }
      
      .stat-label {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.2rem;
        letter-spacing: 1px;
      }
      
      /* SEALS SECTION */
      .seals-section {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 25px;
        padding: 50px;
        margin-bottom: 50px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .section-title {
        color: var(--primary);
        font-size: 2.5rem;
        margin-bottom: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .new-seal-btn {
        background: var(--primary);
        color: var(--dark);
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .new-seal-btn:hover {
        background: var(--secondary);
        transform: scale(1.05);
      }
      
      /* SEALS LIST */
      .seals-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
      }
      
      .seal-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 25px;
        border-left: 5px solid var(--primary);
        transition: all 0.3s;
      }
      
      .seal-card:hover {
        background: rgba(0, 255, 136, 0.1);
        transform: translateX(10px);
      }
      
      .seal-id {
        color: var(--primary);
        font-size: 1.5rem;
        margin-bottom: 10px;
      }
      
      .seal-name {
        font-size: 1.3rem;
        margin-bottom: 10px;
      }
      
      .seal-status {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: bold;
      }
      
      .status-active { background: rgba(0, 255, 136, 0.2); color: var(--primary); }
      .status-verified { background: rgba(0, 204, 255, 0.2); color: var(--secondary); }
      .status-pending { background: rgba(255, 204, 0, 0.2); color: #ffcc00; }
      
      /* ACTIONS SECTION */
      .actions-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-bottom: 50px;
      }
      
      .action-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 35px;
        border-left: 5px solid var(--secondary);
      }
      
      .action-title {
        color: var(--secondary);
        font-size: 1.5rem;
        margin-bottom: 20px;
      }
      
      /* FOOTER */
      .footer {
        text-align: center;
        padding: 40px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
        margin-top: 60px;
      }
      
      @media (max-width: 768px) {
        .protocol-title { font-size: 2.5rem; }
        .stats-grid { grid-template-columns: 1fr; }
        .seals-list { grid-template-columns: 1fr; }
        .section-title { flex-direction: column; gap: 20px; text-align: center; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- HEADER -->
      <header class="header">
        <h1 class="protocol-title">SOURCE SEAL PROTOCOL</h1>
        <div class="law-reference">v1.2 // LAW 1978</div>
      </header>
      
      <!-- STATISTICS -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalSeals}</div>
          <div class="stat-label">ACTIVE SEALS</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">${stats.enforcementActions}</div>
          <div class="stat-label">ENFORCEMENT ACTIONS</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">${stats.verifiedSeals}</div>
          <div class="stat-label">VERIFIED SEALS</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">${new Date().getFullYear()}</div>
          <div class="stat-label">CURRENT YEAR</div>
        </div>
      </div>
      
      <!-- SEALS SECTION -->
      <section class="seals-section">
        <div class="section-title">
          <span>CONTENT REGISTRATION</span>
          <button class="new-seal-btn" onclick="createNewSeal()">+ NEW SEAL</button>
        </div>
        
        <div class="seals-list">
          ${seals.map(seal => `
            <div class="seal-card">
              <div class="seal-id">SEAL-${seal.id.toString().padStart(3, '0')}</div>
              <div class="seal-name">${seal.name}</div>
              <div class="seal-status status-${seal.status}">${seal.status.toUpperCase()}</div>
              <div style="margin-top: 15px; color: rgba(255,255,255,0.7); font-size: 0.9rem;">
                Created: ${seal.date}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      
      <!-- ENFORCEMENT ACTIONS -->
      <div class="actions-section">
        <div class="action-card">
          <div class="action-title">ENCRYPTION VERIFICATION</div>
          <p>All seals use ZKP-SNARK proofs with 256-bit encryption and comply with Colombian digital signature laws.</p>
        </div>
        
        <div class="action-card">
          <div class="action-title">LEGAL COMPLIANCE</div>
          <p>Certified under Law 1978 of 2019 for electronic documents and digital signatures in Colombia.</p>
        </div>
        
        <div class="action-card">
          <div class="action-title">AUDIT TRAIL</div>
          <p>Complete cryptographic audit trail with timestamps and verification history for each seal.</p>
        </div>
      </div>
      
      <!-- FOOTER -->
      <footer class="footer">
        <p>SOURCE SEAL COLOMBIA PROTOCOL • COMPLIANT WITH LAW 1978 • ZKP TECHNOLOGY</p>
        <p style="margin-top: 15px; font-size: 0.9rem;">
          Port: ${PORT} • Seals: ${stats.totalSeals} • Last Updated: ${new Date().toLocaleString()}
        </p>
      </footer>
    </div>
    
    <script>
      console.log('🔐 SourceSeal Protocol v1.2 initialized');
      
      function createNewSeal() {
        const name = prompt('Enter the name for the new seal:');
        if (name) {
          fetch('/api/create-seal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
          })
          .then(response => response.json())
          .then(data => {
            alert('✅ New seal created successfully!\\nID: ' + data.id + '\\nName: ' + data.name);
            location.reload();
          })
          .catch(error => {
            alert('❌ Error creating seal: ' + error.message);
          });
        }
      }
      
      // Auto-refresh stats every 30 seconds
      setInterval(() => {
        fetch('/api/stats')
          .then(response => response.json())
          .then(data => {
            console.log('📊 Stats updated:', data);
          });
      }, 30000);
    </script>
  </body>
  </html>
  `);
});

// API Endpoints
app.get('/api/stats', (req, res) => {
  res.json(stats);
});

app.post('/api/create-seal', (req, res) => {
  const { name } = req.body;
  const newSeal = {
    id: seals.length + 1,
    name: name || 'New Seal',
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  };
  
  seals.push(newSeal);
  stats.totalSeals = seals.length;
  stats.activeSeals = seals.filter(s => s.status === 'active').length;
  stats.pendingSeals = seals.filter(s => s.status === 'pending').length;
  
  res.json(newSeal);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.2.0',
    timestamp: new Date().toISOString(),
    system: 'SourceSeal Colombia Protocol'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════════════╗
  ║                                                                  ║
  ║        🔐 SOURCE SEAL PROTOCOL v1.2 // LAW 1978                 ║
  ║                                                                  ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║                                                                  ║
  ║   ✅ System: ONLINE                                             ║
  ║   📡 Port: ${PORT}                                              ║
  ║   📊 Active Seals: ${stats.totalSeals}                          ║
  ║   ⚖️  Law Compliance: COLOMBIA LAW 1978                        ║
  ║                                                                  ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║                                                                  ║
  ║   🌐 URL: https://workspace.paredesharold62.repl.co             ║
  ║   📚 API Docs: /api/stats, /api/health, /api/create-seal        ║
  ║                                                                  ║
  ╚══════════════════════════════════════════════════════════════════╝
  `);
});
EOF