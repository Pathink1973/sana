interface Exercise {
  type: 'orientation' | 'recall' | 'association';
  question: string;
  context?: any;
  difficulty: 1 | 2 | 3;
}

export class MemoryExerciseGenerator {
  private currentDate: Date;
  
  constructor() {
    this.currentDate = new Date();
  }

  public generateExercise(type?: 'orientation' | 'recall' | 'association'): Exercise {
    const exerciseType = type || this.getRandomType();
    
    switch (exerciseType) {
      case 'orientation':
        return this.generateOrientationExercise();
      case 'recall':
        return this.generateRecallExercise();
      case 'association':
        return this.generateAssociationExercise();
      default:
        return this.generateOrientationExercise();
    }
  }

  private getRandomType(): 'orientation' | 'recall' | 'association' {
    const types = ['orientation', 'recall', 'association'];
    return types[Math.floor(Math.random() * types.length)] as 'orientation' | 'recall' | 'association';
  }

  private generateOrientationExercise(): Exercise {
    const questions = [
      {
        question: "Can you tell me what day of the week it is today?",
        difficulty: 1
      },
      {
        question: "What season are we in right now?",
        difficulty: 1
      },
      {
        question: "Can you tell me the current month and year?",
        difficulty: 2
      }
    ];

    const selected = questions[Math.floor(Math.random() * questions.length)];
    
    return {
      type: 'orientation',
      question: selected.question,
      context: {
        currentDate: this.currentDate
      },
      difficulty: selected.difficulty as 1 | 2 | 3
    };
  }

  private generateRecallExercise(): Exercise {
    const exercises = [
      {
        question: "What did you have for breakfast today?",
        difficulty: 1
      },
      {
        question: "Can you name three activities you did yesterday?",
        difficulty: 2
      },
      {
        question: "What was the weather like this morning?",
        difficulty: 1
      }
    ];

    const selected = exercises[Math.floor(Math.random() * exercises.length)];
    
    return {
      type: 'recall',
      question: selected.question,
      difficulty: selected.difficulty as 1 | 2 | 3
    };
  }

  private generateAssociationExercise(): Exercise {
    const exercises = [
      {
        question: "Can you name three items you would find in a kitchen?",
        difficulty: 1
      },
      {
        question: "What objects do you associate with going to the beach?",
        difficulty: 2
      },
      {
        question: "Can you tell me which items you need to make a cup of tea?",
        difficulty: 2
      }
    ];

    const selected = exercises[Math.floor(Math.random() * exercises.length)];
    
    return {
      type: 'association',
      question: selected.question,
      difficulty: selected.difficulty as 1 | 2 | 3
    };
  }
}

export const exerciseGenerator = new MemoryExerciseGenerator();