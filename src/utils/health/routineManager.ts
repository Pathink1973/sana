import { DailyActivity } from '../../types/health';

class RoutineManager {
  private activities: DailyActivity[] = [];
  
  constructor() {
    const savedActivities = localStorage.getItem('dailyActivities');
    if (savedActivities) {
      this.activities = JSON.parse(savedActivities);
    }
  }

  private save() {
    localStorage.setItem('dailyActivities', JSON.stringify(this.activities));
  }

  public addActivity(activity: Omit<DailyActivity, 'id' | 'completed'>) {
    const newActivity: DailyActivity = {
      ...activity,
      id: Date.now().toString(),
      completed: false
    };
    
    this.activities.push(newActivity);
    this.save();
  }

  public removeActivity(id: string) {
    this.activities = this.activities.filter(activity => activity.id !== id);
    this.save();
  }

  public markCompleted(id: string, notes?: string) {
    this.activities = this.activities.map(activity =>
      activity.id === id
        ? {
            ...activity,
            completed: true,
            timeCompleted: new Date(),
            notes: notes || activity.notes
          }
        : activity
    );
    this.save();
  }

  public getActivitiesByType(type: DailyActivity['type']): DailyActivity[] {
    return this.activities.filter(activity => activity.type === type);
  }

  public getPendingActivities(): DailyActivity[] {
    return this.activities.filter(activity => !activity.completed)
      .sort((a, b) => {
        const aTime = a.scheduledTime || '23:59';
        const bTime = b.scheduledTime || '23:59';
        return aTime.localeCompare(bTime);
      });
  }

  public getCompletedActivities(): DailyActivity[] {
    return this.activities.filter(activity => activity.completed)
      .sort((a, b) => {
        const aTime = a.timeCompleted?.getTime() || 0;
        const bTime = b.timeCompleted?.getTime() || 0;
        return bTime - aTime;
      });
  }

  public resetDailyActivities() {
    this.activities = this.activities.map(activity => ({
      ...activity,
      completed: false,
      timeCompleted: undefined,
      notes: undefined
    }));
    this.save();
  }
}

export const routineManager = new RoutineManager();