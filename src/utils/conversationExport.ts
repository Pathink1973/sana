import { Conversation } from '../types/conversation';

export function generateConversationText(conversation: Conversation): string {
  const header = `Relatório de Diálogo - Paciente: ${conversation.patientName}
Data: ${conversation.date}
----------------------------------------\n\n`;

  const messages = conversation.messages
    .map(msg => `[${msg.timestamp}] ${msg.isBot ? 'Assistente' : 'Paciente'}: ${msg.text}`)
    .join('\n\n');

  const analysis = conversation.cognitiveAnalysis
    ? `\n\nNotas de Análise Cognitiva:
----------------------------------------
1. Pontuação Cognitiva
   - Orientação Temporal: ${conversation.cognitiveAnalysis.timeOrientation}/10
   - Coerência do Discurso: ${conversation.cognitiveAnalysis.speechCoherence}/10
   - Consistência da Memória: ${conversation.cognitiveAnalysis.memoryConsistency}/10

2. Estado Emocional
   - Avaliação: ${conversation.cognitiveAnalysis.emotionalState}

3. Nível de Atividade
   - Avaliação: ${determineActivityLevel(conversation.cognitiveAnalysis.memoryConsistency)}

4. Preocupações Identificadas:
${conversation.cognitiveAnalysis.concerns.length > 0 
  ? conversation.cognitiveAnalysis.concerns.map(c => `   - ${c}`).join('\n')
  : '   - Nenhuma preocupação significativa identificada'}

5. Recomendações:
   - ${generateRecommendations(conversation.cognitiveAnalysis)}

6. Observações Adicionais:
   - Estado geral: ${generateOverallAssessment(conversation.cognitiveAnalysis)}
   - Próximos passos: ${suggestNextSteps(conversation.cognitiveAnalysis)}`
    : '';

  return header + messages + analysis;
}

function determineActivityLevel(memoryScore: number): string {
  if (memoryScore >= 8) return 'Alto - Boa participação e engajamento';
  if (memoryScore >= 5) return 'Normal - Participação adequada';
  return 'Baixo - Necessita maior estímulo';
}

function generateRecommendations(analysis: NonNullable<Conversation['cognitiveAnalysis']>): string {
  const recommendations = [];
  
  if (analysis.timeOrientation < 7) {
    recommendations.push('Reforçar exercícios de orientação temporal');
  }
  if (analysis.speechCoherence < 7) {
    recommendations.push('Estimular conversação estruturada');
  }
  if (analysis.memoryConsistency < 7) {
    recommendations.push('Aumentar atividades de memória');
  }
  
  return recommendations.length > 0 
    ? recommendations.join('; ') + '.'
    : 'Manter rotina atual de atividades.';
}

function generateOverallAssessment(analysis: NonNullable<Conversation['cognitiveAnalysis']>): string {
  const averageScore = (
    analysis.timeOrientation + 
    analysis.speechCoherence + 
    analysis.memoryConsistency
  ) / 3;

  if (averageScore >= 8) return 'Excelente progresso';
  if (averageScore >= 6) return 'Progresso satisfatório';
  if (averageScore >= 4) return 'Necessita atenção moderada';
  return 'Requer atenção especial';
}

function suggestNextSteps(analysis: NonNullable<Conversation['cognitiveAnalysis']>): string {
  const concerns = analysis.concerns.length;
  const averageScore = (
    analysis.timeOrientation + 
    analysis.speechCoherence + 
    analysis.memoryConsistency
  ) / 3;

  if (concerns > 2 || averageScore < 4) {
    return 'Agendar avaliação detalhada com equipe multidisciplinar';
  }
  if (concerns > 0 || averageScore < 6) {
    return 'Aumentar frequência de sessões de estimulação cognitiva';
  }
  return 'Manter programa atual com monitoramento regular';
}

export function downloadConversation(conversation: Conversation, type: 'dialog' | 'report') {
  const filename = `${type === 'dialog' ? 'dialogo' : 'relatorio'}_${
    conversation.patientName.toLowerCase().replace(/\s+/g, '_')
  }_${conversation.date.replace(/[/:]/g, '-')}.txt`;

  const content = generateConversationText(conversation);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}