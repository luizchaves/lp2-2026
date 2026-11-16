import { errorHandler, notFoundHandler } from '@/middlewares/errorHandlers.ts';
import express from 'express';
import morgan from 'morgan';
import { pathToFileURL } from 'node:url';

import investmentRoutes from '@/routes/investments.routes.ts';
import categoryRoutes from '@/routes/categories.routes.ts';
import brokerRoutes from '@/routes/brokers.routes.ts';
import userRoutes from '@/routes/users.routes.ts';
import authRoutes from '@/routes/auth.routes.ts';

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

app.use('/api', investmentRoutes);
app.use('/api', categoryRoutes);
app.use('/api', brokerRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.redirect('/home.html');
});

app.use(notFoundHandler);

app.use(errorHandler);

// Sobe o servidor só quando executado direto. Importado por um teste, o app
// é usado em memória pelo supertest, sem abrir porta.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(3000, () => console.log('Investment API listening on port 3000'));
}

export default app;
