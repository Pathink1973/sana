import { HealthReport, Medication, DailyActivity } from '../../types/health';
import { medicationManager } from './medicationManager';
import { routineManager } from './routineManager';

export function generateHealthReport(): HealthReport {
  const medications = medicationManager.getMedicationSchedule();
  const activities = [
    ...routineManager.getCompletedActivities(),
    ...routineManager.getPendingActivities()
  ];

  const report: HealthReport = {
    medications,
    activities,
    date: new Date().toISOString(),
    notes: generateReportNotes(medications, activities)
  };

  return report;
}

function generateReportNotes(medications: Medication[], activities: DailyActivity[]): string {
  const missedMeds = medications.filter(med => {
    if (!med.nextDue) return false;
    return new Date(med.nextDue) < new Date();
  });

  const completedActivities = activities.filter(a => a.completed);
  const completionRate = activities.length > 0
    ? (completedActivities.length / activities.length) * 100
    : 0;

  return `Relatório Diário de Saúde\n
Medicações:
- Total prescrito: ${medications.length}
- Medicações atrasadas: ${missedMeds.length}
${missedMeds.length > 0 ? `- Atenção para: ${missedMeds.map(m => m.name).join(', ')}` : ''}

Atividades:
- Total planejado: ${activities.length}
- Completadas: ${completedActivities.length} (${completionRate.toFixed(1)}%)
- Tipos mais frequentes: ${getTopActivityTypes(activities)}

${generateRecommendations(medications, activities)}`;
}

function getTopActivityTypes(activities: DailyActivity[]): string {
  const types = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(types)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type)
    .join(', ');
}

function generateRecommendations(medications: Medication[], activities: DailyActivity[]): string {
  const recommendations: string[] = [];

  const missedMeds = medications.filter(med => {
    if (!med.nextDue) return false;
    return new Date(med.nextDue) < new Date();
  });

  if (missedMeds.length > 0) {
    recommendations.push('⚠️ Importante regularizar horários das medicações');
  }

  const completionRate = activities.length > 0
    ? (activities.filter(a => a.completed).length / activities.length)
    : 0;

  if (completionRate < 0.7) {
    recommendations.push('📋 Considerar simplificar a rotina diária');
  }

  const cognitiveActivities = activities.filter(a => a.type === 'cognitive');
  if (cognitiveActivities.length < 2) {
    recommendations.push('🧠 Aumentar atividades de estimulação cognitiva');
  }

  return recommendations.length > 0
    ? `\nRecomendações:\n${recommendations.join('\n')}`
    : '';
}