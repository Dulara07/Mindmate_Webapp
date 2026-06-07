import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, Heart, Brain, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
const topics = [
{
  id: 'anxiety',
  title: 'Understanding Anxiety',
  icon: Zap,
  color: 'text-amber-500',
  bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  explanation:
  "Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. While uncomfortable, it's a normal human emotion designed to keep us safe.",
  feelsLike:
  'You might notice a racing heart, shallow breathing, restlessness, or a feeling of dread. Your mind might race with "what if" scenarios.',
  helps: [
  'Deep, slow breathing',
  'Grounding exercises (like the 5-4-3-2-1 method)',
  'Limiting caffeine',
  'Talking to someone you trust']

},
{
  id: 'stress',
  title: 'Managing Stress',
  icon: Brain,
  color: 'text-blue-500',
  bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  explanation:
  'Stress is physical, mental, or emotional strain or tension. It happens when we feel that the demands placed on us exceed our ability to cope.',
  feelsLike:
  'Tension in your shoulders or jaw, irritability, difficulty concentrating, or feeling overwhelmed by small tasks.',
  helps: [
  'Breaking large tasks into smaller steps',
  'Regular physical activity',
  'Setting boundaries and saying "no"',
  'Ensuring adequate sleep']

},
{
  id: 'depression',
  title: 'Navigating Low Mood',
  icon: Heart,
  color: 'text-purple-500',
  bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  explanation:
  'Feeling down or depressed is more than just sadness. It can be a persistent feeling of emptiness or a loss of interest in things you usually enjoy.',
  feelsLike:
  "Feeling constantly tired, struggling to get out of bed, changes in appetite, or feeling like things won't get better.",
  helps: [
  'Gentle movement (even a short walk)',
  "Connecting with others, even if you don't feel like it",
  'Small, achievable daily goals',
  'Professional support']

}];

export function LearnLibrary() {
  const [expandedId, setExpandedId] = useState<string | null>(topics[0].id);
  return (
    <div className="h-full min-h-0 flex flex-col gap-5 sm:gap-6 overflow-y-auto pr-1 sm:pr-2 pb-6">
      <header className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-teal-500" />
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-mc-text">
            Psychoeducation
          </h2>
        </div>
        <p className="text-mc-text-muted">
          Simple, supportive information to help you understand your feelings.
        </p>
      </header>

      <div className="max-w-3xl space-y-4">
        {topics.map((topic) => {
          const isExpanded = expandedId === topic.id;
          const Icon = topic.icon;
          return (
            <div
              key={topic.id}
              className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden transition-all duration-300">
              
              <button
                onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-mc-surface-solid/50 transition-colors gap-4">
                
                <div className="flex items-center gap-4">
                  <div
                    className={cn('p-2.5 sm:p-3 rounded-xl flex-shrink-0', topic.bgColor, topic.color)}>
                    
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg sm:text-xl text-mc-text">
                    {topic.title}
                  </h3>
                </div>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-mc-text-muted transition-transform duration-300 flex-shrink-0',
                    isExpanded && 'rotate-180'
                  )} />
                
              </button>

              <AnimatePresence>
                {isExpanded &&
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1
                  }}
                  exit={{
                    height: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut'
                  }}>
                  
                    <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-mc-border/50 space-y-5 sm:space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-mc-text uppercase tracking-wider mb-2 opacity-70">
                          Simple Explanation
                        </h4>
                        <p className="text-mc-text leading-relaxed">
                          {topic.explanation}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-mc-surface-solid border border-mc-border">
                        <h4 className="text-sm font-semibold text-mc-text uppercase tracking-wider mb-2 opacity-70">
                          What it feels like
                        </h4>
                        <p className="text-mc-text-muted leading-relaxed">
                          {topic.feelsLike}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-mc-text uppercase tracking-wider mb-3 opacity-70">
                          What helps
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {topic.helps.map((help, i) =>
                        <li
                          key={i}
                          className="flex items-start gap-2 text-mc-text">
                          
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                              <span className="leading-relaxed">{help}</span>
                            </li>
                        )}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </div>);

        })}
      </div>
    </div>);

}