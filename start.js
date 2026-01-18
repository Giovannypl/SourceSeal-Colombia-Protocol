const { exec } = require('child_process');
console.log('🔧 Reiniciando SourceSeal...');
exec('pkill -f node', () => {
    setTimeout(() => {
        exec('node server.js', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Error:', error.message);
                return;
            }
            if (stderr) console.error('⚠️ Advertencia:', stderr);
            console.log('✅ Output:', stdout);
        });
    }, 1000);
});
