import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2, Volume2, VolumeX } from 'lucide-react';
import { setupSpeechRecognition } from '../utils/speech/speechRecognition';
import { speak, cancelSpeech } from '../utils/speech/speechSynthesis';
import type { SpeechError } from '../utils/speech/types';

interface VoiceWidgetProps {
  onSpeechResult: (text: string) => void;
  isProcessing: boolean;
  lastBotMessage?: string;
}

export default function VoiceWidget({ onSpeechResult, isProcessing, lastBotMessage }: VoiceWidgetProps) {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialMessage, setIsInitialMessage] = useState(true);

  useEffect(() => {
    try {
      const recognitionInstance = setupSpeechRecognition();
      setRecognition(recognitionInstance);
    } catch (error) {
      const speechError = error as SpeechError;
      setError(speechError.message);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      cancelSpeech();
    };
  }, []);

  useEffect(() => {
    if (lastBotMessage && !isListening && !isMuted) {
      if (isInitialMessage) {
        setIsInitialMessage(false);
        return;
      }

      speak(lastBotMessage)
        .catch((error: SpeechError) => {
          // Ignore intentional interruptions
          if (error.type === 'synthesis' && error.message !== 'Speech synthesis interrupted') {
            console.error('Speech error:', error);
            setError(error.message);
            setTimeout(() => setError(null), 5000);
          }
        });
    }
  }, [lastBotMessage, isListening, isMuted, isInitialMessage]);

  const startListening = useCallback(() => {
    if (recognition) {
      cancelSpeech();
      try {
        recognition.start();
        setIsListening(true);
        setError(null);
      } catch (error) {
        const speechError = error as SpeechError;
        setError(speechError.message);
        setIsListening(false);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
      } finally {
        setIsListening(false);
      }
    }
  }, [recognition]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) {
        cancelSpeech();
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
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

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setError('Erro no reconhecimento de voz. Por favor, tente novamente.');
      setTimeout(() => setError(null), 5000);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, [recognition, onSpeechResult, stopListening]);

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        {isListening && (
          <span className="absolute -top-1 -right-1 w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      <button
        onClick={toggleMute}
        className={`p-3 rounded-full transition-colors ${
          isMuted ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
        } hover:bg-opacity-80`}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
      
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}