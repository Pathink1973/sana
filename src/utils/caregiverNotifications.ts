interface CaregiverAlert {
  type: 'normal' | 'attention' | 'urgent';
  message: string;
  timestamp: Date;
  metrics: {
    timeOrientation: number;
    speechCoherence: number;
    memoryConsistency: number;
    emotionalState: string;
  };
}

class CaregiverNotificationSystem {
  private alerts: CaregiverAlert[] = [];
  
  public addAlert(
    type: 'normal' | 'attention' | 'urgent',
    message: string,
    metrics: {
      timeOrientation: number;
      speechCoherence: number;
      memoryConsistency: number;
      emotionalState: string;
    }
  ) {
    const alert: CaregiverAlert = {
      type,
      message,
      timestamp: new Date(),
      metrics
    };
    
    this.alerts.push(alert);
    this.notifyCaregiver(alert);
  }

  private notifyCaregiver(alert: CaregiverAlert) {
    // In a real implementation, this would send notifications via email, SMS, or push notifications
    console.log('Caregiver Alert:', {
      type: alert.type,
      message: alert.message,
      timestamp: alert.timestamp.toLocaleString(),
      metrics: alert.metrics
    });
  }

  public getRecentAlerts(hours: number = 24): CaregiverAlert[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.alerts.filter(alert => alert.timestamp > cutoff);
  }
}

export const notificationSystem = new CaregiverNotificationSystem();