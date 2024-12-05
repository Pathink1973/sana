import React from 'react';
import { Brain } from 'lucide-react';
import type { NeurologicalAssessment } from '../../../types/medical';

interface Props {
  cognitiveStatus: NeurologicalAssessment['cognitiveStatus'];
  onChange: (cognitiveStatus: NeurologicalAssessment['cognitiveStatus']) => void;
}

export default function CognitiveStatusSection({ cognitiveStatus, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <Brain className="w-5 h-5 text-green-500" />
        Status Cognitivo
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(cognitiveStatus).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={value}
              onChange={e => onChange({
                ...cognitiveStatus,
                [key]: parseInt(e.target.value)
              })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}