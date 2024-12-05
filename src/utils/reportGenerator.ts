import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { NeurologicalAssessment, TreatmentPlan } from '../types/medical';
import type { Message } from '../types/conversation';
import type { LabResult, Appointment } from '../types/patient';
import type { DailyActivity, Medication } from '../types/health';

interface CognitiveNote {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
}

export function generateCompleteReport(data: {
  patientName: string;
  messages: Message[];
  assessments: NeurologicalAssessment[];
  treatmentPlans: TreatmentPlan[];
  labResults: LabResult[];
  appointments: Appointment[];
  medications: Medication[];
  activities: DailyActivity[];
  cognitiveNotes: CognitiveNote[];
}): string {
  const { 
    patientName,
    messages,
    assessments,
    treatmentPlans,
    labResults,
    appointments,
    medications,
    activities,
    cognitiveNotes
  } = data;

  const currentDate = new Date();
  
  const report = `
RELATÓRIO COMPLETO DE AVALIAÇÃO - ALZHEIMER
==========================================
Paciente: ${patientName}
Data do Relatório: ${format(currentDate, "PPP 'às' HH:mm", { locale: ptBR })}
==========================================

1. DIÁLOGO COM ASSISTENTE
------------------------
${messages.map(msg => 
  `[${msg.timestamp}] ${msg.isBot ? 'Assistente' : 'Paciente'}: ${msg.text}`
).join('\n')}

2. AVALIAÇÕES NEUROLÓGICAS
-------------------------
${assessments.map(assessment => `
Data: ${format(new Date(assessment.date), 'PPP', { locale: ptBR })}

Consciência:
- Nível: ${assessment.consciousness.level}
- Glasgow: ${assessment.consciousness.glasgowScore}/15
- Resposta Pupilar: ${assessment.consciousness.pupilResponse}

Status Cognitivo:
- Orientação: ${assessment.cognitiveStatus.orientation}/10
- Memória: ${assessment.cognitiveStatus.memory}/10
- Atenção: ${assessment.cognitiveStatus.attention}/10
- Linguagem: ${assessment.cognitiveStatus.language}/10
- Função Executiva: ${assessment.cognitiveStatus.executiveFunction}/10

Função Motora:
- Força: ${assessment.motorFunction.strength}/5
- Coordenação: ${assessment.motorFunction.coordination}
- Marcha: ${assessment.motorFunction.gait}

Sinais Vitais:
- Pressão Arterial: ${assessment.vitalSigns.bloodPressure}
- Freq. Cardíaca: ${assessment.vitalSigns.heartRate} bpm
- Temperatura: ${assessment.vitalSigns.temperature}°C
- Freq. Respiratória: ${assessment.vitalSigns.respiratoryRate}
- Saturação O₂: ${assessment.vitalSigns.oxygenSaturation}%

${assessment.recommendations.length > 0 ? `Recomendações:\n${assessment.recommendations.map(rec => `- ${rec}`).join('\n')}` : ''}
`).join('\n---\n')}

3. PLANOS DE TRATAMENTO
----------------------
${treatmentPlans.map(plan => `
Data Início: ${format(new Date(plan.startDate), 'PPP', { locale: ptBR })}
Diagnóstico: ${plan.diagnosis}
Médico: ${plan.primaryPhysician}

Medicações:
${plan.medications.map(med => 
  `- ${med.name} (${med.dosage})
   Frequência: ${med.frequency}
   Via: ${med.route}
   Duração: ${med.duration}`
).join('\n')}

${plan.therapies.length > 0 ? `\nTerapias:\n${plan.therapies.map(therapy => 
  `- ${therapy.type}: ${therapy.frequency} (${therapy.duration})
   Objetivos: ${therapy.goals.join(', ')}`
).join('\n')}` : ''}

${plan.emergencyProtocol ? `\nProtocolo de Emergência:\n${plan.emergencyProtocol}` : ''}
`).join('\n---\n')}

4. EXAMES
---------
${labResults.map(result => `
Tipo: ${result.type}
Data: ${format(new Date(result.date), 'PPP', { locale: ptBR })}
Médico: ${result.doctor}
Resultado: ${result.result || 'Não informado'}
${result.attachmentUrl ? `Anexo: ${result.attachmentUrl}` : ''}
`).join('\n---\n')}

5. CONSULTAS
-----------
${appointments.map(apt => `
Tipo: ${apt.type}
Data: ${format(new Date(apt.date), 'PPP', { locale: ptBR })} às ${apt.time}
Médico: ${apt.doctor}
Sala: ${apt.room}
Status: ${apt.status === 'scheduled' ? 'Agendada' : apt.status === 'completed' ? 'Realizada' : 'Cancelada'}
${apt.notes ? `Observações: ${apt.notes}` : ''}
`).join('\n---\n')}

6. MEDICAÇÕES ATUAIS
------------------
${medications.map(med => `
Nome: ${med.name}
Dosagem: ${med.dosage}
Frequência: ${med.frequency}
Horários: ${med.timeOfDay.join(', ')}
Instruções: ${med.instructions}
${med.lastTaken ? `Última dose: ${format(new Date(med.lastTaken), "PPP 'às' HH:mm", { locale: ptBR })}` : ''}
${med.nextDue ? `Próxima dose: ${format(new Date(med.nextDue), "PPP 'às' HH:mm", { locale: ptBR })}` : ''}
`).join('\n---\n')}

7. ATIVIDADES DIÁRIAS
-------------------
${activities.map(activity => `
Atividade: ${activity.name}
Tipo: ${activity.type}
Importância: ${activity.importance}
Status: ${activity.completed ? 'Concluída' : 'Pendente'}
${activity.timeCompleted ? `Concluída em: ${format(new Date(activity.timeCompleted), "PPP 'às' HH:mm", { locale: ptBR })}` : ''}
${activity.notes ? `Observações: ${activity.notes}` : ''}
`).join('\n---\n')}

8. NOTAS DE ANÁLISE COGNITIVA
---------------------------
${cognitiveNotes.map(note => `
Data: ${note.timestamp}
${note.tags.length > 0 ? `Tags: ${note.tags.join(', ')}` : ''}
Conteúdo: ${note.content}
`).join('\n---\n')}

==========================================
Relatório gerado automaticamente pelo Sistema de Avaliação Neurológica do Alzheimer
`;

  return report;
}

export function downloadCompleteReport(reportData: Parameters<typeof generateCompleteReport>[0]) {
  // Save messages to localStorage for future reference
  localStorage.setItem('messages', JSON.stringify(reportData.messages));

  const report = generateCompleteReport(reportData);
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio_${reportData.patientName.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}