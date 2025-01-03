import { SpeechConfig, SpeechError } from './types';
import { voiceManager } from './voiceManager';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let isSpeaking = false;
let hasSpokenInitialGreeting = false;

const defaultConfig: SpeechConfig = {
  lang: 'pt-PT',
  pitch: 1.05,
  rate: 0.95,
  volume: 1.0
};

export function cancelSpeech() {
  if (currentUtterance || isSpeaking) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    isSpeaking = false;
  }
}

function createSpeechError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'synthesis';
  error.originalError = originalError;
  return error;
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s*\1+/g, '$1')
    .trim();
}

export async function speak(text: string, config: Partial<SpeechConfig> = {}): Promise<void> {
  if (!text.trim()) return Promise.resolve();

  // Special handling for initial greeting
  const isInitialGreeting = !hasSpokenInitialGreeting && 
    text === "Olá! Sou seu assistente de inteligência artificial. Como posso ajudar hoje?";

  if (isInitialGreeting) {
    hasSpokenInitialGreeting = true;
    // For the initial greeting, we'll wait a bit to ensure speech synthesis is ready
    return new Promise(resolve => {
      setTimeout(() => {
        speakWithRetry(text, config).catch(() => {
          // Silently handle errors for initial greeting
          resolve();
        });
        resolve();
      }, 1000);
    });
  }

  return speakWithRetry(text, config);
}

async function speakWithRetry(text: string, config: Partial<SpeechConfig>, retries = 2): Promise<void> {
  // Cancel any ongoing speech
  cancelSpeech();

  const speechConfig = { ...defaultConfig, ...config };

  try {
    return new Promise(async (resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText(text));
        currentUtterance = utterance;

        // Get appropriate voice
        const voice = await voiceManager.getVoice({ 
          preferredLang: speechConfig.lang,
          preferredGender: 'female'
        });

        if (voice) {
          utterance.voice = voice;
        }

        // Apply configuration
        utterance.lang = speechConfig.lang;
        utterance.pitch = speechConfig.pitch;
        utterance.rate = speechConfig.rate;
        utterance.volume = speechConfig.volume;

        // Event handlers
        utterance.onstart = () => {
          isSpeaking = true;
        };

        utterance.onend = () => {
          currentUtterance = null;
          isSpeaking = false;
          resolve();
        };

        utterance.onerror = async (event) => {
          // Handle interruptions gracefully
          if (event.error === 'interrupted') {
            currentUtterance = null;
            isSpeaking = false;
            resolve();
            return;
          }

          // For other errors, try to retry if possible
          if (retries > 0) {
            currentUtterance = null;
            isSpeaking = false;
            try {
              await speakWithRetry(text, config, retries - 1);
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            currentUtterance = null;
            isSpeaking = false;
            reject(createSpeechError('Speech synthesis failed', event));
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (error) {
        reject(createSpeechError('Speech synthesis initialization failed', error));
      }
    });
  } catch (error) {
    throw createSpeechError('Speech synthesis failed', error);
  }
}

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isSpeaking && currentUtterance) {
    window.speechSynthesis.resume();
  }
});

// Periodic check to prevent speech synthesis from getting stuck
setInterval(() => {
  if (isSpeaking && currentUtterance) {
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }
}, 5000);

// Cleanup on page unload
window.addEventListener('beforeunload', cancelSpeech);

export function isSpeechActive(): boolean {
  return isSpeaking;
}

export function getCurrentUtterance(): SpeechSynthesisUtterance | null {
  return currentUtterance;
}