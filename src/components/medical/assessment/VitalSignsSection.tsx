import React from 'react';
import { ThermometerSnowflake } from 'lucide-react';
import type { NeurologicalAssessment } from '../../../types/medical';

interface Props {
  vitalSigns: NeurologicalAssessment['vitalSigns'];
  onChange: (vitalSigns: NeurologicalAssessment['vitalSigns']) => void;
}

export default function VitalSignsSection({ vitalSigns, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <ThermometerSnowflake className="w-5 h-5 text-red-500" />
        Sinais Vitais
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Pressão Arterial</label>
          <input
            type="text"
            placeholder="120/80"
            value={vitalSigns.bloodPressure}
            onChange={e => onChange({ ...vitalSigns, bloodPressure: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Frequência Cardíaca</label>
          <input
            type="number"
            value={vitalSigns.heartRate}
            onChange={e => onChange({ ...vitalSigns, heartRate: parseInt(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Temperatura (°C)</label>
          <input
            type="number"
            step="0.1"
            value={vitalSigns.temperature}
            onChange={e => onChange({ ...vitalSigns, temperature: parseFloat(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Freq. Respiratória</label>
          <input
            type="number"
            value={vitalSigns.respiratoryRate}
            onChange={e => onChange({ ...vitalSigns, respiratoryRate: parseInt(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Saturação O₂ (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={vitalSigns.oxygenSaturation}
            onChange={e => onChange({ ...vitalSigns, oxygenSaturation: parseInt(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}