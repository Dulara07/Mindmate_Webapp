import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';
type Phase = 'inhale' | 'hold' | 'exhale' | 'hold-empty';
type BreathingState = {
  isActive: boolean;
  phase: Phase;
  timeLeft: number;
};

interface BreathingModeProps {
  onStateChange?: (state: BreathingState) => void;
}

export function BreathingMode({ onStateChange }: BreathingModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    onStateChange?.({
      isActive,
      phase,
      timeLeft
    });
  }, [isActive, phase, timeLeft, onStateChange]);

  // 4-4-4-4 Box Breathing logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Switch phase
            setPhase((currentPhase) => {
              switch (currentPhase) {
                case 'inhale':
                  return 'hold';
                case 'hold':
                  return 'exhale';
                case 'exhale':
                  return 'hold-empty';
                case 'hold-empty':
                  return 'inhale';
              }
            });
            return 4; // Reset timer for next phase
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold-empty':
        return 'Hold';
    }
  };
  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1;
      case 'hold-empty':
        return 1;
    }
  };
  return (
    <div className="relative w-full h-full min-h-0 z-40 overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem] bg-slate-950 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 text-white">
      {/* Ambient Background */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-teal-900 via-slate-900 to-blue-900"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }} />
        
        {/* Particles could go here */}
      </div>

      {/* Top Controls */}
      <div className="relative z-20 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-teal-200/70 mb-2">
            Guided Relaxation
          </p>
          <h2 className="font-heading text-2xl sm:text-4xl font-semibold text-white mb-2">
            Box breathing for a calmer reset
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
            Follow the rhythm, keep your posture comfortable, and let the timing do the work.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="mt-1 sm:mt-2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors flex-shrink-0"
          aria-label={soundEnabled ? 'Mute breathing guide' : 'Enable breathing guide'}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Breathing Circle */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-4 sm:py-6 lg:py-8">
        <div className="w-full max-w-4xl flex flex-col items-center gap-6 lg:gap-8">
          <div className="relative w-[clamp(13rem,42vw,20rem)] h-[clamp(13rem,42vw,20rem)] flex items-center justify-center">
            {/* Outer glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-teal-500/20 blur-2xl"
              animate={{
                scale: isActive ? getScale() : 1
              }}
              transition={{
                duration: 4,
                ease: 'easeInOut'
              }} />
            

            {/* Main circle */}
            <motion.div
              className="relative w-[clamp(9rem,24vw,14rem)] h-[clamp(9rem,24vw,14rem)] rounded-full border border-teal-300/50 bg-teal-500/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_60px_rgba(45,212,191,0.18)]"
              animate={{
                scale: isActive ? getScale() : 1
              }}
              transition={{
                duration: 4,
                ease: 'easeInOut'
              }}>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase + isActive.toString()}
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    y: -10
                  }}
                  className="text-center px-4">
                  
                  <div className="text-teal-100 font-heading text-xl sm:text-2xl font-medium tracking-wide mb-1">
                    {isActive ? getPhaseText() : 'Ready'}
                  </div>
                  {isActive &&
                  <div className="text-teal-300/80 font-mono text-lg sm:text-xl">
                      {timeLeft}
                    </div>
                  }
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Play/Pause Control */}
          <button
            onClick={() => {
              setIsActive(!isActive);
              if (!isActive) {
                setPhase('inhale');
                setTimeLeft(4);
              }
            }}
            className={cn(
              'w-full sm:w-auto min-w-[200px] px-6 py-3.5 rounded-full flex items-center justify-center gap-3 font-medium transition-all shadow-lg',
              isActive ?
              'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10' :
              'bg-teal-500 text-white hover:bg-teal-600 shadow-[0_12px_30px_rgba(20,184,166,0.32)]'
            )}>
            
            {isActive ?
            <>
                <Pause className="w-5 h-5" /> Pause Exercise
              </> :

            <>
                <Play className="w-5 h-5" /> Start Breathing
              </>
            }
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="relative z-20 text-center text-slate-300 max-w-2xl mx-auto px-4 sm:px-6 pb-1 sm:pb-0">
        <p>
          Find a comfortable position. Follow the circle as it expands and
          contracts. Breathe through your nose and out through your mouth.
        </p>
      </div>
    </div>);

}