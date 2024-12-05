import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Brain, Save } from 'lucide-react';
import type { NeurologicalAssessment } from '../../../types/medical';

const assessmentSchema = z.object({
  patientId: z.string().min(1, 'ID do paciente é obrigatório'),
  consciousness: z.object({
    level: z.enum(['alert', 'drowsy', 'stuporous', 'comatose']),
    glasgowScore: z.number().min(3).max(15),
    pupilResponse: z.enum(['normal', 'abnormal', 'fixed'])
  }),
  motorFunction: z.object({
    strength: z.number().min(0).max(5),
    coordination: z.enum(['normal', 'impaired']),
    gait: z.enum(['normal', 'ataxic', 'spastic', 'unable'])
  }),
  cognitiveStatus: z.object({
    orientation: z.number().min(0).max(10),
    memory: z.number().min(0).max(10),
    attention: z.number().min(0).max(10),
    language: z.number().min(0).max(10),
    executiveFunction: z.number().min(0).max(10)
  }),
  vitalSigns: z.object({
    bloodPressure: z.string().min(1, 'Pressão arterial é obrigatória'),
    heartRate: z.number().min(0),
    temperature: z.number(),
    respiratoryRate: z.number().min(0),
    oxygenSaturation: z.number().min(0).max(100)
  }),
  symptoms: z.array(z.string()),
  complications: z.array(z.string()),
  recommendations: z.array(z.string())
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => void;
  initialData?: NeurologicalAssessment | null;
}

export default function AssessmentForm({ onSubmit, initialData }: AssessmentFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: initialData || {
      consciousness: {
        level: 'alert',
        glasgowScore: 15,
        pupilResponse: 'normal'
      },
      motorFunction: {
        strength: 5,
        coordination: 'normal',
        gait: 'normal'
      },
      cognitiveStatus: {
        orientation: 10,
        memory: 10,
        attention: 10,
        language: 10,
        executiveFunction: 10
      },
      vitalSigns: {
        bloodPressure: '',
        heartRate: 0,
        temperature: 36.5,
        respiratoryRate: 0,
        oxygenSaturation: 98
      },
      symptoms: [],
      complications: [],
      recommendations: []
    }
  });

  const handleFormSubmit = (data: AssessmentFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
        <Brain className="w-6 h-6 text-purple-500" />
        <h2>Avaliação Neurológica</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID do Paciente</label>
          <input
            type="text"
            {...register('patientId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.patientId && (
            <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nível de Consciência</label>
          <select
            {...register('consciousness.level')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="alert">Alerta</option>
            <option value="drowsy">Sonolento</option>
            <option value="stuporous">Estuporoso</option>
            <option value="comatose">Comatoso</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Escala de Glasgow</label>
          <input
            type="number"
            {...register('consciousness.glasgowScore', { valueAsNumber: true })}
            min="3"
            max="15"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Resposta Pupilar</label>
          <select
            {...register('consciousness.pupilResponse')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="normal">Normal</option>
            <option value="abnormal">Anormal</option>
            <option value="fixed">Fixa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Força Muscular (0-5)</label>
          <input
            type="number"
            {...register('motorFunction.strength', { valueAsNumber: true })}
            min="0"
            max="5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Coordenação</label>
          <select
            {...register('motorFunction.coordination')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="normal">Normal</option>
            <option value="impaired">Prejudicada</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Status Cognitivo</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
            <div>
              <label className="block text-xs text-gray-500">Orientação</label>
              <input
                type="number"
                {...register('cognitiveStatus.orientation', { valueAsNumber: true })}
                min="0"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Memória</label>
              <input
                type="number"
                {...register('cognitiveStatus.memory', { valueAsNumber: true })}
                min="0"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Atenção</label>
              <input
                type="number"
                {...register('cognitiveStatus.attention', { valueAsNumber: true })}
                min="0"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Linguagem</label>
              <input
                type="number"
                {...register('cognitiveStatus.language', { valueAsNumber: true })}
                min="0"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Função Executiva</label>
              <input
                type="number"
                {...register('cognitiveStatus.executiveFunction', { valueAsNumber: true })}
                min="0"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Sinais Vitais</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
            <div>
              <label className="block text-xs text-gray-500">Pressão Arterial</label>
              <input
                type="text"
                {...register('vitalSigns.bloodPressure')}
                placeholder="120/80"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Freq. Cardíaca</label>
              <input
                type="number"
                {...register('vitalSigns.heartRate', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Temperatura</label>
              <input
                type="number"
                step="0.1"
                {...register('vitalSigns.temperature', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Freq. Respiratória</label>
              <input
                type="number"
                {...register('vitalSigns.respiratoryRate', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Saturação O₂</label>
              <input
                type="number"
                {...register('vitalSigns.oxygenSaturation', { valueAsNumber: true })}
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Recomendações</label>
          <textarea
            {...register('recommendations')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            rows={4}
            placeholder="Adicione recomendações e observações..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Limpar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Avaliação</span>
        </button>
      </div>
    </form>
  );
}