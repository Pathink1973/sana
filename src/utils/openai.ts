import OpenAI from 'openai';
import { neuralAnalyzer } from './neural/dementiaAnalysis';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
}

const openai = new OpenAI({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `Você é uma tutora virtual especializada em ajudar pessoas com Alzheimer, usando português de Portugal.

DIRETRIZES CRÍTICAS:
1. Use sempre português de Portugal (não brasileiro)
2. Mantenha respostas ÚNICAS e DIRETAS - nunca repita a pergunta
3. Limite respostas a 1-2 frases curtas
4. Use tom calmo e reconfortante
5. Use vocabulário simples e familiar
6. Evite corrigir o paciente diretamente
7. Mantenha consistência no tom de voz
8. Foque em orientação temporal e espacial
9. Priorize segurança e bem-estar
10. NUNCA repita informações ou faça perguntas redundantes

EXEMPLOS DE RESPOSTAS CORRETAS:
Paciente confuso: "Está tudo bem, vamos conversar com calma."
Paciente agitado: "Respire fundo comigo, encontraremos a solução juntos."
Paciente desorientado: "Estamos num lugar seguro, pode ficar tranquilo."

IMPORTANTE: Dê sempre UMA ÚNICA resposta clara e direta.`;

export async function getChatGPTResponse(userMessage: string, messageHistory: { text: string; isBot: boolean }[]) {
  if (!apiKey) {
    return 'O sistema não está configurado corretamente. Por favor, configure a chave da API OpenAI.';
  }

  try {
    // Analyze the interaction using the neural analyzer
    const analysis = await neuralAnalyzer.analyzeInteraction(userMessage);
    
    // Only include the last 2 messages for context to prevent repetition
    const recentMessages = messageHistory.slice(-2);
    
    // Add analysis context to the system prompt
    const contextualizedPrompt = `${SYSTEM_PROMPT}\n\nANÁLISE ATUAL:
- Estado Emocional: ${analysis.emotionalState.primary} (${Math.round(analysis.emotionalState.confidence * 100)}% confiança)
- Nível de Risco: ${analysis.riskLevel}
- Orientação Temporal: ${Math.round(analysis.temporalOrientation * 100)}%
- Coerência: ${Math.round(analysis.speechPatterns.coherence * 100)}%\n`;

    const messages = [
      { role: 'system', content: contextualizedPrompt },
      ...recentMessages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 50,
      presence_penalty: 1.0,
      frequency_penalty: 1.0,
      top_p: 0.9,
      stop: ['\n', '?']
    });

    return response.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui processar a sua mensagem.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return 'Peço desculpa, ocorreu um erro. Poderia repetir por favor?';
  }
}