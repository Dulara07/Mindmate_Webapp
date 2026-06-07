import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { CrisisOverlay } from './components/CrisisOverlay';
import { VoiceHub } from './sections/VoiceHub';
import { MoodTracker } from './sections/MoodTracker';
import { BreathingMode } from './sections/BreathingMode';
import { SleepPanel } from './sections/SleepPanel';
import { LearnLibrary } from './sections/LearnLibrary';
import { Section } from './types';
import { cn } from './lib/utils';
import { useScreenInit } from './useScreenInit.js';
type BreathingSessionState = {
  isActive: boolean;
  phase: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
  timeLeft: number;
};
export function App() {
  const screenInit = useScreenInit();
  const [activeSection, setActiveSection] = useState<Section>(
    screenInit?.activeSection as Section ?? 'dashboard'
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(
    screenInit?.isCrisisMode ?? false
  );
  const [breathingState, setBreathingState] = useState<BreathingSessionState>({
    isActive: false,
    phase: 'inhale',
    timeLeft: 4
  });
  // Handle dark mode class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  const handleSectionChange = (section: Section) => {
    if (section === 'emergency') {
      setIsCrisisMode(true);
    } else {
      setActiveSection(section);
    }
  };
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <VoiceHub onTriggerCrisis={() => setIsCrisisMode(true)} />;
      case 'mood':
        return <MoodTracker />;
      case 'breathing':
        return (
          <BreathingMode onStateChange={setBreathingState} />
        );
      case 'sleep':
        return <SleepPanel />;
      case 'learn':
        return <LearnLibrary />;
      default:
        return <VoiceHub onTriggerCrisis={() => setIsCrisisMode(true)} />;
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-auto bg-[var(--mc-bg)] p-3 sm:p-4 lg:p-6 transition-colors duration-500 relative">
      {/* Background ambient blobs (optional, adds to the soft feel) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 dark:bg-purple-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 grid w-full max-w-[1600px] mx-auto min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[clamp(240px,16vw,280px)_minmax(0,1fr)_clamp(300px,20vw,340px)] xl:gap-4">
        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange} />
        

        {/* Main Content Area */}
        <main
          className={cn(
            'flex-1 flex flex-col min-h-0 relative transition-all duration-300 w-full',
            activeSection === 'breathing'
              ? 'rounded-[2.5rem] overflow-hidden shadow-2xl'
              : ''
          )}>
          
          {/* Top Bar (Theme Toggle) */}
          {activeSection !== 'breathing' &&
          <div className="absolute top-0 right-0 z-20 p-2">
              <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-full glass-panel text-mc-text-muted hover:text-mc-text transition-colors shadow-sm"
              aria-label="Toggle dark mode">
              
                {isDarkMode ?
              <Sun className="w-5 h-5" /> :

              <Moon className="w-5 h-5" />
              }
              </button>
            </div>
          }

          {/* Rendered Section */}
          <div className="flex-1 h-full min-h-0 w-full pt-14 sm:pt-0">{renderContent()}</div>
        </main>

        {/* Right Insights Panel */}
        {activeSection !== 'dashboard' && (
          <div className="hidden xl:block h-full">
            <RightPanel
              activeSection={activeSection}
              breathingState={breathingState}
            />
          </div>
        )}
        {activeSection === 'dashboard' && (
          <div className="hidden xl:block h-full">
            <RightPanel activeSection={activeSection} />
          </div>
        )}
      </div>

      {/* Crisis Overlay */}
      <CrisisOverlay
        isOpen={isCrisisMode}
        onClose={() => setIsCrisisMode(false)}
        onNavigateToBreathing={() => {
          setIsCrisisMode(false);
          setActiveSection('breathing');
        }} />
      
    </div>);

}