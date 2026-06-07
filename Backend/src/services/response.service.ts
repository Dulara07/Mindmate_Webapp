import { dbAll } from '../db/database';

interface ResponseRow {
  id: number;
  response_text: string;
  requires_followup: number;
  followup_prompt: string | null;
  sub_topic: string | null;
}

export interface ResponseResult {
  text: string;
  requiresFollowup: boolean;
  followupPrompt: string | null;
}

export const FALLBACK_RESPONSES = [
  "I'm not quite sure I understood that. I can help you with mood tracking, breathing exercises, sleep tips, mental health information, or finding professional support. What would you like to explore?",
  "Hmm, I didn't quite catch that. Could you try rephrasing? I'm here to help with your emotional wellbeing, breathing exercises, sleep hygiene, or mental health information.",
  "I want to make sure I give you the right support. Could you tell me a bit more about what you're looking for? I can help with mood tracking, relaxation techniques, sleep tips, or mental health education.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getResponse(category: string, subTopic: string | null): ResponseResult {
  if (category === 'fallback') {
    return { text: pickRandom(FALLBACK_RESPONSES), requiresFollowup: false, followupPrompt: null };
  }

  // Try sub-topic match first
  let responses: ResponseRow[] = [];

  if (subTopic) {
    responses = dbAll<ResponseRow>(`
      SELECT r.id, r.response_text, r.requires_followup, r.followup_prompt, r.sub_topic
      FROM responses r
      JOIN categories c ON r.category_id = c.id
      WHERE c.name = ? AND r.sub_topic = ?
    `, [category, subTopic]);
  }

  // Fall back to general/null sub_topic
  if (responses.length === 0) {
    responses = dbAll<ResponseRow>(`
      SELECT r.id, r.response_text, r.requires_followup, r.followup_prompt, r.sub_topic
      FROM responses r
      JOIN categories c ON r.category_id = c.id
      WHERE c.name = ? AND (r.sub_topic IS NULL OR r.sub_topic = 'general')
    `, [category]);
  }

  // Last resort — any response from category
  if (responses.length === 0) {
    responses = dbAll<ResponseRow>(`
      SELECT r.id, r.response_text, r.requires_followup, r.followup_prompt, r.sub_topic
      FROM responses r
      JOIN categories c ON r.category_id = c.id
      WHERE c.name = ?
    `, [category]);
  }

  if (responses.length === 0) {
    return { text: FALLBACK_RESPONSES[0], requiresFollowup: false, followupPrompt: null };
  }

  const picked = pickRandom(responses);
  return {
    text: picked.response_text,
    requiresFollowup: picked.requires_followup === 1,
    followupPrompt: picked.followup_prompt,
  };
}

export function getBreathingStepResponse(step: string): ResponseResult {
  const responses = dbAll<ResponseRow>(`
    SELECT r.id, r.response_text, r.requires_followup, r.followup_prompt, r.sub_topic
    FROM responses r
    JOIN categories c ON r.category_id = c.id
    WHERE c.name = 'breathing' AND r.sub_topic = ?
  `, [step]);

  if (responses.length === 0) {
    return { text: "Let's continue with the breathing exercise.", requiresFollowup: false, followupPrompt: null };
  }

  const picked = pickRandom(responses);
  return {
    text: picked.response_text,
    requiresFollowup: picked.requires_followup === 1,
    followupPrompt: picked.followup_prompt,
  };
}
