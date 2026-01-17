import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { honeytokenTrap } from "./honeytoken";

const app = express();
const httpServer = createServer(app);

declare module "http" {
    interface IncomingMessage {
        rawBody: unknown;
    }
}

app.use(
    express.json({
        verify: (req: any, _res, buf) => {
            req.rawBody = buf;
        },
    })
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            log(logLine);
        }
    });

    next();
});

// ========== ¡NUEVO: HEALTH CHECK ENDPOINT PARA RAILWAY! ==========
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        service: "SourceSeal Protocol V1.2",
        version: "1.0.0"
    });
});

// ========== ENDPOINT RAÍZ CON INFORMACIÓN ==========
app.get("/", (_req: Request, res: Response) => {
    res.json({
        message: "SourceSeal Colombia Protocol API",
        version: "1.2.0",
        status: "operational",
        endpoints: {
            health: "/health",
            api: "/api/*",
            docs: "https://github.com/your-repo/docs"
        }
    });
});

(async () => {
    await registerRoutes(httpServer, app);
})();

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
});

async function setupDevelopment() {
    if (process.env.NODE_ENV !== "production") {
        try {
            const { setupVite } = await import("./vite");
            await setupVite(httpServer, app);
        } catch (error) {
            console.error("Failed to setup Vite:", error);
        }
    } else {
        serveStatic(app);
    }
}

// ========== PUERTO CONFIGURADO PARA RAILWAY ==========
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// ========== MANEJO DE SEÑALES PARA RAILWAY ==========
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// ========== INICIAR SERVIDOR ==========
(async () => {
    await setupDevelopment();

    httpServer.listen(port, "0.0.0.0", () => {
        log(`✅ SourceSeal ejecutándose en puerto ${port}`);
        log(`📊 Health check disponible en: http://0.0.0.0:${port}/health`);
        log(`🌐 Modo: ${process.env.NODE_ENV || 'development'}`);
    });

    // Manejar errores del servidor
    httpServer.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
            log(`❌ Puerto ${port} ya en uso. Intentando puerto ${port + 1}`);
            httpServer.listen(port + 1, "0.0.0.0");
        } else {
            console.error('Error del servidor:', error);
        }
    });
})();

honeytokenTrap.deploy().catch((err) => {
    console.error("Honeytoken deployment failed:", err);
});

// ========== EXPORT PARA PRUEBAS ==========
export { app, httpServer };