import React from 'react';
import { Activity } from 'lucide-react';
import type { NeurologicalAssessment } from '../../../types/medical';

interface Props {
  consciousness: NeurologicalAssessment['consciousness'];
  onChange: (consciousness: NeurologicalAssessment['consciousness']) => void;
}

export default function ConsciousnessSection({ consciousness, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        Nível de Consciência
      </h3>
      <div className="space-y-2">
        <select
          value={consciousness.level}
          onChange={e => onChange({ ...consciousness, level: e.target.value as any })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="alert">Alerta</option>
          <option value="drowsy">Sonolento</option>
          <option value="stuporous">Estuporoso</option>
          <option value="comatose">Comatoso</option>
        </select>

        <div>
          <label className="block text-sm text-gray-600">Escala de Glasgow</label>
          <input
            type="number"
            min="3"
            max="15"
            value={consciousness.glasgowScore}
            onChange={e => onChange({ ...consciousness, glasgowScore: parseInt(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Resposta Pupilar</label>
          <select
            value={consciousness.pupilResponse}
            onChange={e => onChange({ ...consciousness, pupilResponse: e.target.value as any })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="normal">Normal</option>
            <option value="abnormal">Anormal</option>
            <option value="fixed">Fixa</option>
          </select>
        </div>
      </div>
    </div>
  );
}