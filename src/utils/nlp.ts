import nlp from 'compromise';

const topics = {
  math: ['equation', 'algebra', 'geometry', 'calculus', 'mathematics', 'solve', 'calculate'],
  science: ['physics', 'chemistry', 'biology', 'experiment', 'reaction', 'force', 'molecule'],
  language: ['grammar', 'writing', 'essay', 'literature', 'analysis', 'reading', 'comprehension']
};

export const trainClassifier = () => {
  // No training needed for compromise-based implementation
};

const classifyTopic = (text: string): string => {
  const words = text.toLowerCase().split(' ');
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => words.includes(keyword))) {
      return topic;
    }
  }
  return 'general';
};

export const analyzeQuestion = (text: string) => {
  const doc = nlp(text);
  const words = text.split(' ');
  
  return {
    topics: classifyTopic(text),
    isQuestion: doc.questions().length > 0,
    complexity: words.length > 10 ? 'complex' : 'simple',
    keywords: words.filter(word => word.length > 3)
  };
};

export const extractContext = (messages: { text: string; isBot: boolean }[]) => {
  const userMessages = messages.filter(m => !m.isBot).map(m => m.text);
  const combinedText = userMessages.join(' ');
  const doc = nlp(combinedText);
  
  return {
    topics: doc.topics().json(),
    entities: doc.people().concat(doc.places()).json(),
    mainThemes: classifyTopic(combinedText)
  };
};