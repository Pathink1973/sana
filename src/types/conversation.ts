export interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

export interface Conversation {
  id: string;
  patientName: string;
  date: string;
  messages: Message[];
  cognitiveAnalysis?: {
    timeOrientation: number;
    speechCoherence: number;
    memoryConsistency: number;
    emotionalState: string;
    concerns: string[];
  };
}