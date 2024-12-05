import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { NeurologicalAssessment } from '../../../types/medical';

interface AssessmentStatsProps {
  assessments: NeurologicalAssessment[];
}

export default function AssessmentStats({ assessments }: AssessmentStatsProps) {
  const chartData = assessments.map(assessment => ({
    date: format(new Date(assessment.date), 'dd/MM'),
    cognition: (
      assessment.cognitiveStatus.orientation +
      assessment.cognitiveStatus.memory +
      assessment.cognitiveStatus.attention +
      assessment.cognitiveStatus.language +
      assessment.cognitiveStatus.executiveFunction
    ) / 5,
    consciousness: assessment.consciousness.glasgowScore,
    motor: assessment.motorFunction.strength
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Evolução do Paciente</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cognition" 
                stroke="#8b5cf6" 
                name="Score Cognitivo"
              />
              <Line 
                type="monotone" 
                dataKey="consciousness" 
                stroke="#3b82f6" 
                name="Glasgow"
              />
              <Line 
                type="monotone" 
                dataKey="motor" 
                stroke="#10b981" 
                name="Função Motora"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Distribuição de Scores</h3>
          {/* Add a pie or bar chart showing distribution of scores */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Tendências</h3>
          {/* Add trend analysis visualization */}
        </div>
      </div>
    </div>
  );
}