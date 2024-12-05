export interface EmotionalState {
  primary: 'positive' | 'negative' | 'neutral' | 'confused';
  confidence: number;
  timestamp: string;
}

export interface CognitiveMetrics {
  timestamp: Date;
  cognitiveScore: number;
  temporalOrientation: number;
  spatialOrientation: number;
  shortTermMemory: number;
  longTermMemory: number;
}

export interface InteractionAnalysis {
  cognitive: CognitiveMetrics;
  emotional: EmotionalState;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}