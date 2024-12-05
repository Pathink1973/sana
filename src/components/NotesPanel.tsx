import React, { useState, useEffect } from 'react';
import { PenLine, Save, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface Note {
  id: string;
  content: string;
  timestamp: string;
}

export default function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
    };

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem('tutorNotes', JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('tutorNotes', JSON.stringify(updatedNotes));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-l-lg shadow-lg hover:bg-purple-600 transition-colors"
      >
        {isPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isPanelOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto"
      >
        <div className="flex items-center space-x-2 mb-4">
          <PenLine className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-800">Study Notes</h2>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Take notes during your session..."
              className="flex-1 p-2 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={saveNote}
            disabled={!newNote.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            <span>Save Note</span>
          </button>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Notes</h3>
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-800 mb-2">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{note.timestamp}</span>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}