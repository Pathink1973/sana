import React from 'react';
import { CheckCircle, Circle, Clock, Brain, Utensils, Heart, Users, Bath, Trash2 } from 'lucide-react';
import { DailyActivity } from '../../types/health';
import { routineManager } from '../../utils/health/routineManager';

interface ActivityListProps {
  activities: DailyActivity[];
  onActivityComplete: (id: string) => void;
}

export default function ActivityList({ activities, onActivityComplete }: ActivityListProps) {
  const getActivityIcon = (type: DailyActivity['type']) => {
    switch (type) {
      case 'cognitive':
        return <Brain className="w-5 h-5" />;
      case 'meal':
        return <Utensils className="w-5 h-5" />;
      case 'exercise':
        return <Heart className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'hygiene':
        return <Bath className="w-5 h-5" />;
    }
  };

  const getImportanceColor = (importance: DailyActivity['importance']) => {
    switch (importance) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      routineManager.removeActivity(id);
      // Refresh the activities list by reloading the page
      window.location.reload();
    }
  };

  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <div
          key={activity.id}
          className={`p-4 rounded-lg border ${
            activity.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => onActivityComplete(activity.id)}
              className={`flex-shrink-0 ${activity.completed ? 'text-green-500' : 'text-gray-400'}`}
            >
              {activity.completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>

            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg ${getImportanceColor(activity.importance)}`}>
                  {getActivityIcon(activity.type)}
                </span>
                <h3 className={`font-medium ${activity.completed ? 'text-gray-500' : 'text-gray-900'}`}>
                  {activity.name}
                </h3>
              </div>

              {activity.scheduledTime && (
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{activity.scheduledTime}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activity.completed && activity.timeCompleted && (
                <span className="text-sm text-gray-500">
                  Concluído às {new Date(activity.timeCompleted).toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => handleDelete(activity.id)}
                className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                title="Excluir atividade"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activity.notes && (
            <p className="mt-2 text-sm text-gray-600 ml-10">{activity.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}