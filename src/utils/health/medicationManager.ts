import { Medication } from '../../types/health';

class MedicationManager {
  private medications: Medication[] = [];
  
  constructor() {
    const savedMeds = localStorage.getItem('medications');
    if (savedMeds) {
      this.medications = JSON.parse(savedMeds);
    }
  }

  private save() {
    localStorage.setItem('medications', JSON.stringify(this.medications));
  }

  public addMedication(med: Omit<Medication, 'id'>) {
    const medication: Medication = {
      ...med,
      id: Date.now().toString(),
    };
    
    this.medications.push(medication);
    this.save();
  }

  public removeMedication(id: string) {
    this.medications = this.medications.filter(med => med.id !== id);
    this.save();
  }

  public updateMedication(id: string, updates: Partial<Medication>) {
    this.medications = this.medications.map(med =>
      med.id === id ? { ...med, ...updates } : med
    );
    this.save();
  }

  public getUpcomingMedications(): Medication[] {
    const now = new Date();
    const currentHour = now.getHours();
    
    return this.medications.filter(med => {
      if (!med.nextDue) return false;
      const dueDate = new Date(med.nextDue);
      return dueDate.getTime() - now.getTime() <= 3600000; // Within next hour
    });
  }

  public markMedicationTaken(id: string) {
    const medication = this.medications.find(med => med.id === id);
    if (!medication) return;

    const now = new Date();
    const nextDue = this.calculateNextDue(medication.frequency, now);

    this.updateMedication(id, {
      lastTaken: now,
      nextDue
    });
  }

  private calculateNextDue(frequency: string, fromDate: Date): Date {
    const next = new Date(fromDate);
    
    switch (frequency.toLowerCase()) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'twice daily':
        next.setHours(next.getHours() + 12);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      default:
        next.setDate(next.getDate() + 1);
    }
    
    return next;
  }

  public getMedicationSchedule(): Medication[] {
    return [...this.medications].sort((a, b) => {
      const aNext = a.nextDue ? new Date(a.nextDue).getTime() : Infinity;
      const bNext = b.nextDue ? new Date(b.nextDue).getTime() : Infinity;
      return aNext - bNext;
    });
  }
}

export const medicationManager = new MedicationManager();