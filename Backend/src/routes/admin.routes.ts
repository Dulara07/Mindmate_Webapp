import { Router, Request, Response } from 'express';
import { dbAll } from '../db/database';

const router = Router();

/**
 * GET /api/admin/keywords?category=<name>
 * Returns the list of keywords and weights for a category (debug only)
 */
router.get('/keywords', (req: Request, res: Response) => {
  const { category } = req.query as { category?: string };

  if (!category) {
    res.status(400).json({ error: 'category query parameter is required' });
    return;
  }

  const rows = dbAll<{ keyword: string; weight: number; category_name: string }>(`
    SELECT k.keyword, k.weight, c.name as category_name
    FROM keywords k
    JOIN categories c ON k.category_id = c.id
    WHERE c.name = ?
  `, [category]);

  res.json({ category, count: rows.length, keywords: rows.slice(0, 200) });
});

export default router;
