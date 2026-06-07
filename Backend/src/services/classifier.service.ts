import { dbAll } from '../db/database';
import { CRISIS_KEYWORDS, MOOD_KEYWORDS } from '../utils/constants';

export interface ClassificationResult {
  category: string;
  subTopic: string | null;
  score: number;
  isCrisis: boolean;
  detectedMood: string | null;
}

interface KeywordRow {
  keyword: string;
  weight: number;
  category_name: string;
}

const PSYCHO_SUBTOPICS: Record<string, string[]> = {
  anxiety:      ['anxiety', 'anxious', 'anxiety disorder', 'social anxiety', 'generalized anxiety'],
  depression:   ['depression', 'depressed', 'clinical depression', 'major depression'],
  stress:       ['stress', 'stressed', 'chronic stress', 'work stress', 'academic stress'],
  panic_attack: ['panic attack', 'panic attacks', 'panic disorder', 'panicking', 'panic'],
};

const SLEEP_SUBTOPICS: Record<string, string[]> = {
  screen_time: ['screen', 'phone before bed', 'blue light', 'screen time'],
  caffeine:    ['caffeine', 'coffee', 'energy drink'],
  schedule:    ['sleep schedule', 'consistent', 'same time', 'bedtime schedule'],
  relaxation:  ['wind down', 'relax before bed', 'bedtime routine', 'night routine', 'warm bath'],
  environment: ['bedroom', 'room temperature', 'dark room', 'noise', 'environment'],
};

const GREETING_SUBTOPICS: Record<string, string[]> = {
  greeting: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'good night'],
  identity: ['who are you', 'what are you', 'your name', 'what can you do', 'what is mindcare', 'are you a bot'],
  thanks:   ['thank you', 'thanks', 'appreciate', 'that helped', 'helpful'],
  goodbye:  ['bye', 'goodbye', 'see you', 'take care', 'farewell', 'talk later'],
};

export function classifyMessage(message: string): ClassificationResult {
  const normalized = message.toLowerCase().trim();

  // 1. Crisis check first - always
  for (const kw of CRISIS_KEYWORDS) {
    if (normalized.includes(kw)) {
      return { category: 'crisis', subTopic: null, score: 999, isCrisis: true, detectedMood: 'hopeless' };
    }
  }

  // 2. Detect mood
  let detectedMood: string | null = null;
  for (const [kw, mood] of Object.entries(MOOD_KEYWORDS)) {
    if (normalized.includes(kw)) {
      detectedMood = mood;
      break;
    }
  }

  // 3. Score categories
  const allKeywords = dbAll<KeywordRow>(`
    SELECT k.keyword, k.weight, c.name as category_name
    FROM keywords k
    JOIN categories c ON k.category_id = c.id
  `);

  const scores: Record<string, number> = {};
  for (const row of allKeywords) {
    if (normalized.includes(row.keyword)) {
      scores[row.category_name] = (scores[row.category_name] || 0) + row.weight;
    }
  }

  // 4. Pick winner
  let bestCategory = 'fallback';
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  // 5. Sub-topic detection
  let subTopic: string | null = null;

  if (bestCategory === 'psychoeducation') {
    for (const [topic, keywords] of Object.entries(PSYCHO_SUBTOPICS)) {
      if (keywords.some(kw => normalized.includes(kw))) { subTopic = topic; break; }
    }
  }
  if (bestCategory === 'sleep') {
    for (const [topic, keywords] of Object.entries(SLEEP_SUBTOPICS)) {
      if (keywords.some(kw => normalized.includes(kw))) { subTopic = topic; break; }
    }
  }
  if (bestCategory === 'mood_tracking' && detectedMood) {
    subTopic = detectedMood;
  }
  if (bestCategory === 'greeting_smalltalk') {
    for (const [topic, keywords] of Object.entries(GREETING_SUBTOPICS)) {
      if (keywords.some(kw => normalized.includes(kw))) { subTopic = topic; break; }
    }
    if (!subTopic) subTopic = 'greeting';
  }

  return { category: bestCategory, subTopic, score: bestScore, isCrisis: false, detectedMood };
}
