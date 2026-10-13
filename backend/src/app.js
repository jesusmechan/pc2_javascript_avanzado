import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { manejarErrores, rutaNoEncontrada } from './middlewares/manejar-errores.js';
import { categoriasRouter } from './routes/categorias.routes.js';
import { librosRouter } from './routes/libros.routes.js';
import { prestamosRouter } from './routes/prestamos.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ estado: 'ok' }));

// Mismas rutas que exponía json-server, para que el frontend no cambie.
app.use('/libros', librosRouter);
app.use('/categorias', categoriasRouter);
app.use('/prestamos', prestamosRouter);

app.use(rutaNoEncontrada);
app.use(manejarErrores);
