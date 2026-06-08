import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database';
import chatRoutes from './routes/chat.routes';
import moodRoutes from './routes/mood.routes';
import sessionRoutes from './routes/session.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}))
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/session', sessionRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'MindCare Backend is running' });
});

// initDatabase is async with sql.js, so boot after it resolves
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`MindCare backend running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

export default app;
