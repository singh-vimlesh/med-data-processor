import express from 'express';
import dotenv from 'dotenv';

import patientRoutes from './routes/patientRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

export const app = express();

app.use(express.text({ type: 'text/plain' }));
app.use(express.json());

app.use('/patient', patientRoutes);

app.get('/', (_req, res) => {
  res.send({
    message: 'Welcome to med-message-processor API.',
  });
});

app.all('*', (_req, res) => {
  res.status(405).json({ error: 'Invalid method.' });
});

app.use(errorHandler);

export default app;
