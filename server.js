console.log("🚀 SourceSeal Colombia Protocol V1.2");

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Almacenamiento temporal en memoria
let seals = [];
let nextId = 1;

// Home
app.get('/', (req, res) => {
    res.json({
        project: "SourceSeal Colombia Protocol V1.2",
        version: "1.2.0",
        status: "ACTIVE",
        endpoints: ["/", "/health", "/seals", "/seals/new"],
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: "HEALTHY",
        uptime: process.uptime(),
        sealsCount: seals.length,
        memory: process.memoryUsage().heapUsed / 1024 / 1024 + " MB"
    });
});

// NEW SEAL endpoint
app.post('/seals/new', (req, res) => {
    const { documentHash, owner, metadata } = req.body;
    
    if (!documentHash) {
        return res.status(400).json({ error: "documentHash is required" });
    }
    
    const newSeal = {
        id: nextId++,
        documentHash,
        owner: owner || "Anonymous",
        metadata: metadata || {},
        timestamp: new Date().toISOString(),
        status: "CREATED",
        verified: false
    };
    
    seals.push(newSeal);
    
    res.json({
        success: true,
        message: "✅ New Seal created successfully",
        seal: newSeal
    });
});

// List all seals
app.get('/seals', (req, res) => {
    res.json({
        total: seals.length,
        seals: seals
    });
});

// Iniciar servidor
app.listen(PORT,'0.0.0.0',() => {
    console.log(`✅ SourceSeal Colombia Protocol V1.2`);
    console.log(`🌐 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🕐 Iniciado: ${new Date().toLocaleTimeString()}`);
});