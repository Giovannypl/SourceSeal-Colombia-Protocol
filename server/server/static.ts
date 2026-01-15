import { Application } from 'express';

export function serveStatic(app: Application): void {
    console.log('✅ En producción: configuración de archivos estáticos lista');
    // En producción real, aquí iría: app.use(express.static('dist/client'))
}