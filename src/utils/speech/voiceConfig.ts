interface VoiceConfig {
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
}

export const defaultVoiceConfig: VoiceConfig = {
  lang: 'pt-PT',
  pitch: 1.0,  // Neutral pitch
  rate: 0.95,  // Slightly slower for clarity
  volume: 1.0
};

export function findPortugueseFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  // Try to find a Portuguese female voice
  const portugueseFemaleVoice = voices.find(voice => 
    voice.lang.includes('pt-PT') && 
    (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('joana'))
  );

  if (portugueseFemaleVoice) {
    return portugueseFemaleVoice;
  }

  // Fallback to any Portuguese voice
  const portugueseVoice = voices.find(voice => voice.lang.includes('pt-PT'));
  if (portugueseVoice) {
    return portugueseVoice;
  }

  // Final fallback to any Portuguese variant
  return voices.find(voice => voice.lang.includes('pt'));
}