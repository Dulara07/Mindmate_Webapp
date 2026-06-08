import { Router, Request, Response } from 'express';
import { getMoodHistory, logMood } from '../services/session.service';

const router = Router();

/**
 * GET /api/mood/history/:sessionId
 * Returns: mood log history for a session
 */
router.get('/history/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    res.status(400).json({ error: 'sessionId is required' });
    return;
  }

  const history = getMoodHistory(sessionId);
  res.json({ sessionId, history });
});

/**
 * POST /api/mood/log
 * Body: { sessionId: string, mood: string, note?: string }
 * Returns: the saved mood entry
 */
router.post('/log', (req: Request, res: Response) => {
  const { sessionId, mood, note } = req.body as {
    sessionId?: string;
    mood?: string;
    note?: string;
  };

  if (!sessionId || !mood) {
    res.status(400).json({ error: 'sessionId and mood are required' });
    return;
  }

  logMood(sessionId, mood, note);

  res.status(201).json({
    sessionId,
    mood,
    note: note ?? null,
    created_at: new Date().toISOString(),
  });
});

export default router;
