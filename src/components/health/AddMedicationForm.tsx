import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { medicationManager } from '../../utils/health/medicationManager';

export default function AddMedicationForm({ onAdd }: { onAdd: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    instructions: '',
    timeOfDay: ['morning']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    medicationManager.addMedication({
      ...medication,
      nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    onAdd();
    setShowForm(false);
    setMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      instructions: '',
      timeOfDay: ['morning']
    });
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Adicionar Medicação</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome da Medicação</label>
        <input
          type="text"
          required
          value={medication.name}
          onChange={e => setMedication(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dosagem</label>
        <input
          type="text"
          required
          value={medication.dosage}
          onChange={e => setMedication(prev => ({ ...prev, dosage: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Frequência</label>
        <select
          value={medication.frequency}
          onChange={e => setMedication(prev => ({ ...prev, frequency: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="daily">Diária</option>
          <option value="twice daily">Duas vezes ao dia</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instruções</label>
        <textarea
          value={medication.instructions}
          onChange={e => setMedication(prev => ({ ...prev, instructions: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}