import React from 'react';
import { Clock, Check, AlertTriangle } from 'lucide-react';
import { Medication } from '../../types/health';
import { medicationManager } from '../../utils/health/medicationManager';

interface MedicationListProps {
  medications: Medication[];
  onMedicationTaken: (id: string) => void;
}

export default function MedicationList({ medications, onMedicationTaken }: MedicationListProps) {
  const isOverdue = (medication: Medication) => {
    if (!medication.nextDue) return false;
    return new Date(medication.nextDue) < new Date();
  };

  return (
    <div className="space-y-4">
      {medications.map(medication => (
        <div
          key={medication.id}
          className={`p-4 rounded-lg border ${
            isOverdue(medication) ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{medication.name}</h3>
              <p className="text-sm text-gray-600">{medication.dosage}</p>
            </div>
            <button
              onClick={() => onMedicationTaken(medication.id)}
              className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{medication.frequency}</span>
            </div>
            {medication.nextDue && (
              <div className="flex items-center gap-1">
                {isOverdue(medication) ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Atrasado</span>
                  </>
                ) : (
                  <span className="text-gray-600">
                    Próxima dose: {new Date(medication.nextDue).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {medication.instructions && (
            <p className="mt-2 text-sm text-gray-600">{medication.instructions}</p>
          )}
        </div>
      ))}
    </div>
  );
}