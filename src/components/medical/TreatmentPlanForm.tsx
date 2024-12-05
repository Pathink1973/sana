import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, Save } from 'lucide-react';
import type { TreatmentPlan } from '../../types/medical';

interface TreatmentPlanFormProps {
  onSubmit: (plan: Omit<TreatmentPlan, 'id'>) => void;
  initialData?: TreatmentPlan;
}

export default function TreatmentPlanForm({ onSubmit, initialData }: TreatmentPlanFormProps) {
  const [plan, setPlan] = useState<Partial<TreatmentPlan>>({
    patientId: '',
    startDate: new Date(),
    diagnosis: initialData?.diagnosis || '',
    primaryPhysician: initialData?.primaryPhysician || '',
    medications: initialData?.medications || [],
    therapies: initialData?.therapies || [],
    monitoring: initialData?.monitoring || [],
    dietaryRequirements: initialData?.dietaryRequirements || [],
    restrictions: initialData?.restrictions || [],
    emergencyProtocol: initialData?.emergencyProtocol || ''
  });

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    route: '',
    duration: ''
  });

  const handleDiagnosisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlan(prev => ({
      ...prev,
      diagnosis: e.target.value
    }));
  };

  const handlePhysicianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlan(prev => ({
      ...prev,
      primaryPhysician: e.target.value
    }));
  };

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      alert('Por favor, preencha pelo menos o nome e a dosagem da medicação.');
      return;
    }
    
    setPlan(prev => ({
      ...prev,
      medications: [...(prev.medications || []), { ...newMedication }]
    }));
    
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      route: '',
      duration: ''
    });
  };

  const removeMedication = (index: number) => {
    setPlan(prev => ({
      ...prev,
      medications: prev.medications?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plan.diagnosis?.trim() || !plan.primaryPhysician?.trim()) {
      alert('Por favor, preencha o diagnóstico e o médico responsável.');
      return;
    }

    if (!plan.medications || plan.medications.length === 0) {
      alert('Por favor, adicione pelo menos uma medicação ao plano.');
      return;
    }

    // Create a complete plan object
    const completePlan: Omit<TreatmentPlan, 'id'> = {
      patientId: plan.patientId || '',
      startDate: plan.startDate || new Date(),
      diagnosis: plan.diagnosis,
      primaryPhysician: plan.primaryPhysician,
      medications: plan.medications,
      therapies: plan.therapies || [],
      monitoring: plan.monitoring || [],
      dietaryRequirements: plan.dietaryRequirements || [],
      restrictions: plan.restrictions || [],
      emergencyProtocol: plan.emergencyProtocol || ''
    };

    onSubmit(completePlan);

    // Reset form after successful submission
    setPlan({
      patientId: '',
      startDate: new Date(),
      diagnosis: '',
      primaryPhysician: '',
      medications: [],
      therapies: [],
      monitoring: [],
      dietaryRequirements: [],
      restrictions: [],
      emergencyProtocol: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
        <ClipboardList className="w-6 h-6 text-blue-500" />
        <h2>Plano de Tratamento</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
              Diagnóstico *
            </label>
            <input
              id="diagnosis"
              type="text"
              value={plan.diagnosis}
              onChange={handleDiagnosisChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Digite o diagnóstico"
              required
            />
          </div>

          <div>
            <label htmlFor="physician" className="block text-sm font-medium text-gray-700">
              Médico Responsável *
            </label>
            <input
              id="physician"
              type="text"
              value={plan.primaryPhysician}
              onChange={handlePhysicianChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nome do médico responsável"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Medicações *</h3>
            <button
              type="button"
              onClick={addMedication}
              className="text-blue-500 hover:text-blue-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nome da medicação *"
                  value={newMedication.name}
                  onChange={e => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Dosagem *"
                  value={newMedication.dosage}
                  onChange={e => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Frequência"
                  value={newMedication.frequency}
                  onChange={e => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Via de administração"
                  value={newMedication.route}
                  onChange={e => setNewMedication(prev => ({ ...prev, route: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Duração"
                  value={newMedication.duration}
                  onChange={e => setNewMedication(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addMedication}
                  className="col-span-2 w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Adicionar Medicação
                </button>
              </div>
            </div>

            {plan.medications?.map((med, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{med.name}</h4>
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>Dosagem: {med.dosage}</p>
                  <p>Frequência: {med.frequency}</p>
                  <p>Via: {med.route}</p>
                  <p>Duração: {med.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Protocolo de Emergência</label>
          <textarea
            value={plan.emergencyProtocol}
            onChange={e => setPlan(prev => ({ ...prev, emergencyProtocol: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Descreva o protocolo de emergência..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Plano</span>
        </button>
      </div>
    </form>
  );
}