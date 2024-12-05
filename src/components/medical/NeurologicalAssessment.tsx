import React, { useState } from 'react';
import { Brain, FileText } from 'lucide-react';
import type { NeurologicalAssessment } from '../../types/medical';
import ConsciousnessSection from './assessment/ConsciousnessSection';
import VitalSignsSection from './assessment/VitalSignsSection';
import CognitiveStatusSection from './assessment/CognitiveStatusSection';
import MotorFunctionSection from './assessment/MotorFunctionSection';

interface AssessmentFormProps {
  onSubmit: (assessment: Omit<NeurologicalAssessment, 'id'>) => void;
  initialData?: NeurologicalAssessment;
}

export default function NeurologicalAssessmentForm({ onSubmit, initialData }: AssessmentFormProps) {
  const [assessment, setAssessment] = useState<Partial<NeurologicalAssessment>>({
    patientId: '',
    date: new Date(),
    consciousness: {
      level: 'alert',
      glasgowScore: 15,
      pupilResponse: 'normal'
    },
    motorFunction: {
      strength: 5,
      coordination: 'normal',
      gait: 'normal'
    },
    cognitiveStatus: {
      orientation: 10,
      memory: 10,
      attention: 10,
      language: 10,
      executiveFunction: 10
    },
    vitalSigns: {
      bloodPressure: '',
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0,
      oxygenSaturation: 0
    },
    symptoms: [],
    complications: [],
    recommendations: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(assessment as Omit<NeurologicalAssessment, 'id'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
        <Brain className="w-6 h-6 text-purple-500" />
        <h2>Avaliação Neurológica</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConsciousnessSection
          consciousness={assessment.consciousness!}
          onChange={consciousness => setAssessment(prev => ({ ...prev, consciousness }))}
        />

        <VitalSignsSection
          vitalSigns={assessment.vitalSigns!}
          onChange={vitalSigns => setAssessment(prev => ({ ...prev, vitalSigns }))}
        />

        <div className="md:col-span-2">
          <CognitiveStatusSection
            cognitiveStatus={assessment.cognitiveStatus!}
            onChange={cognitiveStatus => setAssessment(prev => ({ ...prev, cognitiveStatus }))}
          />
        </div>

        <div className="md:col-span-2">
          <MotorFunctionSection
            motorFunction={assessment.motorFunction!}
            onChange={motorFunction => setAssessment(prev => ({ ...prev, motorFunction }))}
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-500" />
            Observações e Recomendações
          </h3>
          <textarea
            value={assessment.recommendations?.join('\n')}
            onChange={e => setAssessment(prev => ({
              ...prev,
              recommendations: e.target.value.split('\n').filter(Boolean)
            }))}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Adicione observações e recomendações..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          Salvar Avaliação
        </button>
      </div>
    </form>
  );
}