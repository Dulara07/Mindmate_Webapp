import { Router, Request, Response } from 'express';
import { createSession, getSession } from '../services/session.service';

const router = Router();

/**
 * POST /api/session/new
 * Creates a new session and returns the sessionId
 */
router.post('/new', (_req: Request, res: Response) => {
  const session = createSession();
  res.json({
    sessionId: session.session_id,
    message: 'Session created successfully',
  });
});

/**
 * GET /api/session/:sessionId
 * Returns current session state (useful for frontend to restore state)
 */
router.get('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = getSession(sessionId);

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  res.json({
    sessionId: session.session_id,
    currentMood: session.current_mood,
    currentFlow: session.current_flow,
    lastActivity: session.last_activity,
  });
});

export default router;
