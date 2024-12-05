import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import type { Appointment } from '../../../types/patient';

interface AddAppointmentFormProps {
  onSubmit: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
}

export default function AddAppointmentForm({ onSubmit }: AddAppointmentFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    doctor: '',
    room: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      type: '',
      doctor: '',
      room: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      notes: ''
    });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Nova Consulta</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Consulta</label>
        <input
          type="text"
          required
          value={formData.type}
          onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Ex: Neurológica, Rotina, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Médico</label>
        <input
          type="text"
          required
          value={formData.doctor}
          onChange={e => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Nome do médico"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sala</label>
        <input
          type="text"
          required
          value={formData.room}
          onChange={e => setFormData(prev => ({ ...prev, room: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Ex: 302"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Horário</label>
          <input
            type="time"
            required
            value={formData.time}
            onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={3}
          placeholder="Observações adicionais..."
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
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Agendar</span>
        </button>
      </div>
    </form>
  );
}