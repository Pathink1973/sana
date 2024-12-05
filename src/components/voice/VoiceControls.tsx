import React from 'react';
import { Mic, MicOff, Loader2, Volume2, VolumeX } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isMuted: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleMute: () => void;
}

export default function VoiceControls({
  isListening,
  isMuted,
  isProcessing,
  onStartListening,
  onStopListening,
  onToggleMute,
}: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={isListening ? onStopListening : onStartListening}
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        )}
      </button>

      <button
        onClick={onToggleMute}
        className={`p-3 rounded-full transition-colors ${
          isMuted ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
        } hover:bg-opacity-80`}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}