import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, StopCircle } from 'lucide-react';
import { VoiceOrb } from '../components/VoiceOrb';
import { EmotionTone, Message } from '../types';
import { cn } from '../lib/utils';
import { useVoiceAssistant } from '../lib/useVoiceAssistant';

// ─── Backend config ────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:3000';
const SESSION_KEY = 'mindcare.sessionId';

// ─── Map backend mood → frontend EmotionTone ──────────────────────────────────
function toEmotionTone(mood: string | null): EmotionTone {
  if (!mood) return 'neutral';
  if (['stressed', 'angry', 'overwhelmed'].includes(mood)) return 'stressed';
  if (['sad', 'lonely', 'hopeless'].includes(mood))        return 'sad';
  if (['anxious', 'nervous', 'worried'].includes(mood))    return 'anxious';
  if (['calm', 'happy', 'peaceful', 'content'].includes(mood)) return 'calm';
  return 'neutral';
}

interface VoiceHubProps {
  onTriggerCrisis: () => void;
}

export function VoiceHub({ onTriggerCrisis }: VoiceHubProps) {
  const [orbState, setOrbState]   = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [emotion, setEmotion]     = useState<EmotionTone>('neutral');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() =>
    localStorage.getItem(SESSION_KEY) ?? ''
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there. I'm here to listen. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSendRef  = useRef<(text: string) => void>(() => undefined);

  const { isSupported: isVoiceSupported, status: voiceStatus, toggleListening, speak } =
    useVoiceAssistant({
      onTranscript: (text) => {
        setInputText(text);
        handleSendRef.current(text);
      },
    });

  useEffect(() => { setOrbState(voiceStatus); }, [voiceStatus]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Pre-create the session on mount so the first message doesn't pay
  //    for two sequential round-trips (session/new → chat). ─────────────────────
  useEffect(() => {
    if (sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/session/new`, { method: 'POST' });
        const data = await res.json();
        if (cancelled) return;
        const id: string = data.sessionId;
        if (id) {
          localStorage.setItem(SESSION_KEY, id);
          setSessionId(id);
        }
      } catch {
        // ensureSession() below will retry / fall back on first send.
      }
    })();
    return () => { cancelled = true; };
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Ensure we always have a valid sessionId (fallback path) ──────────────────
  const ensureSession = useCallback(async (): Promise<string> => {
    if (sessionId) return sessionId;
    try {
      const res  = await fetch(`${API_BASE}/api/session/new`, { method: 'POST' });
      const data = await res.json();
      const id: string = data.sessionId;
      localStorage.setItem(SESSION_KEY, id);
      setSessionId(id);
      return id;
    } catch {
      // offline fallback – use a temp local id
      const fallback = `local-${Date.now()}`;
      setSessionId(fallback);
      return fallback;
    }
  }, [sessionId]);

  // ── Main send handler ────────────────────────────────────────────────────────
  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message to UI immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setOrbState('speaking');

    try {
      const sid = await ensureSession();

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sid }),
      });

      const data = await res.json();

      // ── Handle crisis response ─────────────────────────────────────────────
      if (data.isCrisis) {
        onTriggerCrisis();
        setIsLoading(false);
        setOrbState('idle');
        return;
      }

      // ── Update emotion from backend currentMood ────────────────────────────
      if (data.currentMood) {
        setEmotion(toEmotionTone(data.currentMood));
      }

      // ── Show AI reply ──────────────────────────────────────────────────────
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // ── If bot asked a follow-up, show the prompt too ──────────────────────
      if (data.requiresFollowup && data.followupPrompt) {
        // followupPrompt is already embedded in the reply text from backend,
        // so we just speak the reply
      }

      const didSpeak = speak(data.reply);
      if (!didSpeak) setOrbState('idle');

    } catch (err) {
      // Network error fallback
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please make sure the backend server is running on port 3000.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setOrbState('idle');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, ensureSession, onTriggerCrisis, speak]);

  handleSendRef.current = handleSend;

  const quickCommands = [
    'I feel stressed',
    'Help me relax',
    "I can't sleep",
    'What is anxiety?',
    'I need support',
  ];

  return (
    <div className="h-full min-h-0 flex flex-col relative w-full">

      {/* Orb + Emotion label */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[240px] xl:min-h-[250px] px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 sm:mb-4 flex flex-col items-center w-full"
        >
          <VoiceOrb state={orbState} emotion={emotion} />

          <motion.div
            className="mt-3 sm:mt-4 px-4 py-2 rounded-full bg-mc-surface-solid border border-mc-border shadow-sm flex items-center gap-2 flex-col sm:flex-row text-center sm:text-left"
            animate={{ opacity: emotion !== 'neutral' ? 1 : 0 }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `var(--mc-${emotion})` }} />
            <span className="text-sm font-medium text-mc-text capitalize">Sensing: {emotion}</span>
            <span className="text-xs text-mc-text-muted capitalize sm:ml-2">
              Voice: {voiceStatus === 'idle' ? 'ready' : voiceStatus}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Chat panel */}
      <div className="w-full max-w-4xl mx-auto glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col min-h-[240px] lg:min-h-[240px] lg:h-[28vh]">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 pr-1 sm:pr-2 space-y-3 sm:space-y-4">
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

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[80%] rounded-2xl p-4 bg-mc-surface-solid border border-mc-border rounded-bl-sm shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ y: ['0%', '-50%', '0%'] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-mc-text-muted">MindCare is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick commands */}
        <div className="flex gap-2 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide">
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSend(cmd)}
              disabled={isLoading}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-mc-surface-solid border border-mc-border text-sm text-mc-text-muted hover:text-mc-text hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex-shrink-0 disabled:opacity-50"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto">
          <button
            onClick={toggleListening}
            disabled={!isVoiceSupported}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed self-center sm:self-auto',
              voiceStatus === 'listening'
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            )}
          >
            {voiceStatus === 'listening' ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <div className="flex-1 relative w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              disabled={isLoading}
              placeholder={isVoiceSupported ? 'Type or speak a message...' : 'Type a message...'}
              className="w-full bg-mc-surface-solid border border-mc-border rounded-full py-3 pl-6 pr-12 text-mc-text placeholder:text-mc-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner disabled:opacity-60"
            />
            <button
              onClick={() => handleSend(inputText)}
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-blue-500 disabled:text-mc-text-muted transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
