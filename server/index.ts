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
        if (path === "/health") return; // Silence health checks
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

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

(async () => {
    await setupDevelopment();
    
    httpServer.listen(
        {
            port,
            host: "0.0.0.0",
        },
        () => {
            log(`✅ SourceSeal ejecutándose en puerto ${port}`);
        }
    );
})();

honeytokenTrap.deploy().catch((err) => {
    console.error("Honeytoken deployment failed:", err);
});
