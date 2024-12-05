import { analyzeCognition } from './cognitiveAnalysis';
import { notificationSystem } from './caregiverNotifications';
import { exerciseGenerator, MemoryExerciseGenerator } from './memoryExercises';

interface ConversationContext {
  recentExercises: string[];
  cognitiveScores: {
    timeOrientation: number[];
    speechCoherence: number[];
    memoryConsistency: number[];
  };
  lastInteractionTime: Date;
  emotionalStates: string[];
}

class AlzheimerTutorBrain {
  private context: ConversationContext;
  private exerciseGen: MemoryExerciseGenerator;

  constructor() {
    this.context = {
      recentExercises: [],
      cognitiveScores: {
        timeOrientation: [],
        speechCoherence: [],
        memoryConsistency: []
      },
      lastInteractionTime: new Date(),
      emotionalStates: []
    };
    this.exerciseGen = new MemoryExerciseGenerator();
  }

  public processInteraction(input: string, messageHistory: { text: string; isBot: boolean }[]): string {
    const analysis = analyzeCognition(input, messageHistory.filter(m => !m.isBot).map(m => m.text));
    this.updateContext(analysis);
    
    if (analysis.alertLevel !== 'normal') {
      notificationSystem.addAlert(
        analysis.alertLevel,
        `Alerta cognitivo: ${analysis.concerns.join(', ')}`,
        {
          timeOrientation: analysis.timeOrientation,
          speechCoherence: analysis.speechCoherence,
          memoryConsistency: analysis.memoryConsistency,
          emotionalState: analysis.emotionalState
        }
      );
    }

    return this.generateResponse(analysis, input);
  }

  private updateContext(analysis: any) {
    this.context.cognitiveScores.timeOrientation.push(analysis.timeOrientation);
    this.context.cognitiveScores.speechCoherence.push(analysis.speechCoherence);
    this.context.cognitiveScores.memoryConsistency.push(analysis.memoryConsistency);
    this.context.emotionalStates.push(analysis.emotionalState);
    this.context.lastInteractionTime = new Date();
  }

  private generateResponse(analysis: any, input: string): string {
    if (analysis.alertLevel === 'urgent') {
      return this.generateSupportiveResponse(analysis);
    }

    if (this.shouldProvideExercise()) {
      const exercise = this.exerciseGen.generateExercise();
      this.context.recentExercises.push(exercise.question);
      return this.formatExerciseResponse(exercise);
    }

    if (analysis.emotionalState === 'negative') {
      return this.generateEmotionalSupportResponse();
    }

    return this.generateConversationalResponse(input, analysis);
  }

  private shouldProvideExercise(): boolean {
    return this.context.recentExercises.length < 3 && Math.random() > 0.5;
  }

  private formatExerciseResponse(exercise: any): string {
    return `Vamos fazer um exercício juntos. ${exercise.question} Não tenha pressa, tome seu tempo.`;
  }

  private generateSupportiveResponse(analysis: any): string {
    const responses = [
      "Percebo que você pode estar um pouco confuso. Está tudo bem. Vamos com calma.",
      "Não se preocupe se as coisas parecerem confusas. Podemos conversar sobre o que você preferir.",
      "Você está indo muito bem. Gostaria de falar sobre algo que lhe seja familiar?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateEmotionalSupportResponse(): string {
    const responses = [
      "Entendo que você está se sentindo frustrado. Isso é natural. Vamos focar em algo positivo.",
      "É normal ter momentos difíceis. Quer falar sobre algo que te deixa feliz?",
      "Seus sentimentos são válidos. Vamos fazer uma pausa e pensar em algo agradável."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateConversationalResponse(input: string, analysis: any): string {
    if (input.toLowerCase().includes('olá') || input.toLowerCase().includes('oi')) {
      return "Olá! Sou seu companheiro amigável. Como está se sentindo hoje?";
    }

    const responses = [
      "Que interessante! Gostaria de me contar mais sobre isso?",
      "Gosto das nossas conversas. O que mais você gostaria de compartilhar?",
      "Obrigado por compartilhar isso comigo. Como isso faz você se sentir?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const tutorBrain = new AlzheimerTutorBrain();