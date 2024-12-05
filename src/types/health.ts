export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  instructions: string;
  lastTaken?: Date;
  nextDue?: Date;
}

export interface DailyActivity {
  id: string;
  type: 'hygiene' | 'meal' | 'exercise' | 'social' | 'cognitive';
  name: string;
  completed: boolean;
  timeCompleted?: Date;
  notes?: string;
  importance: 'low' | 'medium' | 'high';
  scheduledTime?: string;
}

export interface HealthReport {
  medications: Medication[];
  activities: DailyActivity[];
  date: string;
  notes: string;
}