export type Section =
'dashboard' |
'mood' |
'breathing' |
'sleep' |
'learn' |
'emergency';

export type Mood =
'Happy' |
'Calm' |
'Excited' |
'Sad' |
'Stressed' |
'Angry' |
'Anxious' |
'Tired';

export type EmotionTone = 'calm' | 'stressed' | 'sad' | 'anxious' | 'neutral';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}