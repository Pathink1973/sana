import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { LabResult } from '../../../types/patient';

interface LabResultItemProps {
  result: LabResult;
  onDelete: (id: string) => void;
}

export default function LabResultItem({ result, onDelete }: LabResultItemProps) {
  const handleDownload = () => {
    if (result.attachment) {
      // Create a URL for the blob
      const url = URL.createObjectURL(result.attachment);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.attachment.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

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
        {result.attachment && (
          <button
            onClick={handleDownload}
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="Download anexo"
          >
            <FileText className="w-5 h-5" />
          </button>
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