import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { routineManager } from '../../utils/health/routineManager';
import { DailyActivity } from '../../types/health';

export default function AddActivityForm({ onAdd }: { onAdd: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [activity, setActivity] = useState({
    name: '',
    type: 'cognitive' as DailyActivity['type'],
    importance: 'medium' as DailyActivity['importance'],
    scheduledTime: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    routineManager.addActivity(activity);
    onAdd();
    setShowForm(false);
    setActivity({
      name: '',
      type: 'cognitive',
      importance: 'medium',
      scheduledTime: '',
      notes: ''
    });
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Adicionar Atividade</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome da Atividade</label>
        <input
          type="text"
          required
          value={activity.name}
          onChange={e => setActivity(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={activity.type}
          onChange={e => setActivity(prev => ({ ...prev, type: e.target.value as DailyActivity['type'] }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="cognitive">Cognitiva</option>
          <option value="meal">Refeição</option>
          <option value="exercise">Exercício</option>
          <option value="social">Social</option>
          <option value="hygiene">Higiene</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Importância</label>
        <select
          value={activity.importance}
          onChange={e => setActivity(prev => ({ ...prev, importance: e.target.value as DailyActivity['importance'] }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Horário Programado</label>
        <input
          type="time"
          value={activity.scheduledTime}
          onChange={e => setActivity(prev => ({ ...prev, scheduledTime: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          value={activity.notes}
          onChange={e => setActivity(prev => ({ ...prev, notes: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
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
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}