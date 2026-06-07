import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Coffee, Smartphone, Clock, CheckCircle2, Circle,
  Play, Square, Wind, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '../lib/utils';

const sleepTips = [
  {
    icon: Smartphone,
    title: 'Reduce Screen Time',
    desc: 'Stop using devices 1 hour before bed to reduce blue light exposure.'
  },
  {
    icon: Coffee,
    title: 'Avoid Late Caffeine',
    desc: 'Try to consume your last caffeinated drink before 2 PM.'
  },
  {
    icon: Clock,
    title: 'Consistent Schedule',
    desc: 'Go to bed and wake up at the same time every day, even on weekends.'
  }
];

interface ScriptSegment {
  text: string;
  pauseMs: number;
}

const MILITARY_SLEEP_SCRIPT: ScriptSegment[] = [
  { text: "Welcome. I'm so glad you're here.", pauseMs: 3500 },
  { text: "Let's help you find rest tonight.", pauseMs: 4000 },
  { text: "Begin by finding a comfortable position. Close your eyes gently.", pauseMs: 5000 },
  { text: "Now, let your face go completely soft.", pauseMs: 3500 },
  { text: "Release the tension in your forehead.", pauseMs: 4000 },
  { text: "Let your jaw hang loose.", pauseMs: 3500 },
  { text: "Feel your lips soften. Your tongue. Your eyes. All sinking into stillness.", pauseMs: 6000 },
  { text: "Take your attention down to your shoulders.", pauseMs: 3000 },
  { text: "Let them drop. Let them melt away from your ears.", pauseMs: 4500 },
  { text: "Release any tightness down through your arms. Your elbows. Your wrists. Your fingers.", pauseMs: 6000 },
  { text: "Just let them be heavy.", pauseMs: 6000 },
  { text: "Now feel your chest.", pauseMs: 3000 },
  { text: "On your next exhale, let it all go.", pauseMs: 5000 },
  { text: "With every breath out, sink a little deeper.", pauseMs: 6000 },
  { text: "Feel your hips pressing into the bed.", pauseMs: 4000 },
  { text: "Let your thighs feel heavy. So heavy. Like they're melting into where you lay.", pauseMs: 7000 },
  { text: "Down through your calves. Your ankles. The soles of your feet.", pauseMs: 6000 },
  { text: "Let everything go.", pauseMs: 7000 },
  { text: "Now. Picture a warm, dark room.", pauseMs: 5000 },
  { text: "You are completely safe here.", pauseMs: 6000 },
  { text: "There is nothing to do. Nowhere to be.", pauseMs: 7000 },
  { text: "Or simply repeat these words in your mind.", pauseMs: 3000 },
  { text: "Don't think. Don't think. Don't think.", pauseMs: 8000 },
  { text: "You are drifting now.", pauseMs: 8000 },
  { text: "Softly. Slowly. Into sleep.", pauseMs: 0 },
];

const BREATHING_478_SCRIPT: ScriptSegment[] = [
  { text: "Welcome. This is your time to rest.", pauseMs: 4000 },
  { text: "Let's breathe together.", pauseMs: 4000 },
  { text: "Begin by letting out a slow, gentle sigh through your mouth.", pauseMs: 6000 },
  { text: "Now close your lips.", pauseMs: 2500 },
  { text: "Breathe in through your nose. One. Two. Three. Four.", pauseMs: 3000 },
  { text: "Hold your breath gently. One. Two. Three. Four. Five. Six. Seven.", pauseMs: 2500 },
  { text: "Now breathe out slowly through your mouth. One. Two. Three. Four. Five. Six. Seven. Eight.", pauseMs: 4000 },
  { text: "Beautiful.", pauseMs: 3500 },
  { text: "Breathe in again. One. Two. Three. Four.", pauseMs: 3000 },
  { text: "Hold. One. Two. Three. Four. Five. Six. Seven.", pauseMs: 2500 },
  { text: "And breathe out. One. Two. Three. Four. Five. Six. Seven. Eight.", pauseMs: 5000 },
  { text: "Once more. Breathe in. One. Two. Three. Four.", pauseMs: 3000 },
  { text: "Hold. One. Two. Three. Four. Five. Six. Seven.", pauseMs: 2500 },
  { text: "And release. Slowly. Completely. One. Two. Three. Four. Five. Six. Seven. Eight.", pauseMs: 6000 },
  { text: "Let your breathing return to its own gentle rhythm now.", pauseMs: 6000 },
  { text: "You are safe.", pauseMs: 4000 },
  { text: "You are still.", pauseMs: 6000 },
  { text: "Let sleep come to you softly.", pauseMs: 0 },
];

const SCRIPT_PREVIEWS = {
  military: [
    "Welcome. I'm so glad you're here...",
    "Let your face go completely soft. Release the tension in your forehead...",
    "Let your jaw hang loose. Your tongue. Your eyes. All sinking into stillness...",
    "Release any tightness down through your arms. Your elbows. Your wrists. Your fingers...",
    "Feel your hips pressing into the bed. So heavy. Melting into where you lay...",
    "Picture a warm, dark room. You are completely safe here...",
    "Don't think. Don't think. Don't think...",
    "Softly. Slowly. Into sleep...",
  ],
  breathing: [
    "Welcome. This is your time to rest. Let's breathe together...",
    "Breathe in through your nose. One. Two. Three. Four.",
    "Hold your breath gently. One through Seven.",
    "Breathe out slowly. One through Eight.",
    "Let's go again... breathe in... hold... release...",
    "Let your breathing return to its own gentle rhythm now...",
    "You are safe. You are still. Let sleep come to you softly...",
  ],
};

interface Tutorial {
  id: 'military' | 'breathing';
  title: string;
  subtitle: string;
  duration: string;
  Icon: typeof Moon;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  script: ScriptSegment[];
}

const TUTORIALS: Tutorial[] = [
  {
    id: 'military',
    title: 'Military Sleep Method',
    subtitle: 'Full-body scan & mental clearing',
    duration: '~2 min',
    Icon: Moon,
    gradientFrom: '#1e1b4b',
    gradientTo: '#312e81',
    accentColor: '#818cf8',
    script: MILITARY_SLEEP_SCRIPT,
  },
  {
    id: 'breathing',
    title: '4-7-8 Breathing',
    subtitle: 'Calming breath control technique',
    duration: '~1–2 min',
    Icon: Wind,
    gradientFrom: '#0f172a',
    gradientTo: '#1e3a5f',
    accentColor: '#38bdf8',
    script: BREATHING_478_SCRIPT,
  },
];

interface TutorialCardProps {
  tutorial: Tutorial;
  isPlaying: boolean;
  progress: number;
  onPlay: () => void;
  onStop: () => void;
}

function TutorialCard({ tutorial, isPlaying, progress, onPlay, onStop }: TutorialCardProps) {
  const [showScript, setShowScript] = useState(false);
  const { Icon } = tutorial;
  const previews = SCRIPT_PREVIEWS[tutorial.id];

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden relative flex flex-col"
      style={{ background: `linear-gradient(135deg, ${tutorial.gradientFrom}, ${tutorial.gradientTo})` }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Subtle star pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative p-5 sm:p-6 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${tutorial.accentColor}22`, border: `1px solid ${tutorial.accentColor}44` }}
            >
              <Icon className="w-5 h-5" style={{ color: tutorial.accentColor }} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base leading-tight">{tutorial.title}</h4>
              <p className="text-xs mt-0.5" style={{ color: `${tutorial.accentColor}cc` }}>{tutorial.subtitle}</p>
            </div>
          </div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: `${tutorial.accentColor}22`, color: tutorial.accentColor }}
          >
            {tutorial.duration}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: tutorial.accentColor }}
            animate={{ width: `${isPlaying ? progress * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          <button
            onClick={isPlaying ? onStop : onPlay}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: isPlaying ? 'rgba(255,255,255,0.15)' : tutorial.accentColor,
              color: isPlaying ? 'white' : '#0f172a',
            }}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Play
              </>
            )}
          </button>

          {isPlaying && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs text-white/60"
            >
              Playing… dim your screen and relax
            </motion.p>
          )}

          <button
            onClick={() => setShowScript(s => !s)}
            className="ml-auto flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            {showScript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Script
          </button>
        </div>

        {/* Script preview */}
        <AnimatePresence>
          {showScript && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-xl p-4 space-y-2 border"
                style={{ backgroundColor: 'rgba(0,0,0,0.25)', borderColor: `${tutorial.accentColor}22` }}
              >
                {previews.map((line, i) => (
                  <p key={i} className="text-sm text-white/70 leading-relaxed italic">
                    "{line}"
                  </p>
                ))}
                <p className="text-xs text-white/30 mt-3">
                  Voice narrated at a slow, soothing pace with guided pauses
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function SleepPanel() {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Dim the lights', completed: false },
    { id: 2, text: 'Read a book for 20 mins', completed: false },
    { id: 3, text: 'Do a 5-min breathing exercise', completed: false },
    { id: 4, text: 'Set alarm for tomorrow', completed: false },
  ]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const stopRef = useRef<(() => void) | null>(null);

  const playTutorial = useCallback((tutorial: Tutorial) => {
    if (stopRef.current) stopRef.current();

    setPlayingId(tutorial.id);
    setProgress(p => ({ ...p, [tutorial.id]: 0 }));

    let currentIndex = 0;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const getVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      return (
        voices.find(v => v.name.toLowerCase().includes('samantha')) ||
        voices.find(v => v.name.toLowerCase().includes('victoria')) ||
        voices.find(v => v.name.toLowerCase().includes('zira')) ||
        voices.find(v => v.name.toLowerCase().includes('google uk english female')) ||
        voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) ||
        voices.find(v => v.lang.startsWith('en-')) ||
        null
      );
    };

    const speakNext = () => {
      if (cancelled || currentIndex >= tutorial.script.length) {
        if (!cancelled) {
          setPlayingId(null);
          setProgress(p => ({ ...p, [tutorial.id]: 0 }));
        }
        return;
      }

      const seg = tutorial.script[currentIndex];
      setProgress(p => ({ ...p, [tutorial.id]: currentIndex / tutorial.script.length }));

      const utterance = new SpeechSynthesisUtterance(seg.text);
      utterance.rate = 0.72;
      utterance.pitch = 0.88;
      utterance.volume = 1;
      const voice = getVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (cancelled) return;
        currentIndex++;
        if (seg.pauseMs > 0) {
          timeoutId = setTimeout(speakNext, seg.pauseMs);
        } else {
          speakNext();
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    const start = () => {
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          speakNext();
        };
      } else {
        speakNext();
      }
    };

    start();

    stopRef.current = () => {
      cancelled = true;
      window.speechSynthesis.cancel();
      if (timeoutId) clearTimeout(timeoutId);
      setPlayingId(null);
      setProgress(p => ({ ...p, [tutorial.id]: 0 }));
    };
  }, []);

  const stopTutorial = useCallback(() => {
    if (stopRef.current) stopRef.current();
  }, []);

  useEffect(() => {
    return () => { if (stopRef.current) stopRef.current(); };
  }, []);

  const toggleTask = (id: number) => {
    setChecklist(checklist.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-5 sm:gap-6 overflow-y-auto pr-1 sm:pr-2 pb-6">
      <header className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <Moon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500" />
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-mc-text">
            Sleep & Wellness
          </h2>
        </div>
        <p className="text-mc-text-muted">
          Build healthy habits for a better night's rest.
        </p>
      </header>

      {/* Guided Voice Tutorials */}
      <section>
        <h3 className="font-heading font-semibold text-lg sm:text-xl text-mc-text mb-3 px-1">
          Guided Sleep Tutorials
        </h3>
        <p className="text-sm text-mc-text-muted mb-4 px-1">
          Lie back, press play, and let a calm voice guide you into sleep.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {TUTORIALS.map(tutorial => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              isPlaying={playingId === tutorial.id}
              progress={progress[tutorial.id] ?? 0}
              onPlay={() => playTutorial(tutorial)}
              onStop={stopTutorial}
            />
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Tonight's Plan Checklist */}
        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 flex flex-col">
          <h3 className="font-heading font-semibold text-lg sm:text-xl text-mc-text mb-5 sm:mb-6">
            Tonight's Routine
          </h3>
          <div className="space-y-3 flex-1">
            {checklist.map(task => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={cn(
                  'w-full flex items-center gap-3 sm:gap-4 p-4 rounded-2xl border transition-all text-left',
                  task.completed
                    ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/50 text-mc-text-muted'
                    : 'bg-mc-surface-solid border-mc-border text-mc-text hover:border-indigo-300 shadow-sm'
                )}
              >
                {task.completed
                  ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 flex-shrink-0" />
                  : <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-mc-text-muted flex-shrink-0" />
                }
                <span className={cn('text-[15px]', task.completed && 'line-through')}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-mc-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-mc-text-muted">Progress</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {checklist.filter(t => t.completed).length} / {checklist.length} completed
              </span>
            </div>
            <div className="w-full h-2 bg-mc-surface-solid rounded-full mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${checklist.filter(t => t.completed).length / checklist.length * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Sleep Hygiene Tips */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <h3 className="font-heading font-semibold text-lg sm:text-xl text-mc-text mb-1 sm:mb-2 px-1 sm:px-2">
            Sleep Hygiene
          </h3>
          {sleepTips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4"
              >
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-mc-text mb-1">{tip.title}</h4>
                  <p className="text-sm text-mc-text-muted leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            );
          })}

          <div className="mt-auto glass-panel rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
            <h4 className="font-heading font-semibold text-base sm:text-lg mb-2">
              Need help winding down?
            </h4>
            <p className="text-indigo-100 text-sm mb-4">
              Try our guided sleep meditation to help you drift off naturally.
            </p>
            <button className="px-5 py-2 bg-white text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-50 transition-colors">
              Start Meditation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
