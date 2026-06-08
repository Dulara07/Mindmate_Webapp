import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'listening' | 'speaking';

interface Options {
  onTranscript: (text: string) => void;
  lang?: string;
}

/**
 * Web Speech API voice assistant hook.
 *
 * Key perf choices to keep latency low:
 *  - interimResults: true  → we get partial results, so we can detect
 *    `isFinal` and act on it immediately instead of waiting for `onend`
 *    (which only fires after the browser's silence timeout, ~1.5–3s).
 *  - continuous: false     → one utterance per start; recognition ends
 *    cleanly after the final result.
 *  - rec.stop() on first final result → releases the mic right away.
 *
 * Place this file at: src/lib/useVoiceAssistant.ts
 */
export function useVoiceAssistant({ onTranscript, lang = 'en-US' }: Options) {
  const [status, setStatus] = useState<Status>('idle');
  const recognitionRef = useRef<any>(null);

  // Keep a ref to the latest callback so the recognition instance
  // (created once in an effect) always calls the freshest handler.
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const isSupported =
    !!SpeechRecognition &&
    typeof window !== 'undefined' &&
    'speechSynthesis' in window;

  useEffect(() => {
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      // Walk the results; the instant one is final, send it and stop.
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          const text = (r[0]?.transcript ?? '').trim();
          if (text) onTranscriptRef.current(text);
          try { rec.stop(); } catch { /* noop */ }
          return;
        }
      }
    };

    rec.onend = () => {
      setStatus((s) => (s === 'speaking' ? s : 'idle'));
    };

    rec.onerror = () => {
      setStatus('idle');
    };

    recognitionRef.current = rec;

    return () => {
      try { rec.abort(); } catch { /* noop */ }
      recognitionRef.current = null;
    };
  }, [lang, SpeechRecognition]);

  const toggleListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (status === 'listening') {
      try { rec.stop(); } catch { /* noop */ }
      setStatus('idle');
      return;
    }

    try {
      rec.start();
      setStatus('listening');
    } catch {
      // rec.start() throws if it's already started — safe to ignore.
    }
  }, [status]);

  const speak = useCallback(
    (text: string): boolean => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return false;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onstart = () => setStatus('speaking');
      utterance.onend = () => setStatus('idle');
      utterance.onerror = () => setStatus('idle');
      window.speechSynthesis.speak(utterance);
      return true;
    },
    [lang]
  );

  return { isSupported, status, toggleListening, speak };
}
