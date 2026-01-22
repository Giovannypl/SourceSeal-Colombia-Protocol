const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;  // PUERTO 5000

// ... (todo el resto del código se mantiene IGUAL)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ╔══════════════════════════════════════════════════╗
    ║      🚀 SOURCE SEAL COLOMBIA PROTOCOL V2.0      ║
    ║           API PÚBLICA - PUERTO 5000             ║
    ╚══════════════════════════════════════════════════╝
    
    ✅ Servidor iniciado correctamente
    📍 Puerto: ${PORT}
    
    🌐 URLs de acceso:
       Local:    http://localhost:${PORT}
       Público:  https://source-seal-protocol-1--paredesharold62.repl.co
    
    📊 Endpoints disponibles:
       1. GET    /           → Información API
       2. GET    /health     → Estado servidor
       3. GET    /seals      → Listar sellos
       4. POST   /seals/new  → Crear sello ZKP
       5. GET    /stats      → Estadísticas
       6. GET    /verify/:id → Verificar sello
    
    🛡️  Sistema listo para operaciones ZKP
    ⏰  ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}
    `);
});