import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, StopCircle } from 'lucide-react';
import { VoiceCharacter } from '../components/VoiceCharacter';
import { EmotionTone, Message } from '../types';
import { cn } from '../lib/utils';
import { useVoiceAssistant } from '../lib/useVoiceAssistant';
import { sendChatMessage } from '../lib/api';

interface VoiceHubProps {
  onTriggerCrisis: () => void;
  sessionId: string | null;
  onSessionIdChange: (sessionId: string) => void;
  onRestartConversation: () => void;
  conversationResetToken: number;
}

function createWelcomeMessage(): Message {
  return {
    id: '1',
    text: "Hi there. I'm Meena, and I'm here to listen. How are you feeling today?",
    sender: 'ai',
    timestamp: new Date(),
  };
}

export function VoiceHub({
  onTriggerCrisis,
  sessionId,
  onSessionIdChange,
  onRestartConversation,
  conversationResetToken,
}: VoiceHubProps) {
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [emotion, setEmotion] = useState<EmotionTone>('neutral');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage()]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const handleSendRef = useRef<(text: string) => void>(() => undefined);
  const crisisKeywords = useMemo(
    () => ['hurt myself', 'suicide', 'end it', "can't go on", 'die'],
    []
  );
  const {
    isSupported: isVoiceSupported,
    status: voiceStatus,
    toggleListening,
    stopListening,
    speak
  } = useVoiceAssistant({
    onTranscript: (text) => {
      setInputText(text);
      handleSendRef.current(text);
    },
  });

  useEffect(() => { setOrbState(voiceStatus); }, [voiceStatus]);

  useEffect(() => {
    setMessages([createWelcomeMessage()]);
    setInputText('');
    setIsSending(false);
    setEmotion('neutral');
    setOrbState('idle');
    window.speechSynthesis?.cancel();
    stopListening();

    const transcriptElement = transcriptRef.current;
    if (transcriptElement) {
      transcriptElement.scrollTop = 0;
    }
  }, [conversationResetToken, stopListening]);

  useEffect(() => {
    const transcriptElement = transcriptRef.current;

    if (!transcriptElement) {
      return;
    }

    const distanceFromBottom =
      transcriptElement.scrollHeight - transcriptElement.scrollTop - transcriptElement.clientHeight;

    if (distanceFromBottom < 80) {
      transcriptElement.scrollTop = transcriptElement.scrollHeight;
    }
  }, [messages]);

  const updateEmotionFromMood = (mood: string | null) => {
    const normalizedMood = mood?.toLowerCase() ?? '';

    if (normalizedMood.includes('stress')) {
      setEmotion('stressed');
    } else if (normalizedMood.includes('sad') || normalizedMood.includes('hopeless') || normalizedMood.includes('depress')) {
      setEmotion('sad');
    } else if (normalizedMood.includes('anxious') || normalizedMood.includes('worry')) {
      setEmotion('anxious');
    } else if (normalizedMood.includes('calm') || normalizedMood.includes('peace')) {
      setEmotion('calm');
    } else if (normalizedMood.includes('happy') || normalizedMood.includes('joy')) {
      setEmotion('happy');
    } else if (normalizedMood.includes('confused')) {
      setEmotion('confused');
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const lowerText = text.toLowerCase();

    if (crisisKeywords.some((kw) => lowerText.includes(kw))) {
      onTriggerCrisis();
      setInputText('');
      return;
    }

    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }]);
    setInputText('');
    setIsSending(true);

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
    } else if (lowerText.includes('confused') || lowerText.includes('lost') || lowerText.includes('unsure') || lowerText.includes("don't know")) {
      setEmotion('confused');
    }

    try {
      const response = await sendChatMessage(text, sessionId ?? undefined);

      if (response.sessionId && response.sessionId !== sessionId) {
        onSessionIdChange(response.sessionId);
      }

      updateEmotionFromMood(response.currentMood);

      if (response.isCrisis) {
        onTriggerCrisis();
      }

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: `Meena: ${response.reply}`,
        sender: 'ai',
        timestamp: new Date()
      }]);
      speak(response.reply);
      // voiceStatus from useVoiceAssistant drives orbState via the useEffect below.
      // utterance.onstart → 'speaking', utterance.onend → 'idle' — no manual sync needed.
    } catch {
      let aiResponse =
        "I hear you. It's completely okay to feel that way. Would you like to talk more about it, or try a quick relaxation exercise?";

      if (lowerText.includes('sleep'))
        aiResponse = 'Trouble sleeping can be really frustrating. I can help you explore gentle routines and calming bedtime tips.';
      if (lowerText.includes('relax'))
        aiResponse = "Let's take a moment to breathe together. I can guide you through a quick relaxation exercise.";
      if (lowerText.includes('help') || lowerText.includes('support'))
        aiResponse = "I'm here to support you. Tell me more about what you're feeling, and I'll help you through it step by step.";

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: `Meena: ${aiResponse}`,
        sender: 'ai',
        timestamp: new Date()
      }]);
      speak(aiResponse);
      // voiceStatus from useVoiceAssistant drives orbState via the useEffect below.
      // utterance.onstart → 'speaking', utterance.onend → 'idle' — no manual sync needed.
    } finally {
      setIsSending(false);
    }
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
    <div className="h-full min-h-0 flex flex-col relative w-full gap-4">

      {/* Character box — shrinks padding once chat starts */}
      <motion.div
        className="flex-shrink-0 flex flex-col items-center px-2 sm:px-4"
        animate={{
          paddingTop:    hasUserMessages ? '0.5rem' : '1.25rem',
          paddingBottom: hasUserMessages ? '0.25rem' : '0.75rem',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center w-full"
        >
          <VoiceCharacter state={orbState} emotion={emotion} />

          {/* Compact one-line subtitle — hidden once the user starts chatting */}
          {!hasUserMessages && (
            <p className="mt-2 text-sm text-mc-text-muted text-center">
              Your companion · Ask anything and Meena will talk with you.
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Chat panel */}
      <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 mb-4 sm:mb-6 flex flex-col overflow-hidden">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-mc-text">Conversation</p>
            <p className="text-xs text-mc-text-muted">Start a fresh chat to clear the previous session.</p>
          </div>
          <button
            onClick={onRestartConversation}
            className="shrink-0 rounded-full border border-mc-border bg-mc-surface-solid px-4 py-2 text-sm font-medium text-mc-text hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            New chat
          </button>
        </div>

        {/* Transcript */}
        <div ref={transcriptRef} className="flex-1 overflow-y-auto mb-3 pr-1 sm:pr-2 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'max-w-[80%] rounded-2xl p-4',
                msg.sender === 'user'
                  ? 'ml-auto bg-blue-500 text-white rounded-br-sm'
                  : 'bg-mc-surface-solid text-mc-text border border-mc-border rounded-bl-sm shadow-sm'
              )}
            >
              <p className={cn('text-[15px] leading-relaxed', msg.sender === 'ai' && 'font-medium')}>
                {msg.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Commands */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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

        {/* Input */}
        <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2" onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}>
          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed self-center sm:self-auto',
              voiceStatus === 'listening'
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            )}
            disabled={!isVoiceSupported}
          >
            {voiceStatus === 'listening'
              ? <StopCircle className="w-6 h-6" />
              : <Mic className="w-6 h-6" />}
          </button>

          <div className="flex-1 relative w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isVoiceSupported ? 'Type or speak a message...' : 'Type a message...'}
              className="w-full bg-mc-surface-solid border border-mc-border rounded-full py-3 pl-6 pr-12 text-mc-text placeholder:text-mc-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-blue-500 disabled:text-mc-text-muted transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
