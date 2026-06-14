import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceStatus = 'idle' | 'listening' | 'speaking';

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: {
    transcript: string;
  };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultLike[];
};

type SpeechRecognitionInstanceLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: null | (() => void);
  onresult: null | ((event: SpeechRecognitionEventLike) => void);
  onerror: null | ((event: { error: string }) => void);
  onend: null | (() => void);
};

type VoiceAssistantOptions = {
  onTranscript?: (text: string) => void;
};

export function useVoiceAssistant(options: VoiceAssistantOptions = {}) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstanceLike | null>(null);
  const onTranscriptRef = useRef(options.onTranscript);

  useEffect(() => {
    onTranscriptRef.current = options.onTranscript;
  }, [options.onTranscript]);

  useEffect(() => {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionInstanceLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstanceLike;
    };

    setIsSupported(
      Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition)
    );
  }, []);

  const ensureRecognition = useCallback(() => {
    if (recognitionRef.current) {
      return recognitionRef.current;
    }

    const speechWindow = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionInstanceLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstanceLike;
    };

    const RecognitionCtor =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      setIsSupported(false);
      return null;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setStatus('listening');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? '';

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const transcript = finalTranscript || interimTranscript;

      if (finalTranscript.trim()) {
        onTranscriptRef.current?.(finalTranscript.trim());
        recognition.stop();
      }

      return transcript;
    };

    recognition.onerror = () => {
      setStatus('idle');
    };

    recognition.onend = () => {
      setStatus((current) => (current === 'speaking' ? current : 'idle'));
    };

    recognitionRef.current = recognition;
    return recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      return false;
    }

    const recognition = ensureRecognition();
    if (!recognition) {
      return false;
    }

    try {
      recognition.start();
      return true;
    } catch {
      setStatus('idle');
      return false;
    }
  }, [ensureRecognition, isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus((current) => (current === 'speaking' ? current : 'idle'));
  }, []);

  const toggleListening = useCallback(() => {
    if (status === 'listening') {
      stopListening();
      return false;
    }

    return startListening();
  }, [startListening, status, stopListening]);

  const speak = useCallback((text: string) => {
    const speechSynthesisApi = window.speechSynthesis;

    if (!speechSynthesisApi) {
      return false;
    }

    speechSynthesisApi.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = speechSynthesisApi.getVoices();
    const selectedVoice =
      voices.find(
        (voice) =>
          voice.name.includes('Premium') ||
          voice.name.includes('Enhanced') ||
          voice.name.includes('Google US English') ||
          voice.name.includes('Samantha') ||
          (voice.lang === 'en-US' && voice.name.toLowerCase().includes('female'))
      ) ?? voices.find((voice) => voice.lang === 'en-US') ?? voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setStatus('speaking');
    };

    utterance.onend = () => {
      setStatus('idle');
    };

    utterance.onerror = () => {
      setStatus('idle');
    };

    speechSynthesisApi.speak(utterance);
    return true;
  }, []);

  return {
    isSupported,
    status,
    startListening,
    stopListening,
    toggleListening,
    speak
  };
}
