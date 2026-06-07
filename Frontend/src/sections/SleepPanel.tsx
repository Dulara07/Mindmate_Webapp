import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Coffee,
  Smartphone,
  Clock,
  CheckCircle2,
  Circle } from
'lucide-react';
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
}];

export function SleepPanel() {
  const [checklist, setChecklist] = useState([
  {
    id: 1,
    text: 'Dim the lights',
    completed: false
  },
  {
    id: 2,
    text: 'Read a book for 20 mins',
    completed: false
  },
  {
    id: 3,
    text: 'Do a 5-min breathing exercise',
    completed: false
  },
  {
    id: 4,
    text: 'Set alarm for tomorrow',
    completed: false
  }]
  );
  const toggleTask = (id: number) => {
    setChecklist(
      checklist.map((task) =>
      task.id === id ?
      {
        ...task,
        completed: !task.completed
      } :
      task
      )
    );
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

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Tonight's Plan Checklist */}
        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 flex flex-col">
          <h3 className="font-heading font-semibold text-lg sm:text-xl text-mc-text mb-5 sm:mb-6">
            Tonight's Routine
          </h3>
          <div className="space-y-3 flex-1">
            {checklist.map((task) =>
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                'w-full flex items-center gap-3 sm:gap-4 p-4 rounded-2xl border transition-all text-left',
                task.completed ?
                'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/50 text-mc-text-muted' :
                'bg-mc-surface-solid border-mc-border text-mc-text hover:border-indigo-300 shadow-sm'
              )}>
              
                {task.completed ?
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 flex-shrink-0" /> :

              <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-mc-text-muted flex-shrink-0" />
              }
                <span
                className={cn(
                  'text-[15px]',
                  task.completed && 'line-through'
                )}>
                
                  {task.text}
                </span>
              </button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-mc-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-mc-text-muted">Progress</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {checklist.filter((t) => t.completed).length} /{' '}
                {checklist.length} completed
              </span>
            </div>
            <div className="w-full h-2 bg-mc-surface-solid rounded-full mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{
                  width: 0
                }}
                animate={{
                  width: `${checklist.filter((t) => t.completed).length / checklist.length * 100}%`
                }}
                transition={{
                  duration: 0.5
                }} />
              
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
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: i * 0.1
                }}
                className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-mc-text mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-mc-text-muted leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </motion.div>);

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
    </div>);

}