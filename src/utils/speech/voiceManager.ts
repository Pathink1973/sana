import { VoiceOptions } from './types';

class VoiceManager {
  private voices: SpeechSynthesisVoice[] = [];
  private initialized = false;

  constructor() {
    this.initVoices();
  }

  private async initVoices(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.voices = voices;
        this.initialized = true;
        resolve();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          this.voices = window.speechSynthesis.getVoices();
          this.initialized = true;
          resolve();
        };
      }
    });
  }

  public async getVoice(options: VoiceOptions): Promise<SpeechSynthesisVoice | undefined> {
    await this.initVoices();

    // Try to find voice matching all criteria
    let voice = this.voices.find(v => 
      v.lang.includes(options.preferredLang) && 
      (options.preferredGender ? 
        v.name.toLowerCase().includes(options.preferredGender) : true)
    );

    // Fallback to language match only
    if (!voice) {
      voice = this.voices.find(v => v.lang.includes(options.preferredLang));
    }

    // Final fallback to any matching language family
    if (!voice) {
      const langPrefix = options.preferredLang.split('-')[0];
      voice = this.voices.find(v => v.lang.startsWith(langPrefix));
    }

    return voice;
  }
}

export const voiceManager = new VoiceManager();