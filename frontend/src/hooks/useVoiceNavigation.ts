import { useCallback, useEffect, useRef, useState } from 'react';

interface VoiceNavigationOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  lang?: string;
}

/** Web Speech API hook for turn-by-turn voice guidance */
export function useVoiceNavigation(options: VoiceNavigationOptions = {}) {
  const { enabled = true, rate = 1, pitch = 1, lang = 'en-US' } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const queueRef = useRef<string[]>([]);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback(
    (text: string, interrupt = false) => {
      if (!enabled || !isSupported || !text.trim()) return;

      if (interrupt) {
        window.speechSynthesis.cancel();
        queueRef.current = [];
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = lang;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        const next = queueRef.current.shift();
        if (next) speak(next);
      };
      utterance.onerror = () => setIsSpeaking(false);

      if (isSpeaking && !interrupt) {
        queueRef.current.push(text);
      } else {
        window.speechSynthesis.speak(utterance);
      }
    },
    [enabled, isSupported, rate, pitch, lang, isSpeaking]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    queueRef.current = [];
    setIsSpeaking(false);
  }, []);

  const announceTurn = useCallback(
    (instruction: string) => {
      speak(`Navigation: ${instruction}`, true);
    },
    [speak]
  );

  return { speak, stop, announceTurn, isSpeaking, isSupported };
}
