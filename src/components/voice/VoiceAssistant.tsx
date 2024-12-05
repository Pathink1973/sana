import React from 'react';
import VoiceControls from './VoiceControls';
import VoiceStatus from './VoiceStatus';
import VoiceTranscript from './VoiceTranscript';
import { useVoiceState } from '../../hooks/useVoiceState';

interface VoiceAssistantProps {
  onSpeechResult: (text: string) => void;
  isProcessing: boolean;
  lastBotMessage?: string;
}

export default function VoiceAssistant({ onSpeechResult, isProcessing, lastBotMessage }: VoiceAssistantProps) {
  const {
    isListening,
    isMuted,
    error,
    startListening,
    stopListening,
    toggleMute,
  } = useVoiceState({
    onSpeechResult,
    lastBotMessage,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <VoiceStatus 
            isListening={isListening}
            isProcessing={isProcessing}
            error={error}
          />
          <VoiceControls
            isListening={isListening}
            isMuted={isMuted}
            isProcessing={isProcessing}
            onStartListening={startListening}
            onStopListening={stopListening}
            onToggleMute={toggleMute}
          />
          <VoiceTranscript
            isListening={isListening}
            lastBotMessage={lastBotMessage}
          />
        </div>
      </div>
    </div>
  );
}