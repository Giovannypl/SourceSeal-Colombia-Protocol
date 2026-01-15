import { Application } from 'express';
import { Server } from 'http';

export async function setupVite(httpServer: Server, app: Application): Promise<void> {
    console.log('⚠️  Entorno de desarrollo: Vite no configurado en producción');
    // Placeholder para desarrollo
}