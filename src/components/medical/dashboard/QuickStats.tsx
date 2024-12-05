import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Activity, AlertTriangle } from 'lucide-react';
import type { PatientStats } from '../../../types/patient';

interface QuickStatsProps {
  stats: PatientStats;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'estável':
      case 'normal':
        return 'text-green-600';
      case 'instável':
      case 'atenção':
      case 'moderada':
        return 'text-amber-600';
      case 'crítico':
      case 'baixa':
        return 'text-red-600';
      case 'alta':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white p-4 rounded-lg shadow-sm border border-purple-100"
      >
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Estado Cognitivo</p>
            <p className={`text-lg font-semibold ${getStateColor(stats.cognitiveState)}`}>
              {stats.cognitiveState}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white p-4 rounded-lg shadow-sm border border-blue-100"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Heart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Sinais Vitais</p>
            <p className={`text-lg font-semibold ${getStateColor(stats.vitalState)}`}>
              {stats.vitalState}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white p-4 rounded-lg shadow-sm border border-green-100"
      >
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Atividade</p>
            <p className={`text-lg font-semibold ${getStateColor(stats.activityLevel)}`}>
              {stats.activityLevel}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white p-4 rounded-lg shadow-sm border border-amber-100"
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Alertas</p>
            <p className="text-lg font-semibold text-amber-600">
              {stats.alertCount} Pendentes
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}