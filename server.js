const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        message: '✅ SourceSeal Colombia Protocol V1.2 FUNCIONANDO',
        status: 'ACTIVE',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('🎉 ¡ÉXITO! Server funcionando en puerto 3000');
    console.log('👉 Abre: https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co');
});