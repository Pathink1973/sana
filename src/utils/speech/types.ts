export interface SpeechConfig {
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
}

export interface VoiceOptions {
  preferredLang: string;
  preferredGender?: 'female' | 'male';
}

export interface SpeechError extends Error {
  type: 'synthesis' | 'recognition';
  originalError?: any;
}

export interface SpeechState {
  isSpeaking: boolean;
  isListening: boolean;
  error: string | null;
}