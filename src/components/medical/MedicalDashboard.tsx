import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Brain, Activity, FileText, TestTube2, Calendar } from 'lucide-react';
import AssessmentDashboard from './assessment/AssessmentDashboard';
import TreatmentPlanForm from './TreatmentPlanForm';
import AppointmentScheduler from './appointments/AppointmentScheduler';
import LabResults from './lab/LabResults';
import { downloadCompleteReport } from '../../utils/reportGenerator';
import type { NeurologicalAssessment, TreatmentPlan } from '../../types/medical';

interface MedicalDashboardProps {
  assessments: NeurologicalAssessment[];
  onAssessmentSubmit: (assessment: Omit<NeurologicalAssessment, 'id' | 'date'>) => void;
}

export default function MedicalDashboard({ assessments, onAssessmentSubmit }: MedicalDashboardProps) {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const savedPlans = localStorage.getItem('treatmentPlans');
    if (savedPlans) {
      setTreatmentPlans(JSON.parse(savedPlans));
    }
    
    const savedName = localStorage.getItem('patientName');
    if (savedName) {
      setPatientName(savedName);
    }
  }, []);

  const handleGenerateReport = () => {
    // Get all required data from localStorage
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const labResults = JSON.parse(localStorage.getItem('labResults') || '[]');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');
    const activities = JSON.parse(localStorage.getItem('dailyActivities') || '[]');
    const cognitiveNotes = JSON.parse(localStorage.getItem('tutorNotes') || '[]');

    if (!patientName) {
      const name = window.prompt('Por favor, insira o nome do paciente:');
      if (!name) return;
      setPatientName(name);
      localStorage.setItem('patientName', name);
    }

    downloadCompleteReport({
      patientName: patientName,
      messages,
      assessments,
      treatmentPlans,
      labResults,
      appointments,
      medications,
      activities,
      cognitiveNotes
    });
  };

  const handleTreatmentPlanSubmit = (plan: Omit<TreatmentPlan, 'id'>) => {
    const newPlan: TreatmentPlan = {
      ...plan,
      id: Date.now().toString(),
      startDate: new Date(),
    };

    const updatedPlans = [newPlan, ...treatmentPlans];
    setTreatmentPlans(updatedPlans);
    localStorage.setItem('treatmentPlans', JSON.stringify(updatedPlans));
  };

  const deleteTreatmentPlan = (id: string) => {
    const updatedPlans = treatmentPlans.filter(plan => plan.id !== id);
    setTreatmentPlans(updatedPlans);
    localStorage.setItem('treatmentPlans', JSON.stringify(updatedPlans));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão Médica</h2>
        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>Gerar Relatório Completo</span>
        </button>
      </div>

      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="assessment"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Avaliação Neurológica</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="treatment"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Plano de Tratamento</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="exams"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <TestTube2 className="w-4 h-4" />
              <span>Exames</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="appointments"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Consultas</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <AssessmentDashboard
            assessments={assessments}
            onAssessmentSubmit={onAssessmentSubmit}
          />
        </TabsContent>

        <TabsContent value="treatment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TreatmentPlanForm onSubmit={handleTreatmentPlanSubmit} />
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Planos de Tratamento Ativos</h3>
              {treatmentPlans.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum plano de tratamento registrado</p>
              ) : (
                <div className="space-y-4">
                  {treatmentPlans.map((plan) => (
                    <div key={plan.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{plan.diagnosis}</h4>
                          <p className="text-sm text-gray-600">Dr. {plan.primaryPhysician}</p>
                          <p className="text-sm text-gray-500">
                            Início: {new Date(plan.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteTreatmentPlan(plan.id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Excluir
                        </button>
                      </div>

                      {plan.medications && plan.medications.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Medicações:</h5>
                          <div className="bg-gray-50 rounded-lg p-3">
                            {plan.medications.map((med, idx) => (
                              <div key={idx} className="text-sm text-gray-600 py-1">
                                <span className="font-medium">{med.name}</span>
                                {med.dosage && ` - ${med.dosage}`}
                                {med.frequency && ` - ${med.frequency}`}
                                {med.route && ` - Via: ${med.route}`}
                                {med.duration && ` - Duração: ${med.duration}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.emergencyProtocol && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">
                            Protocolo de Emergência:
                          </h5>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {plan.emergencyProtocol}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exams">
          <LabResults />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
}