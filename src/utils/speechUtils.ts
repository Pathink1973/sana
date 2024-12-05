export function setupSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('Reconhecimento de voz não suportado neste navegador.');
    return null;
  }

  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'pt-PT';

  return recognition;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string) {
  return new Promise((resolve, reject) => {
    // Cancel any ongoing speech
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    
    utterance.lang = 'pt-PT';
    
    // Get available voices
    let voices = window.speechSynthesis.getVoices();
    
    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        setVoice();
      };
    } else {
      setVoice();
    }

    function setVoice() {
      // Try to find the best Portuguese female voice
      const portugueseVoice = voices.find(voice => 
        voice.lang.includes('pt-PT') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => 
        voice.lang.includes('pt-PT')
      ) || voices.find(voice => 
        voice.lang.includes('pt')
      );
      
      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }
    }

    // Natural voice settings
    utterance.pitch = 1.05;    // Slightly higher for female voice
    utterance.rate = 0.95;     // Slightly slower for clarity
    utterance.volume = 1.0;    // Full volume

    // Add natural pauses at punctuation
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    if (sentences.length > 1) {
      utterance.text = sentences.join('. ');
    }

    utterance.onend = () => {
      currentUtterance = null;
      resolve(undefined);
    };
    
    utterance.onerror = (event) => {
      currentUtterance = null;
      reject(event);
    };
    
    window.speechSynthesis.speak(utterance);
  });
}

// Initialize voices as soon as they're available
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};