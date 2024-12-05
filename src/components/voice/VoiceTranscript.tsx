import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceTranscriptProps {
  isListening: boolean;
  lastBotMessage?: string;
}

export default function VoiceTranscript({ isListening, lastBotMessage }: VoiceTranscriptProps) {
  return (
    <div className="flex-1 max-w-2xl mx-4">
      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm text-gray-600"
          >
            Fale agora...
          </motion.div>
        ) : lastBotMessage ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm text-gray-800"
          >
            {lastBotMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}