import { Router, Request, Response } from 'express';
import { getMoodHistory } from '../services/session.service';

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

export default router;
