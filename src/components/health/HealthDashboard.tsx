import React, { useState, useEffect } from 'react';
import { Pill, ListChecks, FileText, Bell, Trash2 } from 'lucide-react';
import MedicationList from './MedicationList';
import ActivityList from './ActivityList';
import AddMedicationForm from './AddMedicationForm';
import AddActivityForm from './AddActivityForm';
import { medicationManager } from '../../utils/health/medicationManager';
import { routineManager } from '../../utils/health/routineManager';
import { generateHealthReport } from '../../utils/health/healthReport';
import { Medication, DailyActivity } from '../../types/health';

export default function HealthDashboard() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    updateMedications();
    updateActivities();

    // Check for upcoming medications every minute
    const interval = setInterval(() => {
      const upcoming = medicationManager.getUpcomingMedications();
      if (upcoming.length > 0) {
        setNotificationMessage(`Hora de tomar: ${upcoming.map(m => m.name).join(', ')}`);
        setShowNotification(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const updateMedications = () => {
    setMedications(medicationManager.getMedicationSchedule());
  };

  const updateActivities = () => {
    setActivities([
      ...routineManager.getPendingActivities(),
      ...routineManager.getCompletedActivities()
    ]);
  };

  const handleMedicationTaken = (id: string) => {
    medicationManager.markMedicationTaken(id);
    updateMedications();
    setShowNotification(false);
  };

  const handleActivityComplete = (id: string) => {
    routineManager.markCompleted(id);
    updateActivities();
  };

  const downloadHealthReport = () => {
    const report = generateHealthReport();
    const blob = new Blob([report.notes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_saude_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearMedications = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as medicações? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('medications');
      setMedications([]);
    }
  };

  const clearActivities = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as atividades? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('dailyActivities');
      setActivities([]);
    }
  };

  return (
    <div className="space-y-8">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-700">{notificationMessage}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão de Saúde</h2>
        <button
          onClick={downloadHealthReport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>Gerar Relatório</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
              <Pill className="w-6 h-6 text-blue-500" />
              <h3>Medicações</h3>
            </div>
            {medications.length > 0 && (
              <button
                onClick={clearMedications}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Apagar Tudo</span>
              </button>
            )}
          </div>
          <AddMedicationForm onAdd={updateMedications} />
          <MedicationList
            medications={medications}
            onMedicationTaken={handleMedicationTaken}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
              <ListChecks className="w-6 h-6 text-green-500" />
              <h3>Atividades Diárias</h3>
            </div>
            {activities.length > 0 && (
              <button
                onClick={clearActivities}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Apagar Tudo</span>
              </button>
            )}
          </div>
          <AddActivityForm onAdd={updateActivities} />
          <ActivityList
            activities={activities}
            onActivityComplete={handleActivityComplete}
          />
        </div>
      </div>
    </div>
  );
}