import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock3,
  Lightbulb,
  Moon,
  Sparkles,
  Waves
} from 'lucide-react';
import { Section } from '../types';

interface RightPanelProps {
  activeSection: Section;
  breathingState?: {
    isActive: boolean;
    phase: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
    timeLeft: number;
  };
}

const moodHighlights = [
  { day: 'Today', mood: 'Stressed', color: 'bg-amber-400' },
  { day: 'Yesterday', mood: 'Calm', color: 'bg-green-400' },
  { day: 'Wed', mood: 'Anxious', color: 'bg-purple-400' },
  { day: 'Tue', mood: 'Calm', color: 'bg-green-400' }
];

const breathingSteps = [
  'Inhale for 4 seconds',
  'Hold for 4 seconds',
  'Exhale for 4 seconds',
  'Pause for 4 seconds'
];

const breathingReminders = [
  'Drop your shoulders and unclench your jaw.',
  'Keep your breath smooth, not forced.',
  'If your mind wanders, return to the count.'
];

const breathingBenefits = [
  'Lowers physical tension',
  'Helps slow racing thoughts',
  'Supports a calmer reset'
];

const sleepHabits = [
  'Dim screens 1 hour before bed',
  'Keep the room cool and quiet',
  'Avoid caffeine after mid-afternoon'
];

const learnTopics = [
  'Anxiety feels like a warning system',
  'Stress grows when the load feels too heavy',
  'Small routines help low mood recover'
];

const dashboardTips = [
  'Say “I feel stressed” to start a gentle check-in.',
  'Use the quick commands to get instant support.',
  'If you feel unsafe, the crisis flow is always available.'
];

const dashboardQuickActions = [
  'Start a check-in',
  'Try breathing',
  'Open sleep help',
  'Read coping tips'
];

function PanelCard({
  title,
  icon: Icon,
  children,
  delay = 0
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="glass-panel rounded-3xl p-6"
    >
      <div className="flex items-center gap-2 mb-4 text-mc-text">
        <Icon className="w-5 h-5 text-sky-500" />
        <h3 className="font-heading font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export function RightPanel({ activeSection, breathingState }: RightPanelProps) {
  return (
    <aside className="w-80 h-full flex flex-col gap-6 flex-shrink-0 hidden xl:flex">
      {activeSection === 'dashboard' && (
        <>
          <PanelCard title="Daily Insights" icon={Sparkles} delay={0.15}>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-mc-surface-solid border border-mc-border">
                <p className="text-sm text-mc-text leading-relaxed">
                  You’ve been active in the chat area today. A quick check-in can help you notice what you need next.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  Try a short breathing reset if you want to settle your mind before continuing.
                </p>
                <button className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
                  Start breathing <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Quick Actions" icon={Activity} delay={0.25}>
            <div className="grid grid-cols-1 gap-3">
              {dashboardQuickActions.map((action) => (
                <button
                  key={action}
                  className="rounded-2xl px-4 py-3 text-left text-sm text-mc-text bg-mc-surface-solid border border-mc-border hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Helpful Notes" icon={Lightbulb} delay={0.35}>
            <div className="space-y-3">
              {dashboardTips.map((tip) => (
                <div key={tip} className="p-3 rounded-xl bg-mc-surface-solid border border-mc-border">
                  <p className="text-sm text-mc-text leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </PanelCard>
        </>
      )}

      {activeSection === 'mood' && (
        <>
          <PanelCard title="Mood Snapshot" icon={Activity} delay={0.15}>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-mc-surface-solid border border-mc-border">
                <p className="text-sm text-mc-text leading-relaxed">
                  Your recent log shows more <span className="font-semibold text-amber-500">stress</span> than usual.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  A short breathing reset can help before your next check-in.
                </p>
                <button className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
                  Try breathing <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Recent Moods" icon={Calendar} delay={0.25}>
            <div className="space-y-3">
              {moodHighlights.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-mc-surface-solid transition-colors"
                >
                  <span className="text-sm font-medium text-mc-text-muted">{item.day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-mc-text">{item.mood}</span>
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>
        </>
      )}

      {activeSection === 'breathing' && (
        <>
          <PanelCard title="Live Session" icon={Waves} delay={0.1}>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-teal-800 dark:text-teal-200">
                    {breathingState?.isActive ? 'Session running' : 'Ready to begin'}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/70 dark:bg-black/20 text-teal-700 dark:text-teal-200 border border-teal-200/60 dark:border-teal-700/60">
                    {breathingState?.phase ?? 'inhale'}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-teal-700/70 dark:text-teal-200/70 mb-1">
                      Countdown
                    </p>
                    <p className="text-4xl font-heading font-semibold text-teal-900 dark:text-teal-100">
                      {breathingState?.isActive ? breathingState.timeLeft : 4}
                    </p>
                  </div>
                  <div className="text-right text-sm text-teal-800 dark:text-teal-200">
                    <p className="font-medium">Box breathing</p>
                    <p className="text-xs text-teal-700/75 dark:text-teal-200/75">4 • 4 • 4 • 4 rhythm</p>
                  </div>
                </div>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Breathing Rhythm" icon={Waves} delay={0.15}>
            <div className="space-y-3">
              {breathingSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 p-3 rounded-xl bg-mc-surface-solid border border-mc-border"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-sm text-mc-text">{step}</span>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Before You Start" icon={Lightbulb} delay={0.2}>
            <div className="space-y-3">
              {breathingReminders.map((reminder) => (
                <div key={reminder} className="p-3 rounded-xl bg-mc-surface-solid border border-mc-border">
                  <p className="text-sm text-mc-text leading-relaxed">{reminder}</p>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Reset Tip" icon={Sparkles} delay={0.25}>
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
              <p className="text-sm text-teal-800 dark:text-teal-200 leading-relaxed">
                Relax your shoulders on the exhale and let the timer guide the pace.
              </p>
            </div>
          </PanelCard>

          <PanelCard title="What It Helps With" icon={Activity} delay={0.3}>
            <div className="space-y-3">
              {breathingBenefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-3 rounded-xl bg-mc-surface-solid border border-mc-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
                  <span className="text-sm text-mc-text leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </PanelCard>
        </>
      )}

      {activeSection === 'sleep' && (
        <>
          <PanelCard title="Tonight's Focus" icon={Moon} delay={0.15}>
            <div className="space-y-3">
              {sleepHabits.map((habit) => (
                <div key={habit} className="flex items-start gap-3 p-3 rounded-xl bg-mc-surface-solid border border-mc-border">
                  <Clock3 className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-mc-text leading-relaxed">{habit}</span>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Wind-Down Prompt" icon={Lightbulb} delay={0.25}>
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
              <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">
                Pick one calming routine and repeat it nightly to train your body for rest.
              </p>
            </div>
          </PanelCard>
        </>
      )}

      {activeSection === 'learn' && (
        <>
          <PanelCard title="What To Explore" icon={BookOpen} delay={0.15}>
            <div className="space-y-3">
              {learnTopics.map((topic) => (
                <div key={topic} className="p-3 rounded-xl bg-mc-surface-solid border border-mc-border">
                  <p className="text-sm text-mc-text leading-relaxed">{topic}</p>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Next Step" icon={Sparkles} delay={0.25}>
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800">
              <p className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed">
                Understanding your feelings is easier when you pair insight with one small action.
              </p>
            </div>
          </PanelCard>
        </>
      )}
    </aside>
  );
}