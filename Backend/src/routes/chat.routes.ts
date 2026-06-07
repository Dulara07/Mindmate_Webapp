import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller';

const router = Router();

/**
 * POST /api/chat
 * Body: { message: string, sessionId?: string }
 * Returns: { reply, currentMood, category, isCrisis, sessionId, requiresFollowup, followupPrompt }
 */
router.post('/', handleChat);

export default router;
