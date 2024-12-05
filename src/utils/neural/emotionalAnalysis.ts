import { type EmotionalState } from '../../types/analysis';

const emotionalIndicators = {
  positive: [
    'feliz', 'contente', 'alegre', 'bem', 'ótimo',
    'maravilhoso', 'excelente', 'tranquilo'
  ],
  negative: [
    'triste', 'chateado', 'preocupado', 'ansioso',
    'nervoso', 'confuso', 'irritado', 'mal'
  ],
  neutral: [
    'normal', 'regular', 'mais ou menos', 'assim',
    'comum', 'habitual', 'costume'
  ],
  confused: [
    'não sei', 'talvez', 'confuso', 'perdido',
    'esqueci', 'não lembro', 'difícil'
  ]
};

export async function analyzeEmotionalState(text: string): Promise<EmotionalState> {
  const normalizedText = text.toLowerCase();
  
  const emotionalScores = Object.entries(emotionalIndicators).reduce(
    (scores, [emotion, indicators]) => {
      const matchCount = indicators.filter(indicator => 
        normalizedText.includes(indicator)
      ).length;
      
      return {
        ...scores,
        [emotion]: matchCount
      };
    },
    {} as Record<string, number>
  );

  const dominantEmotion = Object.entries(emotionalScores).reduce(
    (max, [emotion, score]) => 
      score > max.score ? { emotion, score } : max,
    { emotion: 'neutral', score: 0 }
  );

  return {
    primary: dominantEmotion.emotion as keyof typeof emotionalIndicators,
    confidence: Math.min(dominantEmotion.score / 2, 1),
    timestamp: new Date().toISOString()
  };
}