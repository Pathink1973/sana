import { SpeechError } from './types';

export function createSpeechRecognitionError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'recognition';
  error.originalError = originalError;
  return error;
}

export function setupSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    throw createSpeechRecognitionError('Speech recognition is not supported in this browser');
  }

  try {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'pt-PT';

    return recognition;
  } catch (error) {
    throw createSpeechRecognitionError('Failed to initialize speech recognition', error);
  }
}