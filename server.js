const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        message: 'SourceSeal Colombia Protocol V1.2',
        status: 'ACTIVE',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('✅ SourceSeal funcionando en puerto 3000');
});
