import React, { useState, useRef } from 'react';
import { Plus, Save, Upload } from 'lucide-react';

interface AddLabResultFormProps {
  onSubmit: (result: {
    type: string;
    doctor: string;
    date: string;
    result: string;
    attachment?: File;
  }) => void;
}

export default function AddLabResultForm({ onSubmit }: AddLabResultFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    result: '',
    attachment: undefined as File | undefined
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      type: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      result: '',
      attachment: undefined
    });
    setShowForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachment: file }));
    }
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
        <label className="block text-sm font-medium text-gray-700">Anexo (opcional)</label>
        <div className="mt-1 flex items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Escolher arquivo</span>
          </button>
          <span className="ml-4 text-sm text-gray-500">
            {formData.attachment?.name || 'Nenhum arquivo selecionado'}
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Formatos aceitos: PDF, TXT, DOC, DOCX, JPG, JPEG, PNG
        </p>
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