import { useState, useEffect, useCallback, useRef } from 'react';
import { setupSpeechRecognition } from '../utils/speech/speechRecognition';
import { speak, cancelSpeech, isSpeechActive } from '../utils/speech/speechSynthesis';
import type { SpeechError } from '../utils/speech/types';

interface UseVoiceStateProps {
  onSpeechResult: (text: string) => void;
  lastBotMessage?: string;
}

export function useVoiceState({ onSpeechResult, lastBotMessage }: UseVoiceStateProps) {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialMessage, setIsInitialMessage] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    try {
      recognitionRef.current = setupSpeechRecognition();
      setupRecognitionHandlers();
    } catch (error) {
      const speechError = error as SpeechError;
      setError(speechError.message);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      cancelSpeech();
    };
  }, []);

  const setupRecognitionHandlers = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event: any) => {
      try {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          onSpeechResult(transcript);
          stopListening();
        }
      } catch (error) {
        const speechError = error as SpeechError;
        setError(speechError.message);
        stopListening();
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setError('Erro no reconhecimento de voz. Por favor, tente novamente.');
      setTimeout(() => setError(null), 5000);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, [onSpeechResult]);

  useEffect(() => {
    if (lastBotMessage && !isListening && !isMuted) {
      if (isInitialMessage) {
        setIsInitialMessage(false);
        return;
      }

      speak(lastBotMessage)
        .catch((error: SpeechError) => {
          if (error.type === 'synthesis' && error.originalError?.error !== 'interrupted') {
            console.error('Speech error:', error);
            setError(error.message);
            setTimeout(() => setError(null), 5000);
          }
        });
    }
  }, [lastBotMessage, isListening, isMuted, isInitialMessage]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      cancelSpeech();
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (error) {
        const speechError = error as SpeechError;
        setError(speechError.message);
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } finally {
        setIsListening(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev && isSpeechActive()) {
        cancelSpeech();
      }
      return !prev;
    });
  }, []);

  return {
    isListening,
    isMuted,
    error,
    startListening,
    stopListening,
    toggleMute,
  };
}