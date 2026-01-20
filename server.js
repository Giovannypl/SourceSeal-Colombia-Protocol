const express = require('express');
const app = express();
const PORT = 3000;

// Solo 1 endpoint simple
app.get('/', (req, res) => {
    res.json({
        message: '✅ ¡FUNCIONA! SourceSeal Colombia Protocol V1.2',
        status: 'ACTIVE',
        timestamp: new Date().toISOString(),
        author: 'Giovanny Paredes'
    });
});

// Solo 1 console.log
app.listen(PORT, () => {
    console.log('🎉 ¡SERVIDOR FUNCIONANDO!');
    console.log('🌐 URL: https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co');
    console.log('⏰ Hora: ' + new Date().toLocaleTimeString());
});