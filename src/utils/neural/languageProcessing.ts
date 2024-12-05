import natural from 'natural';
import { TokenizerPt } from 'natural/lib/natural/tokenizers/aggressive_tokenizer_pt';

interface LanguageMetrics {
  complexity: number;
  coherence: number;
  vocabulary: number;
  grammarAccuracy: number;
}

export class LanguageProcessor {
  private tokenizer: TokenizerPt;
  private wordNet: natural.WordNet;

  constructor() {
    this.tokenizer = new TokenizerPt();
    this.wordNet = new natural.WordNet();
  }

  public async analyzeLanguage(text: string): Promise<LanguageMetrics> {
    const tokens = this.tokenizer.tokenize(text);
    
    return {
      complexity: await this.assessComplexity(tokens),
      coherence: this.assessCoherence(text),
      vocabulary: this.assessVocabulary(tokens),
      grammarAccuracy: this.assessGrammar(text)
    };
  }

  private async assessComplexity(tokens: string[]): Promise<number> {
    const wordLengths = tokens.map(token => token.length);
    const averageLength = wordLengths.reduce((a, b) => a + b, 0) / tokens.length;
    
    return Math.min(averageLength / 10, 1);
  }

  private assessCoherence(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    if (sentences.length <= 1) return 1;

    let coherenceScore = 0;
    for (let i = 1; i < sentences.length; i++) {
      const prev = new Set(this.tokenizer.tokenize(sentences[i - 1]));
      const curr = new Set(this.tokenizer.tokenize(sentences[i]));
      
      const overlap = [...prev].filter(word => curr.has(word)).length;
      coherenceScore += overlap / Math.max(prev.size, curr.size);
    }

    return coherenceScore / (sentences.length - 1);
  }

  private assessVocabulary(tokens: string[]): number {
    const uniqueWords = new Set(tokens);
    return Math.min(uniqueWords.size / tokens.length * 2, 1);
  }

  private assessGrammar(text: string): number {
    const commonErrors = [
      'me dá', 'tinha que', 'pra mim fazer',
      'entre eu e', 'há anos atrás', 'mau feito'
    ];

    const errorCount = commonErrors.filter(error => 
      text.toLowerCase().includes(error)
    ).length;

    return Math.max(0, 1 - (errorCount * 0.2));
  }

  public generateLanguageReport(metrics: LanguageMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.complexity < 0.4) {
      recommendations.push('Estimular uso de frases mais elaboradas');
    }
    if (metrics.coherence < 0.4) {
      recommendations.push('Exercícios de construção narrativa');
    }
    if (metrics.vocabulary < 0.4) {
      recommendations.push('Atividades de expansão de vocabulário');
    }
    if (metrics.grammarAccuracy < 0.4) {
      recommendations.push('Praticar estruturas gramaticais básicas');
    }

    return recommendations;
  }
}

export const languageProcessor = new LanguageProcessor();