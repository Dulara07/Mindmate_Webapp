import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, StopCircle } from 'lucide-react';
import { VoiceOrb } from '../components/VoiceOrb';
import { EmotionTone, Message } from '../types';
import { cn } from '../lib/utils';
import { useVoiceAssistant } from '../lib/useVoiceAssistant';

interface VoiceHubProps {
  onTriggerCrisis: () => void;
}

export function VoiceHub({ onTriggerCrisis }: VoiceHubProps) {
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'speaking'>(
    'idle'
  );
  const [emotion, setEmotion] = useState<EmotionTone>('neutral');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there. I'm here to listen. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSendRef = useRef<(text: string) => void>(() => undefined);
  const crisisKeywords = useMemo(
    () => ['hurt myself', 'suicide', 'end it', "can't go on", 'die'],
    []
  );
  const {
    isSupported: isVoiceSupported,
    status: voiceStatus,
    toggleListening,
    speak
  } = useVoiceAssistant({
    onTranscript: (text) => {
      setInputText(text);
      handleSendRef.current(text);
    }
  });

  useEffect(() => {
    setOrbState(voiceStatus);
  }, [voiceStatus]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const lowerText = text.toLowerCase();

    if (crisisKeywords.some((kw) => lowerText.includes(kw))) {
      onTriggerCrisis();
      setInputText('');
      return;
    }

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');

    if (lowerText.includes('stress') || lowerText.includes('overwhelmed')) {
      setEmotion('stressed');
    } else if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) {
      setEmotion('sad');
    } else if (lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('nervous')) {
      setEmotion('anxious');
    } else if (lowerText.includes('calm') || lowerText.includes('good') || lowerText.includes('peaceful')) {
      setEmotion('calm');
    } else if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('great') || lowerText.includes('excited')) {
      setEmotion('happy');
    } else if (lowerText.includes('confused') || lowerText.includes('lost') || lowerText.includes('unsure') || lowerText.includes('don\'t know')) {
      setEmotion('confused');
    }

    setOrbState('speaking');
    setTimeout(() => {
      let aiResponse =
        "I hear you. It's completely okay to feel that way. Would you like to talk more about it, or try a quick relaxation exercise?";

      if (lowerText.includes('sleep')) {
        aiResponse =
          'Trouble sleeping can be really frustrating. We have some gentle routines in the Sleep section that might help you wind down.';
      }

      if (lowerText.includes('relax')) {
        aiResponse =
          "Let's take a moment to breathe. You can find a guided breathing exercise in the Relaxation tab.";
      }

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, newAiMsg]);
      const didSpeak = speak(aiResponse);

      if (!didSpeak) {
        setOrbState('idle');
      }
    }, 2500);
  };
  handleSendRef.current = handleSend;

  const quickCommands = [
    'I feel stressed',
    'Help me relax',
    "I can't sleep",
    'Talk to me',
    'I need support'
  ];

  const hasUserMessages = messages.some(m => m.sender === 'user');

  return (
    <div className="h-full min-h-0 flex flex-col relative w-full">
      {/* Top section: Orb and Emotion Label — compact, does not grow */}
      <motion.div
        className="flex-shrink-0 flex flex-col items-center px-2 sm:px-4"
        animate={{
          paddingTop: hasUserMessages ? '0.5rem' : '1.5rem',
          paddingBottom: hasUserMessages ? '0.25rem' : '1rem',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center w-full"
        >
          <VoiceOrb state={orbState} emotion={emotion} />

          <motion.div
            className="mt-2 sm:mt-3 px-4 py-1.5 rounded-full bg-mc-surface-solid border border-mc-border shadow-sm flex items-center gap-2"
            animate={{ opacity: emotion !== 'neutral' ? 1 : 0 }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: `var(--mc-${emotion})` }}
            />
            <span className="text-sm font-medium text-mc-text capitalize">
              Sensing: {emotion}
            </span>
            <span className="text-xs text-mc-text-muted capitalize ml-2">
              Voice: {voiceStatus === 'idle' ? 'ready' : voiceStatus}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom section: Chat and Controls — fills all remaining space */}
      <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col mt-3 sm:mt-4 overflow-hidden">
        {/* Transcript Area */}
        <div className="flex-1 overflow-y-auto mb-4 pr-1 sm:pr-2 space-y-3 sm:space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className={cn(
                'max-w-[80%] rounded-2xl p-4',
                msg.sender === 'user'
                  ? 'ml-auto bg-blue-500 text-white rounded-br-sm'
                  : 'bg-mc-surface-solid text-mc-text border border-mc-border rounded-bl-sm shadow-sm'
              )}
            >
              <p
                className={cn(
                  'text-[15px] leading-relaxed',
                  msg.sender === 'ai' && 'font-medium'
                )}
              >
                {msg.text}
              </p>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Commands */}
        <div className="flex gap-2 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide">
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSend(cmd)}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-mc-surface-solid border border-mc-border text-sm text-mc-text-muted hover:text-mc-text hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex-shrink-0"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto">
          <button
            onClick={toggleListening}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed self-center sm:self-auto',
              voiceStatus === 'listening'
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            )}
            disabled={!isVoiceSupported}
          >
            {voiceStatus === 'listening' ? (
              <StopCircle className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 relative w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              placeholder={
                isVoiceSupported
                  ? 'Type or speak a message...'
                  : 'Type a message...'
              }
              className="w-full bg-mc-surface-solid border border-mc-border rounded-full py-3 pl-6 pr-12 text-mc-text placeholder:text-mc-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
            />

            <button
              onClick={() => handleSend(inputText)}
              disabled={!inputText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-blue-500 disabled:text-mc-text-muted transition-colors">

              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>);

}