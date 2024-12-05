import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Brain, Activity, ThermometerSnowflake, Trash2 } from 'lucide-react';
import type { NeurologicalAssessment } from '../../../types/medical';

interface AssessmentHistoryProps {
  assessments: NeurologicalAssessment[];
  onSelect: (assessment: NeurologicalAssessment) => void;
}

export default function AssessmentHistory({ assessments, onSelect }: AssessmentHistoryProps) {
  const clearHistory = () => {
    if (window.confirm('Tem certeza que deseja apagar todo o histórico? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('neurologicalAssessments');
      window.location.reload(); // Refresh to update the UI
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Histórico de Avaliações</h3>
        {assessments.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Apagar Histórico</span>
          </button>
        )}
      </div>

      {assessments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          Nenhuma avaliação registrada
        </p>
      ) : (
        assessments.map((assessment) => (
          <div
            key={assessment.id}
            onClick={() => onSelect(assessment)}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">
                  Avaliação #{assessment.id.slice(-4)}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(assessment.date), "PPP 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Cognição</p>
                  <p className="text-sm font-medium">
                    {assessment.cognitiveStatus.orientation}/10
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Consciência</p>
                  <p className="text-sm font-medium capitalize">
                    {assessment.consciousness.level}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Função Motora</p>
                  <p className="text-sm font-medium">
                    {assessment.motorFunction.strength}/5
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-xs text-gray-500">Pressão Arterial</p>
                  <p className="text-sm font-medium">
                    {assessment.vitalSigns.bloodPressure}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}