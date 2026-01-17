import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { honeytokenTrap } from "./honeytoken";

const app = express();
const httpServer = createServer(app);

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Función de logging simple
export function log(message: string, source = "express") {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] [${source}] ${message}`);
}

// Middleware de logging para peticiones API
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
        }
    });
    
    next();
});

// ========== ENDPOINTS BÁSICOS ==========
app.get("/health", (_req: Request, res: Response) => {
    res.json({ 
        status: "OK", 
        message: "SourceSeal Protocol V1.2 está operativo",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (_req: Request, res: Response) => {
    res.json({
        name: "SourceSeal Colombia Protocol",
        version: "1.2.0",
        description: "Sistema de sellado digital con ZKP",
        status: "active",
        endpoints: ["/health", "/api/*"]
    });
});

// ========== REGISTRAR RUTAS DE LA APLICACIÓN ==========
(async () => {
    try {
        await registerRoutes(httpServer, app);
        log("✅ Rutas registradas correctamente");
    } catch (error) {
        log(`❌ Error registrando rutas: ${error}`, "error");
    }
})();

// ========== MANEJADOR DE ERRORES GLOBAL ==========
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor"
    });
});

// ========== CONFIGURACIÓN DE DESARROLLO/PRODUCCIÓN ==========
async function setupEnvironment() {
    // En Replit, siempre servimos archivos estáticos
    // (Replit maneja el frontend por separado)
    serveStatic(app);
    log("✅ Servidor estático configurado");
}

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3000;

(async () => {
    await setupEnvironment();
    
    httpServer.listen(PORT, () => {
        log(`🚀 Servidor iniciado en puerto ${PORT}`);
        log(`🌐 URL local: http://localhost:${PORT}`);
        log(`🔗 Health check: http://localhost:${PORT}/health`);
        log(`🛡️  SourceSeal Protocol V1.2 - LISTO`);
    });
})();

// ========== HONEYTOKEN (OPCIONAL) ==========
// Solo ejecutar honeytoken si existe y está configurado
if (typeof honeytokenTrap?.deploy === 'function') {
    honeytokenTrap.deploy().catch((err: any) => {
        console.warn("⚠️  Honeytoken no pudo inicializar:", err.message);
    });
}

// ========== EXPORT PARA PRUEBAS ==========
export { app, httpServer };