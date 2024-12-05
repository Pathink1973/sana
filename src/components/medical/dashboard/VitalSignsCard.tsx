import React, { useState } from 'react';
import { Thermometer, Plus, Save } from 'lucide-react';
import type { VitalSigns } from '../../../types/patient';

interface VitalSignsCardProps {
  vitalSigns: VitalSigns;
  onUpdate: (newVitals: VitalSigns) => void;
}

export default function VitalSignsCard({ vitalSigns, onUpdate }: VitalSignsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newVitals, setNewVitals] = useState<VitalSigns>({
    bloodPressure: '',
    heartRate: 0,
    temperature: 0,
    oxygenSaturation: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVitals(newVitals)) return;
    onUpdate(newVitals);
    setIsEditing(false);
  };

  const validateVitals = (vitals: VitalSigns): boolean => {
    return (
      vitals.bloodPressure.trim() !== '' &&
      vitals.heartRate > 0 &&
      vitals.temperature > 0 &&
      vitals.oxygenSaturation > 0 &&
      vitals.oxygenSaturation <= 100
    );
  };

  const startEditing = () => {
    setNewVitals(vitalSigns);
    setIsEditing(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Sinais Vitais</h3>
        </div>
        <button
          onClick={startEditing}
          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          {isEditing ? 'Cancelar' : 'Novo Registro'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Pressão Arterial</label>
              <input
                type="text"
                value={newVitals.bloodPressure}
                onChange={e => setNewVitals(prev => ({ ...prev, bloodPressure: e.target.value }))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="120/80"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Freq. Cardíaca (bpm)</label>
              <input
                type="number"
                value={newVitals.heartRate}
                onChange={e => setNewVitals(prev => ({ ...prev, heartRate: Number(e.target.value) }))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
                max="300"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                value={newVitals.temperature}
                onChange={e => setNewVitals(prev => ({ ...prev, temperature: Number(e.target.value) }))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                min="30"
                max="45"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Saturação O₂ (%)</label>
              <input
                type="number"
                value={newVitals.oxygenSaturation}
                onChange={e => setNewVitals(prev => ({ ...prev, oxygenSaturation: Number(e.target.value) }))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Pressão Arterial</p>
            <p className="text-lg font-semibold">{vitalSigns.bloodPressure || '--'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Frequência Cardíaca</p>
            <p className="text-lg font-semibold">{vitalSigns.heartRate || '--'} bpm</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Temperatura</p>
            <p className="text-lg font-semibold">{vitalSigns.temperature || '--'}°C</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Saturação O₂</p>
            <p className="text-lg font-semibold">{vitalSigns.oxygenSaturation || '--'}%</p>
          </div>
        </div>
      )}
    </div>
  );
}