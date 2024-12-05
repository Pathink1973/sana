import { analyzeSpeechPatterns } from './speechAnalysis';
import { analyzeEmotionalState } from './emotionalAnalysis';
import { type CognitiveMetrics, type EmotionalState } from '../../types/analysis';

export interface DementiaAnalysisResult {
  cognitiveScore: number;
  temporalOrientation: number;
  spatialOrientation: number;
  shortTermMemory: number;
  longTermMemory: number;
  emotionalState: EmotionalState;
  speechPatterns: {
    coherence: number;
    fluency: number;
    vocabulary: number;
    repetition: number;
  };
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

export class NeuralDementiaAnalyzer {
  private conversationHistory: string[] = [];
  private metrics: CognitiveMetrics[] = [];
  
  public async analyzeInteraction(text: string): Promise<DementiaAnalysisResult> {
    this.conversationHistory.push(text);
    
    const speechPatterns = await analyzeSpeechPatterns(text, this.conversationHistory);
    const emotionalState = await analyzeEmotionalState(text);
    
    const analysis = this.performCognitiveAnalysis(text, speechPatterns);
    
    this.metrics.push({
      timestamp: new Date(),
      ...analysis
    });

    return {
      ...analysis,
      emotionalState,
      recommendations: this.generateRecommendations(analysis),
      riskLevel: this.assessRiskLevel(analysis)
    };
  }

  private performCognitiveAnalysis(text: string, speechPatterns: any) {
    const cognitiveScore = this.calculateCognitiveScore(text, speechPatterns);
    
    return {
      cognitiveScore,
      temporalOrientation: this.assessTemporalOrientation(text),
      spatialOrientation: this.assessSpatialOrientation(text),
      shortTermMemory: this.assessShortTermMemory(),
      longTermMemory: this.assessLongTermMemory(),
      speechPatterns
    };
  }

  private calculateCognitiveScore(text: string, speechPatterns: any): number {
    const weights = {
      coherence: 0.3,
      fluency: 0.2,
      vocabulary: 0.2,
      repetition: 0.3
    };

    return Object.entries(weights).reduce((score, [key, weight]) => {
      return score + (speechPatterns[key] * weight);
    }, 0);
  }

  private assessTemporalOrientation(text: string): number {
    const temporalMarkers = [
      'hoje', 'ontem', 'amanhã', 'agora',
      'manhã', 'tarde', 'noite',
      'semana', 'mês', 'ano'
    ];

    const matches = temporalMarkers.filter(marker => 
      text.toLowerCase().includes(marker)
    ).length;

    return Math.min(matches / 3, 1);
  }

  private assessSpatialOrientation(text: string): number {
    const spatialMarkers = [
      'aqui', 'ali', 'lá', 'casa',
      'quarto', 'sala', 'cozinha',
      'hospital', 'rua', 'cidade'
    ];

    const matches = spatialMarkers.filter(marker => 
      text.toLowerCase().includes(marker)
    ).length;

    return Math.min(matches / 3, 1);
  }

  private assessShortTermMemory(): number {
    if (this.conversationHistory.length < 2) return 1;
    
    const recentResponses = this.conversationHistory.slice(-3);
    const repetitions = this.countRepetitions(recentResponses);
    
    return Math.max(0, 1 - (repetitions * 0.2));
  }

  private assessLongTermMemory(): number {
    if (this.conversationHistory.length < 5) return 1;
    
    const consistencyScore = this.analyzeResponseConsistency();
    return Math.max(0, consistencyScore);
  }

  private countRepetitions(responses: string[]): number {
    const phrases = responses.join(' ').toLowerCase().split(/[.!?]+/);
    const uniquePhrases = new Set(phrases);
    
    return 1 - (uniquePhrases.size / phrases.length);
  }

  private analyzeResponseConsistency(): number {
    if (this.metrics.length < 5) return 1;
    
    const recentMetrics = this.metrics.slice(-5);
    const variance = this.calculateVariance(recentMetrics.map(m => m.cognitiveScore));
    
    return Math.max(0, 1 - variance);
  }

  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b) / numbers.length;
    const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }

  private generateRecommendations(analysis: Partial<DementiaAnalysisResult>): string[] {
    const recommendations: string[] = [];

    if (analysis.temporalOrientation! < 0.6) {
      recommendations.push('Reforçar exercícios de orientação temporal');
    }

    if (analysis.spatialOrientation! < 0.6) {
      recommendations.push('Praticar reconhecimento espacial');
    }

    if (analysis.speechPatterns?.coherence < 0.6) {
      recommendations.push('Exercícios de construção de narrativas');
    }

    if (analysis.shortTermMemory! < 0.6) {
      recommendations.push('Atividades de memória recente');
    }

    return recommendations;
  }

  private assessRiskLevel(analysis: Partial<DementiaAnalysisResult>): 'low' | 'moderate' | 'high' {
    const scores = [
      analysis.cognitiveScore!,
      analysis.temporalOrientation!,
      analysis.spatialOrientation!,
      analysis.shortTermMemory!,
      analysis.longTermMemory!
    ];

    const averageScore = scores.reduce((a, b) => a + b) / scores.length;

    if (averageScore > 0.7) return 'low';
    if (averageScore > 0.4) return 'moderate';
    return 'high';
  }
}

export const neuralAnalyzer = new NeuralDementiaAnalyzer();