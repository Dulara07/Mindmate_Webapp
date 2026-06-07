import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Heart,
  Mic,
  Moon,
  ShieldAlert,
  Smile,
  Wind
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Section } from '../types';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Voice Hub',
      icon: Mic
    },
    {
      id: 'mood',
      label: 'Mood Tracker',
      icon: Smile
    },
    {
      id: 'breathing',
      label: 'Relaxation',
      icon: Wind
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: Moon
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: BookOpen
    }
  ] as const;

  return (
    <aside className="w-full h-auto flex flex-col glass-panel rounded-3xl p-4 sm:p-5 xl:p-6 flex-shrink-0 xl:h-full">
      <div className="flex items-center gap-3 mb-6 sm:mb-8 xl:mb-12 px-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-lg">
          <Heart className="w-5 h-5 text-white" fill="currentColor" />
        </div>
        <h1 className="font-heading font-semibold text-xl tracking-tight text-mc-text">
          MindCare
        </h1>
      </div>

      <nav className="flex-1 grid grid-cols-2 gap-2 sm:gap-3 xl:flex xl:flex-col xl:space-y-2 xl:gap-0">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id as Section)}
              className={cn(
                'w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-2xl transition-all duration-300 relative group justify-start min-w-0',
                isActive
                  ? 'text-mc-text bg-mc-surface-solid shadow-sm'
                  : 'text-mc-text-muted hover:text-mc-text hover:bg-mc-surface-solid/50'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-mc-surface-solid rounded-2xl shadow-sm border border-mc-border"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3 sm:gap-4 min-w-0">
                <Icon className={cn('w-5 h-5', isActive ? 'text-blue-500' : '')} />
                <span className="font-medium truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 xl:mt-auto pt-4 xl:pt-6 border-t border-mc-border">
        <button
          onClick={() => onSectionChange('emergency')}
          className={cn(
            'w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-2xl transition-all duration-300 justify-start',
            activeSection === 'emergency'
              ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
              : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
          )}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="font-medium">Emergency Help</span>
        </button>
      </div>
    </aside>
  );
}