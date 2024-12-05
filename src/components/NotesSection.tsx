import React, { useState, useEffect } from 'react';
import { PenLine, Save, Trash2, Clock, Search, Tag as TagIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
}

const PRESET_TAGS = [
  'Math', 'Physics', 'Chemistry', 'Biology',
  'History', 'Literature', 'Computer Science',
  'Languages', 'Geography', 'Economics'
];

export default function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState<string>('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('tutorNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      timestamp: new Date().toLocaleString(),
      tags: selectedTags,
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('tutorNotes', JSON.stringify(updatedNotes));
    setNewNote('');
    setSelectedTags([]);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('tutorNotes', JSON.stringify(updatedNotes));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filterTag || note.tags.includes(filterTag))
  );

  const getTagColor = (tag: string) => {
    const colors = {
      'Math': 'bg-blue-100 text-blue-600',
      'Physics': 'bg-purple-100 text-purple-600',
      'Chemistry': 'bg-green-100 text-green-600',
      'Biology': 'bg-yellow-100 text-yellow-600',
      'History': 'bg-red-100 text-red-600',
      'Literature': 'bg-pink-100 text-pink-600',
      'Computer Science': 'bg-indigo-100 text-indigo-600',
      'Languages': 'bg-orange-100 text-orange-600',
      'Geography': 'bg-teal-100 text-teal-600',
      'Economics': 'bg-cyan-100 text-cyan-600',
    };
    return colors[tag as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <div className="bg-purple-100 p-2 rounded-lg">
            <PenLine className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Study Notes</h2>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="bg-gray-50 rounded-lg px-3 py-2 text-sm border-0 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Subjects</option>
            {PRESET_TAGS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm focus:outline-none w-40"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* New Note Form */}
        <div className="bg-purple-50 rounded-xl p-4 space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Take notes during your session..."
            className="w-full p-3 rounded-lg border-2 border-purple-100 focus:border-purple-300 focus:ring-0 resize-none h-32 bg-white"
          />
          <div className="flex flex-wrap gap-2">
            {PRESET_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1
                  ${selectedTags.includes(tag) ? getTagColor(tag) : 'bg-gray-100 text-gray-600'}`}
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
            <span>Save Note</span>
          </button>
        </div>

        {/* Notes List */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence>
              {filteredNotes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {searchTerm || filterTag ? 'No matching notes found' : 'No notes yet'}
                </p>
              ) : (
                filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-3 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-800 mb-2">{note.content}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {note.tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getTagColor(tag)}`}
                          >
                            <TagIcon className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{note.timestamp}</span>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}