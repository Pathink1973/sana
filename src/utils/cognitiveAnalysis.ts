import { format } from 'date-fns';
import nlp from 'compromise';

interface CognitiveAnalysis {
  timeOrientation: number; // 0-1 score
  speechCoherence: number; // 0-1 score
  memoryConsistency: number; // 0-1 score
  emotionalState: string;
  alertLevel: 'normal' | 'attention' | 'urgent';
  concerns: string[];
}

export const analyzeCognition = (text: string, previousResponses: string[]): CognitiveAnalysis => {
  const doc = nlp(text);
  const concerns: string[] = [];
  
  // Analyze time orientation
  const timeOrientation = analyzeTimeOrientation(text);
  if (timeOrientation < 0.5) {
    concerns.push('Time disorientation detected');
  }

  // Analyze speech coherence
  const speechCoherence = analyzeSpeechCoherence(text);
  if (speechCoherence < 0.5) {
    concerns.push('Speech coherence issues detected');
  }

  // Analyze memory consistency
  const memoryConsistency = analyzeMemoryConsistency(text, previousResponses);
  if (memoryConsistency < 0.5) {
    concerns.push('Memory inconsistencies detected');
  }

  // Determine emotional state
  const emotionalState = analyzeEmotionalState(text);

  // Calculate alert level
  const alertLevel = determineAlertLevel(timeOrientation, speechCoherence, memoryConsistency);

  return {
    timeOrientation,
    speechCoherence,
    memoryConsistency,
    emotionalState,
    alertLevel,
    concerns
  };
};

const analyzeTimeOrientation = (text: string): number => {
  const doc = nlp(text);
  const currentDate = new Date();
  
  // Check for time-related words
  const hasTimeWords = doc.match('(today|yesterday|tomorrow|morning|afternoon|evening)').found;
  const mentionsCorrectDay = text.toLowerCase().includes(format(currentDate, 'EEEE').toLowerCase());
  
  let score = 1;
  if (!hasTimeWords) score -= 0.3;
  if (!mentionsCorrectDay && text.includes('day')) score -= 0.3;
  
  return Math.max(0, score);
};

const analyzeSpeechCoherence = (text: string): number => {
  const sentences = nlp(text).sentences().json();
  let score = 1;

  // Check for sentence structure
  if (sentences.length > 0) {
    const hasSubjectVerb = sentences.every((s: any) => 
      nlp(s.text).match('#Noun #Verb').found
    );
    if (!hasSubjectVerb) score -= 0.3;
  }

  // Check for repetition
  const words = text.toLowerCase().split(' ');
  const uniqueWords = new Set(words);
  if (words.length > 5 && uniqueWords.size / words.length < 0.5) {
    score -= 0.4;
  }

  return Math.max(0, score);
};

const analyzeMemoryConsistency = (text: string, previousResponses: string[]): number => {
  let score = 1;

  // Check for contradictions with previous statements
  const currentStatements = extractStatements(text);
  const previousStatements = previousResponses.flatMap(extractStatements);

  for (const current of currentStatements) {
    for (const previous of previousStatements) {
      if (areContradictory(current, previous)) {
        score -= 0.3;
      }
    }
  }

  return Math.max(0, score);
};

const extractStatements = (text: string): string[] => {
  const doc = nlp(text);
  return doc.sentences().json().map((s: any) => s.text);
};

const areContradictory = (statement1: string, statement2: string): boolean => {
  // Simple contradiction detection
  const doc1 = nlp(statement1);
  const doc2 = nlp(statement2);
  
  const hasOpposites = doc1.match('(did|have|am|was)').found &&
                      doc2.match('(did not|haven\'t|am not|wasn\'t)').found;
  
  return hasOpposites;
};

const analyzeEmotionalState = (text: string): string => {
  const doc = nlp(text);
  
  if (doc.match('(happy|good|great|wonderful|excited)').found) {
    return 'positive';
  } else if (doc.match('(sad|upset|angry|frustrated|confused)').found) {
    return 'negative';
  } else if (doc.match('(tired|exhausted|sleepy)').found) {
    return 'fatigued';
  }
  
  return 'neutral';
};

const determineAlertLevel = (
  timeOrientation: number,
  speechCoherence: number,
  memoryConsistency: number
): 'normal' | 'attention' | 'urgent' => {
  const averageScore = (timeOrientation + speechCoherence + memoryConsistency) / 3;
  
  if (averageScore < 0.3) return 'urgent';
  if (averageScore < 0.6) return 'attention';
  return 'normal';
};