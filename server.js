console.log("🎯 Iniciando servidor básico...");

const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "¡API FUNCIONANDO!",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log("✅ Servidor listo en puerto", PORT);
  console.log("🌐 Abre: https://" + process.env.REPL_SLUG + "." + process.env.REPL_OWNER + ".repl.co");
});
