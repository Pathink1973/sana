import { type InteractionAnalysis } from '../../types/analysis';

interface BehavioralPattern {
  repetitiveActions: number;
  agitation: number;
  confusion: number;
  socialWithdrawal: number;
}

export class BehavioralAnalyzer {
  private patterns: BehavioralPattern[] = [];
  private readonly confusionIndicators = [
    'não sei', 'não lembro', 'confuso',
    'perdido', 'onde estou', 'que dia é'
  ];

  private readonly agitationIndicators = [
    'nervoso', 'ansioso', 'inquieto',
    'não consigo', 'difícil', 'irritado'
  ];

  public analyzeBehavior(text: string): BehavioralPattern {
    const normalizedText = text.toLowerCase();
    
    return {
      repetitiveActions: this.detectRepetitiveActions(normalizedText),
      agitation: this.detectAgitation(normalizedText),
      confusion: this.detectConfusion(normalizedText),
      socialWithdrawal: this.assessSocialWithdrawal(normalizedText)
    };
  }

  private detectRepetitiveActions(text: string): number {
    const phrases = text.split(/[.!?]+/);
    const uniquePhrases = new Set(phrases);
    return 1 - (uniquePhrases.size / phrases.length);
  }

  private detectAgitation(text: string): number {
    const matches = this.agitationIndicators.filter(indicator =>
      text.includes(indicator)
    ).length;
    return Math.min(matches / 3, 1);
  }

  private detectConfusion(text: string): number {
    const matches = this.confusionIndicators.filter(indicator =>
      text.includes(indicator)
    ).length;
    return Math.min(matches / 3, 1);
  }

  private assessSocialWithdrawal(text: string): number {
    const socialWords = ['nós', 'juntos', 'conversar', 'amigos', 'família'];
    const matches = socialWords.filter(word => text.includes(word)).length;
    return 1 - Math.min(matches / 3, 1);
  }

  public updateAnalysis(analysis: InteractionAnalysis, behavior: BehavioralPattern): InteractionAnalysis {
    const riskScore = (
      behavior.confusion * 0.4 +
      behavior.agitation * 0.3 +
      behavior.repetitiveActions * 0.2 +
      behavior.socialWithdrawal * 0.1
    );

    return {
      ...analysis,
      riskLevel: this.determineRiskLevel(riskScore),
      recommendations: [
        ...analysis.recommendations,
        ...this.generateBehavioralRecommendations(behavior)
      ]
    };
  }

  private determineRiskLevel(score: number): 'low' | 'moderate' | 'high' {
    if (score < 0.3) return 'low';
    if (score < 0.6) return 'moderate';
    return 'high';
  }

  private generateBehavioralRecommendations(behavior: BehavioralPattern): string[] {
    const recommendations: string[] = [];

    if (behavior.confusion > 0.5) {
      recommendations.push('Implementar rotinas diárias estruturadas');
    }
    if (behavior.agitation > 0.5) {
      recommendations.push('Praticar exercícios de relaxamento');
    }
    if (behavior.repetitiveActions > 0.5) {
      recommendations.push('Diversificar atividades diárias');
    }
    if (behavior.socialWithdrawal > 0.5) {
      recommendations.push('Aumentar interação social supervisionada');
    }

    return recommendations;
  }
}

export const behavioralAnalyzer = new BehavioralAnalyzer();