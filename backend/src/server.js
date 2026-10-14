import { app } from './app.js';
import { config } from './config.js';

const servidor = app.listen(config.port, () => {
  console.log(`API de DancyPet escuchando en http://localhost:${config.port}`);
});

servidor.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${config.port} ya está en uso. Libéralo o usa otro: PORT=3002 npm run dev`);
    process.exit(1);
  }
  throw err;
});
