import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';

interface AddLabResultFormProps {
  onSubmit: (result: {
    type: string;
    doctor: string;
    date: string;
    result: string;
    attachmentUrl?: string;
  }) => void;
}

export default function AddLabResultForm({ onSubmit }: AddLabResultFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    result: '',
    attachmentUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      type: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      result: '',
      attachmentUrl: ''
    });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Adicionar Resultado de Exame</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Exame</label>
        <input
          type="text"
          required
          value={formData.type}
          onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Ex: Ressonância Magnética, Hemograma, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Médico Responsável</label>
        <input
          type="text"
          required
          value={formData.doctor}
          onChange={e => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Nome do médico"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Data do Exame</label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Resultado</label>
        <textarea
          value={formData.result}
          onChange={e => setFormData(prev => ({ ...prev, result: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          rows={3}
          placeholder="Descreva os resultados do exame"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL do Anexo (opcional)</label>
        <input
          type="url"
          value={formData.attachmentUrl}
          onChange={e => setFormData(prev => ({ ...prev, attachmentUrl: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="https://..."
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
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Salvar</span>
        </button>
      </div>
    </form>
  );
}