import nlp from 'compromise';

interface SpeechPatternMetrics {
  coherence: number;
  fluency: number;
  vocabulary: number;
  repetition: number;
}

export async function analyzeSpeechPatterns(
  text: string,
  history: string[]
): Promise<SpeechPatternMetrics> {
  const doc = nlp(text);
  
  return {
    coherence: analyzeSentenceCoherence(doc),
    fluency: analyzeSpeechFluency(text),
    vocabulary: analyzeVocabularyRichness(text),
    repetition: analyzeWordRepetition(text, history)
  };
}

function analyzeSentenceCoherence(doc: any): number {
  const sentences = doc.sentences().json();
  
  if (sentences.length === 0) return 0;
  
  const hasValidStructure = sentences.filter((s: any) => 
    nlp(s.text).match('#Noun #Verb').found
  ).length;

  return hasValidStructure / sentences.length;
}

function analyzeSpeechFluency(text: string): number {
  const words = text.split(/\s+/);
  const hesitationMarkers = ['uh', 'um', 'eh', 'ah', '...'];
  
  const hesitations = words.filter(word => 
    hesitationMarkers.includes(word.toLowerCase())
  ).length;

  return Math.max(0, 1 - (hesitations / words.length));
}

function analyzeVocabularyRichness(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  
  if (words.length === 0) return 0;
  
  const ratio = uniqueWords.size / words.length;
  return Math.min(ratio * 2, 1); // Scale up but cap at 1
}

function analyzeWordRepetition(text: string, history: string[]): number {
  const recentHistory = history.slice(-3).join(' ').toLowerCase();
  const currentWords = text.toLowerCase().split(/\s+/);
  
  const repeatedWords = currentWords.filter(word => 
    recentHistory.includes(word) && word.length > 3
  ).length;

  return Math.max(0, 1 - (repeatedWords / currentWords.length));
}