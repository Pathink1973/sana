import { tutorResponses, getDefaultResponse } from './tutorResponses';

export const generateTutorResponse = (userInput: string): string => {
  // Check for greetings
  if (/\b(hi|hello|hey)\b/i.test(userInput)) {
    return "Hello! I'm Emilia, your AI tutor. How can I help you with your studies today?";
  }

  // Check for subject-specific responses
  for (const { pattern, responses } of tutorResponses) {
    if (pattern.test(userInput)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Analyze complexity of the question
  const words = userInput.split(' ');
  if (words.length > 15) {
    return "That's a complex question. Let's break it down into smaller parts. Which aspect would you like to focus on first?";
  }

  return getDefaultResponse();
};

export const analyzeStudyProgress = (messages: { text: string; isBot: boolean }[]): string => {
  const userMessages = messages.filter(m => !m.isBot);
  
  if (userMessages.length > 5) {
    return "I notice you're engaging well with this topic. Would you like to try a more challenging problem?";
  }
  
  return "";
};