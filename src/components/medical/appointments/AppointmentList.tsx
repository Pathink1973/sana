import React from 'react';
import { Clock, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Appointment } from '../../../types/patient';

interface AppointmentListProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentList({ appointments, onUpdateStatus, onDelete }: AppointmentListProps) {
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-4">
      {sortedAppointments.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          Nenhuma consulta agendada
        </p>
      ) : (
        sortedAppointments.map(appointment => (
          <div
            key={appointment.id}
            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{appointment.type}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status === 'scheduled' ? 'Agendado' : 
                   appointment.status === 'completed' ? 'Realizado' : 'Cancelado'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Dr. {appointment.doctor} - Sala {appointment.room}</p>
              {appointment.notes && (
                <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
              )}
            </div>

            <div className="text-right flex flex-col items-end">
              <p className="font-medium text-gray-900">{appointment.time}</p>
              <p className="text-sm text-gray-600">
                {new Date(appointment.date).toLocaleDateString()}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                {appointment.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(appointment.id, 'completed')}
                      className="p-1 text-green-600 hover:text-green-700"
                      title="Marcar como realizada"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Cancelar consulta"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onDelete(appointment.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Excluir consulta"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}