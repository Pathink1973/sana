import React, { useState } from 'react';
import { Save, FileText, AlertTriangle } from 'lucide-react';
import { Conversation } from '../types/conversation';
import { downloadConversation } from '../utils/conversationExport';

interface ConversationControlsProps {
  messages: { text: string; isBot: boolean; timestamp: string; }[];
  cognitiveAnalysis?: {
    timeOrientation: number;
    speechCoherence: number;
    memoryConsistency: number;
    emotionalState: string;
    concerns: string[];
  };
}

export default function ConversationControls({ messages, cognitiveAnalysis }: ConversationControlsProps) {
  const [patientName, setPatientName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (type: 'dialog' | 'report') => {
    if (!patientName.trim()) {
      setError('Por favor, insira o nome do paciente');
      return;
    }

    const conversation: Conversation = {
      id: Date.now().toString(),
      patientName: patientName.trim(),
      date: new Date().toLocaleString('pt-PT'),
      messages,
      cognitiveAnalysis
    };

    downloadConversation(conversation, type);
    setShowForm(false);
    setError('');
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
      >
        <Save size={18} />
        <span>Salvar Conversa</span>
      </button>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
      <div className="space-y-2">
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
          Nome do Paciente
        </label>
        <input
          type="text"
          id="patientName"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Digite o nome do paciente"
        />
        {error && (
          <div className="flex items-center gap-1 text-red-500 text-sm">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleSave('dialog')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Save size={18} />
          <span>Salvar Diálogo</span>
        </button>
        <button
          onClick={() => handleSave('report')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FileText size={18} />
          <span>Salvar Relatório</span>
        </button>
      </div>
    </div>
  );
}