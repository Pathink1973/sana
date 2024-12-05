import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Calendar, Clock, Activity, AlertTriangle, Tag as TagIcon, Save, Trash2, Search } from 'lucide-react';

interface AnalysisNote {
  id: string;
  timestamp: string;
  cognitiveScore: number;
  timeOrientation: number;
  activityLevel: string;
  concerns: string[];
  tags: string[];
  notes: string;
}

const COGNITIVE_TAGS = [
  'Problemas de Memória',
  'Confusão Temporal',
  'Padrão de Fala',
  'Estado Emocional',
  'Tarefas Diárias',
  'Interação Social',
  'Medicação',
  'Padrão de Sono',
  'Apetite',
  'Atividade Física'
];

export default function AlzheimerAnalysisNotes() {
  const [notes, setNotes] = useState<AnalysisNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState<string>('');
  const [cognitiveScore, setCognitiveScore] = useState<number>(5);
  const [timeOrientation, setTimeOrientation] = useState<number>(5);
  const [activityLevel, setActivityLevel] = useState<string>('normal');
  const [concerns, setConcerns] = useState<string[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('alzheimerAnalysisNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNote = () => {
    if (!newNote.trim()) return;

    const note: AnalysisNote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('pt-BR'),
      cognitiveScore,
      timeOrientation,
      activityLevel,
      concerns,
      tags: selectedTags,
      notes: newNote
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('alzheimerAnalysisNotes', JSON.stringify(updatedNotes));
    
    // Reset form
    setNewNote('');
    setSelectedTags([]);
    setCognitiveScore(5);
    setTimeOrientation(5);
    setActivityLevel('normal');
    setConcerns([]);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('alzheimerAnalysisNotes', JSON.stringify(updatedNotes));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleConcern = (concern: string) => {
    setConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  const filteredNotes = notes.filter(note =>
    (note.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
     note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (!filterTag || note.tags.includes(filterTag))
  );

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-500';
    if (score >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const activityLevels = {
    low: 'Baixo',
    normal: 'Normal',
    high: 'Alto'
  };

  const concerns_list = [
    'Perda de Memória',
    'Confusão',
    'Agitação',
    'Depressão',
    'Ansiedade'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Notas de Análise Cognitiva</h2>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="bg-gray-50 rounded-lg px-3 py-2 text-sm border-0 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todas as Categorias</option>
            {COGNITIVE_TAGS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar análises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm focus:outline-none w-40"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* New Analysis Form */}
        <div className="bg-purple-50 rounded-xl p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação Cognitiva (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={cognitiveScore}
                onChange={(e) => setCognitiveScore(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center font-medium">
                <span className={getScoreColor(cognitiveScore)}>{cognitiveScore}</span>/10
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orientação Temporal (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={timeOrientation}
                onChange={(e) => setTimeOrientation(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center font-medium">
                <span className={getScoreColor(timeOrientation)}>{timeOrientation}</span>/10
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Atividade
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-purple-100 focus:border-purple-300 focus:ring-0"
              >
                <option value="low">Baixo</option>
                <option value="normal">Normal</option>
                <option value="high">Alto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preocupações
              </label>
              <div className="flex flex-wrap gap-2">
                {concerns_list.map(concern => (
                  <button
                    key={concern}
                    onClick={() => toggleConcern(concern)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1
                      ${concerns.includes(concern)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {concern}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Adicione observações detalhadas..."
              className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-300 focus:ring-0 resize-none h-32 bg-white"
            />

            <div className="flex flex-wrap gap-2">
              {COGNITIVE_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1
                    ${selectedTags.includes(tag)
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-600'}`}
                >
                  <TagIcon className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>

            <button
              onClick={saveNote}
              disabled={!newNote.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              <span>Salvar Análise</span>
            </button>
          </div>
        </div>

        {/* Analysis List */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredNotes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {searchTerm || filterTag ? 'Nenhuma análise encontrada' : 'Nenhuma nota de análise ainda'}
              </p>
            ) : (
              filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-lg shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{note.timestamp}</span>
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className={getScoreColor(note.cognitiveScore)}>
                        {note.cognitiveScore}/10
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className={getScoreColor(note.timeOrientation)}>
                        {note.timeOrientation}/10
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span className="capitalize">{activityLevels[note.activityLevel as keyof typeof activityLevels]}</span>
                    </div>
                  </div>

                  {note.concerns.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.concerns.map(concern => (
                        <span
                          key={concern}
                          className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {concern}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-800">{note.notes}</p>

                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600 flex items-center gap-1"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}