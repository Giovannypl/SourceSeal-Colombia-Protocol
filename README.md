cat > README.md << 'EOF'
# SourceSeal Colombia Protocol 🚀

## Instalación en Replit

1. **Importar el repositorio** en Replit
2. **Haz clic en "Run"** (botón verde)
3. **¡Listo!** El servidor se iniciará automáticamente

## Rutas disponibles

- `GET /` - Página principal
- `GET /health` - Estado del servidor
- `GET /info` - Información del sistema

## Variables de entorno

El proyecto usa estas variables por defecto:
- `PORT=3000` (Replit asigna uno automático)
- `NODE_ENV=development`

## Tecnologías

- Node.js v20+
- Express.js
- CORS
- Nodemon (desarrollo)

## Para desarrolladores

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start