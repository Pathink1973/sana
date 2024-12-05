import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import AddAppointmentForm from './appointments/AddAppointmentForm';
import AppointmentList from './appointments/AppointmentList';
import type { Appointment } from '../../types/patient';

export default function AppointmentScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  const handleAddAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      status: 'scheduled'
    };
    saveAppointments([...appointments, newAppointment]);
  };

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status } : appointment
    );
    saveAppointments(updatedAppointments);
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
      saveAppointments(appointments.filter(appointment => appointment.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Agendamentos</h2>
        </div>
      </div>

      <div className="space-y-6">
        <AddAppointmentForm onSubmit={handleAddAppointment} />
        
        <AppointmentList
          appointments={appointments}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteAppointment}
        />
      </div>
    </div>
  );
}