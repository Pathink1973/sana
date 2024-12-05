import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Brain, Activity, FileText } from 'lucide-react';
import AssessmentForm from './AssessmentForm';
import AssessmentHistory from './AssessmentHistory';
import AssessmentStats from './AssessmentStats';
import type { NeurologicalAssessment } from '../../../types/medical';

interface AssessmentDashboardProps {
  onAssessmentSubmit: (assessment: Omit<NeurologicalAssessment, 'id' | 'date'>) => void;
}

export default function AssessmentDashboard({ onAssessmentSubmit }: AssessmentDashboardProps) {
  const [assessments, setAssessments] = useState<NeurologicalAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<NeurologicalAssessment | null>(null);

  useEffect(() => {
    const savedAssessments = localStorage.getItem('neurologicalAssessments');
    if (savedAssessments) {
      setAssessments(JSON.parse(savedAssessments));
    }
  }, []);

  const handleSubmit = (data: Omit<NeurologicalAssessment, 'id' | 'date'>) => {
    const newAssessment: NeurologicalAssessment = {
      ...data,
      id: Date.now().toString(),
      date: new Date()
    };

    const updatedAssessments = [newAssessment, ...assessments];
    setAssessments(updatedAssessments);
    localStorage.setItem('neurologicalAssessments', JSON.stringify(updatedAssessments));
    onAssessmentSubmit(data);
  };

  const stats = {
    total: assessments.length,
    critical: assessments.filter(a => 
      a.cognitiveStatus.orientation < 5 || 
      a.consciousness.glasgowScore < 10
    ).length,
    improved: assessments.filter((a, i) => 
      i > 0 && 
      a.cognitiveStatus.orientation > assessments[i-1].cognitiveStatus.orientation
    ).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Total de Avaliações</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Casos Críticos</p>
              <p className="text-xl font-semibold">{stats.critical}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Melhorias</p>
              <p className="text-xl font-semibold">{stats.improved}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="new"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Nova Avaliação</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Histórico</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="stats"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Estatísticas</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <AssessmentForm 
            onSubmit={handleSubmit}
            initialData={selectedAssessment}
          />
        </TabsContent>

        <TabsContent value="history">
          <AssessmentHistory
            assessments={assessments}
            onSelect={setSelectedAssessment}
          />
        </TabsContent>

        <TabsContent value="stats">
          <AssessmentStats assessments={assessments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}