import React, { useState } from 'react';
import QuickStats from './dashboard/QuickStats';
import VitalSignsCard from './dashboard/VitalSignsCard';
import type { PatientData } from '../../types/patient';

const initialData: PatientData = {
  stats: {
    cognitiveState: 'Estável',
    vitalState: 'Normal',
    activityLevel: 'Moderada',
    alertCount: 2
  },
  vitalSigns: {
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 36.5,
    oxygenSaturation: 98
  },
  appointments: [],
  labResults: [],
  treatmentProgress: {
    medication: 90,
    exercises: 75,
    therapy: 85
  }
};

export default function PatientDashboard() {
  const [patientData, setPatientData] = useState<PatientData>(initialData);

  const handleVitalSignsUpdate = (newVitals: typeof patientData.vitalSigns) => {
    setPatientData(prev => ({
      ...prev,
      vitalSigns: newVitals,
      stats: {
        ...prev.stats,
        vitalState: calculateVitalState(newVitals)
      }
    }));
  };

  const calculateVitalState = (vitals: typeof patientData.vitalSigns): 'Normal' | 'Atenção' | 'Crítico' => {
    // Add your vital signs evaluation logic here
    return 'Normal';
  };

  return (
    <div className="space-y-6">
      <QuickStats stats={patientData.stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VitalSignsCard
            vitalSigns={patientData.vitalSigns}
            onUpdate={handleVitalSignsUpdate}
          />
          {/* Add other cards here */}
        </div>
      </div>
    </div>
  );
}