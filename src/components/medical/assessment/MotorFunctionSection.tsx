import React from 'react';
import { Activity } from 'lucide-react';
import type { NeurologicalAssessment } from '../../../types/medical';

interface Props {
  motorFunction: NeurologicalAssessment['motorFunction'];
  onChange: (motorFunction: NeurologicalAssessment['motorFunction']) => void;
}

export default function MotorFunctionSection({ motorFunction, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <Activity className="w-5 h-5 text-yellow-500" />
        Função Motora
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Força Muscular (0-5)</label>
          <input
            type="number"
            min="0"
            max="5"
            value={motorFunction.strength}
            onChange={e => onChange({ ...motorFunction, strength: parseInt(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Coordenação</label>
          <select
            value={motorFunction.coordination}
            onChange={e => onChange({ ...motorFunction, coordination: e.target.value as any })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="normal">Normal</option>
            <option value="impaired">Prejudicada</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600">Marcha</label>
          <select
            value={motorFunction.gait}
            onChange={e => onChange({ ...motorFunction, gait: e.target.value as any })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="normal">Normal</option>
            <option value="ataxic">Atáxica</option>
            <option value="spastic">Espástica</option>
            <option value="unable">Incapaz</option>
          </select>
        </div>
      </div>
    </div>
  );
}