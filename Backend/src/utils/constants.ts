// ─────────────────────────────────────────────────────────────────────────────
// CRISIS KEYWORDS — Always hardcoded. Never store these in the database.
// These are checked FIRST before any other classification.
// ─────────────────────────────────────────────────────────────────────────────

export const CRISIS_KEYWORDS: string[] = [
  'suicide',
  'kill myself',
  'kill me',
  'end my life',
  'want to die',
  'wanna die',
  'wish i was dead',
  'wish i were dead',
  'better off dead',
  'better off without me',
  'hurt myself',
  'harm myself',
  'self harm',
  'self-harm',
  'cut myself',
  'no reason to live',
  'nothing to live for',
  'give up on life',
  'done with life',
  'cant go on',
  "can't go on",
  'dont want to be here',
  "don't want to be here",
  'not worth living',
  'life is not worth',
  'end it all',
  'end everything',
  'take my own life',
];

export const CRISIS_RESPONSE = `I'm really concerned about you right now, and I want you to know that you matter deeply. 

Please reach out for help immediately:

🆘 Emergency Services: 119 (Sri Lanka)
📞 Sumithrayo Helpline: 011-2696666 (24/7)
📞 National Mental Health Helpline: 1926

You don't have to go through this alone. Please call one of these numbers right now — they are confidential, free, and available to support you. 

If you are in immediate danger, please go to your nearest hospital emergency room or call 119.`;

// Mood words used to detect current mood from message
export const MOOD_KEYWORDS: Record<string, string> = {
  happy: 'happy',
  happiness: 'happy',
  joyful: 'happy',
  excited: 'excited',
  elated: 'happy',
  cheerful: 'happy',
  great: 'happy',
  wonderful: 'happy',
  fantastic: 'happy',
  calm: 'calm',
  peaceful: 'calm',
  content: 'calm',
  relaxed: 'calm',
  serene: 'calm',
  sad: 'sad',
  sadness: 'sad',
  unhappy: 'sad',
  miserable: 'sad',
  gloomy: 'sad',
  crying: 'sad',
  depressed: 'sad',
  down: 'sad',
  stressed: 'stressed',
  stress: 'stressed',
  overwhelmed: 'stressed',
  pressure: 'stressed',
  'stressed out': 'stressed',
  anxious: 'anxious',
  anxiety: 'anxious',
  nervous: 'anxious',
  worried: 'anxious',
  fearful: 'anxious',
  scared: 'anxious',
  panicking: 'anxious',
  angry: 'angry',
  anger: 'angry',
  frustrated: 'angry',
  irritated: 'angry',
  furious: 'angry',
  annoyed: 'angry',
  mad: 'angry',
  tired: 'tired',
  exhausted: 'tired',
  fatigued: 'tired',
  drained: 'tired',
  'burned out': 'tired',
  burnout: 'tired',
  sleepy: 'tired',
  lonely: 'lonely',
  alone: 'lonely',
  isolated: 'lonely',
  hopeless: 'hopeless',
  helpless: 'hopeless',
  empty: 'hopeless',
  numb: 'hopeless',
  okay: 'neutral',
  fine: 'neutral',
  alright: 'neutral',
  neutral: 'neutral',
  normal: 'neutral',
};
