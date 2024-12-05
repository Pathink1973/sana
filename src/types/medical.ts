export interface NeurologicalAssessment {
  id: string;
  patientId: string;
  date: Date;
  consciousness: {
    level: 'alert' | 'drowsy' | 'stuporous' | 'comatose';
    glasgowScore: number;
    pupilResponse: 'normal' | 'abnormal' | 'fixed';
  };
  motorFunction: {
    strength: number; // 0-5 scale
    coordination: 'normal' | 'impaired';
    gait: 'normal' | 'ataxic' | 'spastic' | 'unable';
  };
  cognitiveStatus: {
    orientation: number; // 0-10 scale
    memory: number; // 0-10 scale
    attention: number; // 0-10 scale
    language: number; // 0-10 scale
    executiveFunction: number; // 0-10 scale
  };
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
  symptoms: string[];
  complications: string[];
  recommendations: string[];
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  startDate: Date;
  endDate?: Date;
  diagnosis: string;
  primaryPhysician: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    duration: string;
  }[];
  therapies: {
    type: 'physical' | 'occupational' | 'speech' | 'cognitive';
    frequency: string;
    duration: string;
    goals: string[];
  }[];
  monitoring: {
    parameter: string;
    frequency: string;
    threshold: string;
  }[];
  dietaryRequirements: string[];
  restrictions: string[];
  emergencyProtocol: string;
}

export interface PatientProgress {
  id: string;
  patientId: string;
  date: Date;
  assessmentType: 'routine' | 'emergency' | 'follow-up';
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
  symptoms: string[];
  medications: {
    name: string;
    compliance: boolean;
    sideEffects?: string[];
  }[];
  therapyProgress: {
    type: string;
    attendance: boolean;
    performance: number; // 0-10 scale
    notes: string;
  }[];
  complications: string[];
  interventions: string[];
  nextAssessmentDate: Date;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: Date;
  author: string;
  type: 'progress' | 'consultation' | 'procedure' | 'emergency';
  content: string;
  assessment: string;
  plan: string;
  attachments?: {
    type: string;
    url: string;
    description: string;
  }[];
}