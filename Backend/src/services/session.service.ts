import { dbRun, dbAll, dbGet, dbInsert } from '../db/database';
import { v4 as uuidv4 } from 'uuid';

export interface Session {
  session_id: string;
  current_flow: string | null;
  flow_step: number;
  context_data: Record<string, unknown>;
  current_mood: string | null;
  last_activity: string;
}

interface SessionRow {
  session_id: string;
  current_flow: string | null;
  flow_step: number;
  context_data: string | null;
  current_mood: string | null;
  last_activity: string;
}

// Breathing flow step order
export const BREATHING_FLOW_STEPS = ['intro', 'step_1', 'step_2', 'step_3', 'step_4', 'complete'];

function parseSession(row: SessionRow): Session {
  return {
    ...row,
    context_data: row.context_data ? JSON.parse(row.context_data) : {},
  };
}

export function createSession(): Session {
  const sessionId = uuidv4();
  const now = new Date().toISOString();

  dbRun(
    `INSERT INTO sessions (session_id, current_flow, flow_step, context_data, current_mood, last_activity)
     VALUES (?, NULL, 0, '{}', NULL, ?)`,
    [sessionId, now]
  );

  return {
    session_id: sessionId,
    current_flow: null,
    flow_step: 0,
    context_data: {},
    current_mood: null,
    last_activity: now,
  };
}

export function getSession(sessionId: string): Session | null {
  const row = dbGet<SessionRow>(`SELECT * FROM sessions WHERE session_id = ?`, [sessionId]);
  return row ? parseSession(row) : null;
}

export function updateSession(
  sessionId: string,
  updates: Partial<Omit<Session, 'session_id'>>
): void {
  const current = getSession(sessionId);
  if (!current) return;

  const now = new Date().toISOString();

  dbRun(
    `UPDATE sessions
     SET current_flow = ?, flow_step = ?, context_data = ?, current_mood = ?, last_activity = ?
     WHERE session_id = ?`,
    [
      updates.current_flow !== undefined ? updates.current_flow : current.current_flow,
      updates.flow_step    !== undefined ? updates.flow_step    : current.flow_step,
      JSON.stringify(updates.context_data ?? current.context_data),
      updates.current_mood !== undefined ? updates.current_mood : current.current_mood,
      now,
      sessionId,
    ]
  );
}

export function clearFlow(sessionId: string): void {
  updateSession(sessionId, { current_flow: null, flow_step: 0, context_data: {} });
}

export function logMood(sessionId: string, mood: string, note?: string): void {
  dbInsert(
    `INSERT INTO mood_logs (session_id, mood, note, created_at) VALUES (?, ?, ?, ?)`,
    [sessionId, mood, note ?? null, new Date().toISOString()]
  );
}

export function getMoodHistory(sessionId: string): { mood: string; note: string | null; created_at: string }[] {
  return dbAll<{ mood: string; note: string | null; created_at: string }>(
    `SELECT mood, note, created_at FROM mood_logs
     WHERE session_id = ?
     ORDER BY created_at DESC LIMIT 30`,
    [sessionId]
  );
}
