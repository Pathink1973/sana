import React, { useState, useEffect } from 'react';
import { TestTube2 } from 'lucide-react';
import AddLabResultForm from './AddLabResultForm';
import LabResultItem from './LabResultItem';
import type { LabResult } from '../../../types/patient';

export default function LabResults() {
  const [results, setResults] = useState<LabResult[]>([]);
  const [displayCount, setDisplayCount] = useState(5);

  useEffect(() => {
    const savedResults = localStorage.getItem('labResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const saveResults = (newResults: LabResult[]) => {
    setResults(newResults);
    localStorage.setItem('labResults', JSON.stringify(newResults));
  };

  const handleAddResult = (result: Omit<LabResult, 'id'>) => {
    const newResult: LabResult = {
      ...result,
      id: Date.now().toString()
    };
    saveResults([newResult, ...results]);
  };

  const handleDeleteResult = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este resultado?')) {
      saveResults(results.filter(result => result.id !== id));
    }
  };

  const showMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  const showLess = () => {
    setDisplayCount(5);
  };

  const displayedResults = results.slice(0, displayCount);
  const hasMore = results.length > displayCount;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TestTube2 className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Resultados de Exames</h2>
        </div>
      </div>

      <div className="space-y-4">
        <AddLabResultForm onSubmit={handleAddResult} />

        {displayedResults.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Nenhum resultado de exame registrado
          </p>
        ) : (
          <div className="space-y-4 mt-4">
            {displayedResults.map(result => (
              <LabResultItem
                key={result.id}
                result={result}
                onDelete={handleDeleteResult}
              />
            ))}
          </div>
        )}

        {results.length > 5 && (
          <div className="mt-4 text-center">
            {hasMore ? (
              <button
                onClick={showMore}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Ver mais resultados
              </button>
            ) : (
              <button
                onClick={showLess}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Ver menos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}