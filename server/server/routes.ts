import { Application } from 'express';
import { Server } from 'http';

export async function registerRoutes(httpServer: Server, app: Application): Promise<void> {
    // Ruta principal de SourceSeal
    app.get('/', (req, res) => {
        res.json({ 
            status: '✅ SourceSeal v2.0 Online',
            shard: 'COL-01',
            message: 'Despliegue Railway completado exitosamente',
            timestamp: new Date().toISOString()
        });
    });
    
    // Ruta de salud para Railway
    app.get('/health', (req, res) => {
        res.status(200).send('OK');
    });
    
    console.log('✅ Rutas básicas registradas');
}