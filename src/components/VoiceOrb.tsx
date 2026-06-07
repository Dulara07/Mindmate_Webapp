import { motion } from 'framer-motion';
import { EmotionTone } from '../types';

interface VoiceOrbProps {
  state: 'idle' | 'listening' | 'speaking';
  emotion: EmotionTone;
}

const EMOJI_CDN = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64';

const EMOTION_EMOJI: Partial<Record<EmotionTone, string>> = {
  calm:     `${EMOJI_CDN}/1f60c.png`,
  stressed: `${EMOJI_CDN}/1f630.png`,
  sad:      `${EMOJI_CDN}/1f622.png`,
  anxious:  `${EMOJI_CDN}/1f61f.png`,
  happy:    `${EMOJI_CDN}/1f60a.png`,
  confused: `${EMOJI_CDN}/1f615.png`,
};

export function VoiceOrb({ state, emotion }: VoiceOrbProps) {
  const getEmotionColor = () => {
    switch (emotion) {
      case 'calm':     return 'var(--mc-calm)';
      case 'stressed': return 'var(--mc-stress)';
      case 'sad':      return 'var(--mc-sad)';
      case 'anxious':  return 'var(--mc-anxious)';
      case 'happy':    return '#FBBF24';
      case 'confused': return '#A78BFA';
      default:         return '#94A3B8';
    }
  };

  const emotionColor = getEmotionColor();
  const emojiUrl = EMOTION_EMOJI[emotion] ?? null;

  return (
    <div className="relative w-[clamp(9rem,14vw,14rem)] h-[clamp(9rem,14vw,14rem)] flex items-center justify-center">
      {/* Ambient Emotion Aura */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-20 blur-3xl"
        animate={{
          backgroundColor: emotionColor,
          scale: state === 'listening' ? [1, 1.2, 1] : [1, 1.05, 1]
        }}
        transition={{
          duration: state === 'listening' ? 2 : 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Outer Rings (Listening State) */}
      {state === 'listening' && (
        <>
          <motion.div
            className="absolute inset-4 rounded-full border border-blue-400/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-blue-400/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
          />
        </>
      )}

      {/* Core Orb */}
      <motion.div
        className="relative w-[clamp(5rem,6.5vw,7rem)] h-[clamp(5rem,6.5vw,7rem)] rounded-full overflow-hidden shadow-2xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent), linear-gradient(135deg, #60A5FA, #A78BFA)`
        }}
        animate={{
          scale:
            state === 'speaking' ? [1, 1.05, 0.95, 1.02, 1] :
            state === 'listening' ? 1.1 :
            [1, 1.02, 1],
          boxShadow:
            state === 'listening' ? `0 0 40px ${emotionColor}80` :
            `0 0 20px ${emotionColor}40`
        }}
        transition={{
          scale:
            state === 'speaking'
              ? { duration: 0.5, repeat: Infinity, repeatType: 'mirror' }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        {/* 3D emoji appears on the orb when emotion is detected */}
        {emojiUrl ? (
          <motion.div
            key={emotion}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          >
            <img
              src={emojiUrl}
              alt={emotion}
              className="w-[82%] h-[82%] object-contain"
              style={{ filter: 'drop-shadow(0px 3px 10px rgba(0,0,0,0.4))' }}
            />
          </motion.div>
        ) : state === 'speaking' ? (
          <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-white rounded-full"
                animate={{ height: ['20%', '80%', '20%'] }}
                transition={{
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
