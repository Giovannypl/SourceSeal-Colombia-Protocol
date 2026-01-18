# Crea la carpeta server si no existe
mkdir -p server

# Crea un index.ts básico
cat > server/index.ts << 'EOF'
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        message: 'SourceSeal Colombia Protocol V1.2',
        status: 'ACTIVE',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'SourceSeal' });
});

app.listen(PORT, () => {
    console.log(`🚀 SourceSeal ejecutándose en puerto ${PORT}`);
});
EOF