interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
}

interface Appointment {
  id: string;
  type: string;
  doctor: string;
  room: string;
  date: string;
  time: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface LabResult {
  id: string;
  type: string;
  doctor: string;
  date: string;
  result?: string;
  attachmentUrl?: string;
}

interface TreatmentProgress {
  medication: number;
  exercises: number;
  therapy: number;
}

export interface PatientStats {
  cognitiveState: 'Estável' | 'Instável' | 'Crítico';
  vitalState: 'Normal' | 'Atenção' | 'Crítico';
  activityLevel: 'Baixa' | 'Moderada' | 'Alta';
  alertCount: number;
}

export interface PatientData {
  stats: PatientStats;
  vitalSigns: VitalSigns;
  appointments: Appointment[];
  labResults: LabResult[];
  treatmentProgress: TreatmentProgress;
}

export type { VitalSigns, Appointment, LabResult, TreatmentProgress };