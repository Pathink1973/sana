import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { LabResult } from '../../../types/patient';

interface LabResultItemProps {
  result: LabResult;
  onDelete: (id: string) => void;
}

export default function LabResultItem({ result, onDelete }: LabResultItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div>
        <h3 className="font-medium text-gray-900">{result.type}</h3>
        <p className="text-sm text-gray-600">Dr. {result.doctor}</p>
        <p className="text-sm text-gray-500">{new Date(result.date).toLocaleDateString()}</p>
        {result.result && (
          <p className="mt-2 text-sm text-gray-700">{result.result}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {result.attachmentUrl && (
          <a
            href={result.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="Download anexo"
          >
            <Download className="w-5 h-5" />
          </a>
        )}
        <button
          onClick={() => onDelete(result.id)}
          className="p-2 text-red-500 hover:text-red-700 transition-colors"
          title="Excluir resultado"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}