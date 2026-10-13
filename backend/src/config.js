import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  port: Number(process.env.PORT) || 3001,
  dbPath: process.env.DB_PATH || path.join(raiz, 'data', 'db.json'),
  // Orígenes permitidos separados por coma; por defecto el servidor de desarrollo de Angular.
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:4200').split(',').map((o) => o.trim()),
};
