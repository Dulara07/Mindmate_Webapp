import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { Mood } from '../types';
import { cn } from '../lib/utils';
import { getMoodHistory, logMoodEntry, MoodHistoryEntry } from '../lib/api';

interface MoodEntry {
  mood: string;
  score: number;
  createdAt: string;
}

interface MoodTrackerProps {
  sessionId: string | null;
}

const moodOptions: {
  label: Mood;
  emoji: string;
  color: string;
}[] = [
{
  label: 'Happy',
  emoji: '😊',
  color:
  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
},
{
  label: 'Calm',
  emoji: '😌',
  color:
  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
},
{
  label: 'Excited',
  emoji: '🤩',
  color:
  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
},
{
  label: 'Tired',
  emoji: '🥱',
  color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
},
{
  label: 'Sad',
  emoji: '😔',
  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
},
{
  label: 'Anxious',
  emoji: '😰',
  color:
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
},
{
  label: 'Stressed',
  emoji: '😫',
  color:
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
},
{
  label: 'Angry',
  emoji: '😠',
  color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}];

const moodScores: Record<Mood, number> = {
  Happy: 9,
  Calm: 8,
  Excited: 10,
  Sad: 3,
  Stressed: 2,
  Angry: 1,
  Anxious: 2,
  Tired: 4
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getMoodStorageKey(sessionId: string) {
  return `mindmate.moodEntries.${sessionId}`;
}

function loadMoodEntries(sessionId: string | null): MoodEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  if (!sessionId) {
    return [];
  }

  try {
    const storedEntries = window.localStorage.getItem(getMoodStorageKey(sessionId));
    if (!storedEntries) {
      return [];
    }

    const parsedEntries = JSON.parse(storedEntries) as MoodEntry[];
    return Array.isArray(parsedEntries) ? parsedEntries : [];
  } catch {
    return [];
  }
}

function mapHistoryEntry(entry: MoodHistoryEntry): MoodEntry {
  const mood = entry.mood;

  return {
    mood,
    score: mood in moodScores ? moodScores[mood as Mood] : 5,
    createdAt: entry.created_at,
  };
}

function buildChartData(entries: MoodEntry[]) {
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateKey = getDateKey(date);

    return {
      dateKey,
      day: weekDays[date.getDay()],
      score: 0,
      count: 0
    };
  });

  entries.forEach((entry) => {
    const createdAt = new Date(entry.createdAt);
    if (Number.isNaN(createdAt.getTime())) {
      return;
    }

    const dateKey = getDateKey(createdAt);
    const dayIndex = lastSevenDays.findIndex((day) => day.dateKey === dateKey);

    if (dayIndex >= 0) {
      lastSevenDays[dayIndex].score += entry.score;
      lastSevenDays[dayIndex].count += 1;
    }
  });

  const chartData = lastSevenDays.map((day) => ({
    day: day.day,
    score: day.count > 0 ? Number((day.score / day.count).toFixed(1)) : 0
  }));

  const hasAnyEntries = entries.length > 0;
  const hasRecentEntries = chartData.some((day) => day.score > 0);

  if (!hasAnyEntries || !hasRecentEntries) {
    return [
      { day: 'Mon', score: 6 },
      { day: 'Tue', score: 7 },
      { day: 'Wed', score: 4 },
      { day: 'Thu', score: 5 },
      { day: 'Fri', score: 8 },
      { day: 'Sat', score: 8 },
      { day: 'Sun', score: 7 }
    ];
  }

  return chartData;
}

export function MoodTracker({ sessionId }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [savedEntries, setSavedEntries] = useState<MoodEntry[]>([]);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    let isActive = true;

    if (!sessionId) {
      setSavedEntries([]);
      return;
    }

    getMoodHistory(sessionId)
      .then((result) => {
        if (!isActive) {
          return;
        }

        const historyEntries = result.history.map(mapHistoryEntry);
        setSavedEntries(historyEntries);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(getMoodStorageKey(sessionId), JSON.stringify(historyEntries));
        }
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setSavedEntries(loadMoodEntries(sessionId));
      });

    return () => {
      isActive = false;
    };
  }, [sessionId]);

  const chartData = useMemo(() => buildChartData(savedEntries), [savedEntries]);

  async function handleSaveMood() {
    if (!selectedMood) {
      return;
    }

    const nextEntry: MoodEntry = {
      mood: selectedMood,
      score: moodScores[selectedMood],
      createdAt: new Date().toISOString()
    };

    const nextEntries = [nextEntry, ...savedEntries].slice(0, 120);
    setSelectedMood(null);
    setSaveStatus(`Saved ${nextEntry.mood.toLowerCase()} mood to your history.`);

    if (sessionId) {
      try {
        await logMoodEntry(sessionId, selectedMood);
      } catch {
        // Keep the local cache if the backend write fails.
      }
    }

    setSavedEntries(nextEntries);

    if (typeof window !== 'undefined' && sessionId) {
      window.localStorage.setItem(getMoodStorageKey(sessionId), JSON.stringify(nextEntries));
    }
  }

  return (
    <div className="h-full min-h-0 flex flex-col gap-5 sm:gap-6 overflow-y-auto pr-1 sm:pr-2 pb-6">
      <header className="mb-2">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-mc-text mb-2">
          How are you feeling?
        </h2>
        <p className="text-mc-text-muted">
          Log your mood to track patterns over time.
        </p>
      </header>

      {/* Mood Selector */}
      <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {moodOptions.map((mood) =>
          <motion.button
            key={mood.label}
            whileHover={{
              scale: 1.05
            }}
            whileTap={{
              scale: 0.95
            }}
            onClick={() => setSelectedMood(mood.label)}
            className={cn(
              'flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border-2 transition-all',
              selectedMood === mood.label ?
              'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' :
              'border-transparent bg-mc-surface-solid hover:border-mc-border'
            )}>
            
              <span className="text-3xl sm:text-4xl mb-2 sm:mb-3">{mood.emoji}</span>
              <span
              className={cn('font-medium text-sm', mood.color.split(' ')[1])}>
              
                {mood.label}
              </span>
            </motion.button>
          )}
        </div>
        {selectedMood &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          className="mt-6 flex justify-end">
          
            <button
            onClick={handleSaveMood}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors shadow-sm">
              Save Entry
            </button>
          </motion.div>
        }
        {saveStatus &&
        <p className="mt-4 text-sm text-mc-text-muted">{saveStatus}</p>}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 flex-1 min-h-[300px]">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 flex flex-col min-h-[280px] sm:min-h-[320px]">
          <h3 className="font-heading font-semibold text-lg text-mc-text mb-6">
            Mood History
          </h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 20,
                  bottom: 5,
                  left: -20
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--mc-border)" />
                
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'var(--mc-text-muted)',
                    fontSize: 12
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'var(--mc-text-muted)',
                    fontSize: 12
                  }}
                  domain={[0, 10]} />
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--mc-surface-solid)',
                    borderRadius: '12px',
                    border: '1px solid var(--mc-border)',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{
                    color: 'var(--mc-text)'
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={4}
                  dot={{
                    fill: '#3B82F6',
                    strokeWidth: 2,
                    r: 4,
                    stroke: 'var(--mc-surface-solid)'
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0
                  }} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 flex flex-col gap-4">
          <h3 className="font-heading font-semibold text-lg text-mc-text mb-2">
            Weekly Insights
          </h3>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              You've logged <span className="font-semibold">Stressed</span> more
              frequently in the afternoons. Consider taking a short break around
              2 PM.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
            <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
              Your mood generally improves on weekends. Great job finding time
              to recharge!
            </p>
          </div>
        </div>
      </div>
    </div>);

}