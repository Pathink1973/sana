import React from 'react';
import { FileText, Search } from 'lucide-react';

export default function MedicalHistory() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Histórico Médico</h2>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar registros..."
            className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">Consulta Neurológica</h3>
                <p className="text-sm text-gray-600">Dr. Silva</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-gray-700">
              Paciente apresentou melhora significativa na orientação temporal...
            </p>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
        Ver histórico completo
      </button>
    </div>
  );
}