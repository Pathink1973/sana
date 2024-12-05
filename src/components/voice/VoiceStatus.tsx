import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceStatusProps {
  isListening: boolean;
  isProcessing: boolean;
  error: string | null;
}

export default function VoiceStatus({ isListening, isProcessing, error }: VoiceStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        ) : isProcessing ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-blue-600 text-sm"
          >
            Processando...
          </motion.div>
        ) : isListening ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-red-600 text-sm"
          >
            Ouvindo...
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}