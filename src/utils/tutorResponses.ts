interface TutorResponse {
  pattern: RegExp;
  responses: string[];
}

export const tutorResponses: TutorResponse[] = [
  {
    pattern: /\b(math|algebra|geometry|calculus)\b/i,
    responses: [
      "Let's break down this math problem step by step. What specific part are you struggling with?",
      "Mathematics is all about understanding patterns. Let me help you identify the key concepts here.",
      "In mathematics, it's important to start with the fundamentals. Shall we review the basic principles first?"
    ]
  },
  {
    pattern: /\b(physics|force|motion|energy)\b/i,
    responses: [
      "Physics concepts are best understood through real-world examples. Let me explain this using a practical scenario.",
      "Let's analyze this physics problem using the scientific method. What are our known variables?",
      "Understanding physics principles requires both mathematical and conceptual knowledge. Let's tackle both aspects."
    ]
  },
  {
    pattern: /\b(chemistry|reaction|molecule|element)\b/i,
    responses: [
      "Chemical processes can be complex. Let's break this down into simpler components.",
      "Understanding molecular behavior is key here. Let me explain the underlying principles.",
      "Chemistry is about understanding reactions and transformations. Let's explore what's happening at the molecular level."
    ]
  },
  {
    pattern: /\b(help|stuck|don't understand|confused)\b/i,
    responses: [
      "Don't worry! Learning new concepts takes time. Let's approach this step by step.",
      "It's perfectly normal to feel stuck. Let's identify exactly what's confusing you.",
      "Sometimes a different perspective helps. Let me explain this in an alternative way."
    ]
  },
  {
    pattern: /\b(example|practice|exercise)\b/i,
    responses: [
      "Practice is essential for mastery. Let's work through some examples together.",
      "I'll provide you with a similar example to help reinforce this concept.",
      "Let's solve this step by step, and then I'll give you a practice problem to try on your own."
    ]
  }
];

export const getDefaultResponse = (): string => {
  const defaultResponses = [
    "I understand your question. Let's work through this together systematically.",
    "That's an interesting question. Let me help you understand this concept better.",
    "I'll guide you through this topic step by step. What's your current understanding?",
    "Learning works best when we break complex topics into smaller, manageable parts. Let's start with the basics."
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};