const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos si hay una carpeta 'public'
app.use(express.static('public'));

// Endpoint raíz
app.get('/', (req, res) => {
    res.json({
        project: 'SourceSeal Colombia Protocol V1.2',
        version: '1.2.0',
        description: 'Sistema de sellado digital con Zero-Knowledge Proofs',
        author: 'Giovanny Paredes',
        endpoints: {
            root: '/',
            health: '/health',
            architecture: '/api/architecture',
            zkp: '/api/zkp'
        },
        technologies: ['Node.js', 'Express', 'ZKP (circomlib + snarkjs)'],
        legal_framework: 'Ley 1978 de 2019 (Colombia)',
        repository: 'https://github.com/Giovannypl/SourceSeal-Colombia-Protocol'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Arquitectura técnica
app.get('/api/architecture', (req, res) => {
    res.json({
        version: "1.2.0",
        layers: {
            presentation: "React + TypeScript + Tailwind CSS",
            application: "Node.js + Express API",
            domain: "Zero-Knowledge Proofs (ZKP)",
            infrastructure: "PostgreSQL + Drizzle ORM",
            security: "Honeytoken traps + JWT authentication"
        },
        zkp_flow: [
            "1. Content hash generation (SHA-256)",
            "2. Groth16 circuit compilation",
            "3. Witness generation (private)",
            "4. Proof generation (zk-SNARK)",
            "5. Public verification (proof only)"
        ],
        data_privacy: "Zero-knowledge guarantees: content never exposed"
    });
});

// Demo ZKP
app.get('/api/zkp', (req, res) => {
    res.json({
        technology: "Zero-Knowledge Proofs (ZKP)",
        implementation: "circomlib@2.0.5 + snarkjs@0.7.6",
        purpose: "Verify content integrity without revealing sensitive data",
        use_case: "Digital content sealing with legal validity in Colombia",
        features: [
            "Privacy-first verification",
            "Legal compliance (Law 1978)",
            "Immutable audit trails",
            "Honeytoken leak detection"
        ]
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        available_endpoints: ['/', '/health', '/api/architecture', '/api/zkp']
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`⚡ SourceSeal Colombia Protocol V1.2`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🛡️  Endpoints disponibles:`);
    console.log(`   • / - Información del proyecto`);
    console.log(`   • /health - Estado del servicio`);
    console.log(`   • /api/architecture - Arquitectura técnica`);
    console.log(`   • /api/zkp - Detalles ZKP`);
});