import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Send } from 'lucide-react';
import VoiceAssistant from './components/voice/VoiceAssistant';
import ChatMessage from './components/ChatMessage';
import AlzheimerAnalysisNotes from './components/AlzheimerAnalysisNotes';
import ConversationControls from './components/ConversationControls';
import HealthDashboard from './components/health/HealthDashboard';
import MedicalDashboard from './components/medical/MedicalDashboard';
import { getChatGPTResponse } from './utils/openai';
import type { NeurologicalAssessment } from './types/medical';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Olá! Sou seu assistente de inteligência artificial. Como posso ajudar hoje?", 
      isBot: true,
      timestamp: new Date().toLocaleString('pt-PT')
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [assessments, setAssessments] = useState<NeurologicalAssessment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessage: Message = {
      text,
      isBot: false,
      timestamp: new Date().toLocaleString('pt-PT')
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await getChatGPTResponse(text, messages);
      const botMessage: Message = {
        text: response,
        isBot: true,
        timestamp: new Date().toLocaleString('pt-PT')
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        text: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
        isBot: true,
        timestamp: new Date().toLocaleString('pt-PT')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceResult = (text: string) => {
    setInput(text);
    handleSend(text);
  };

  const handleAssessmentSubmit = (data: Omit<NeurologicalAssessment, 'id' | 'date'>) => {
    const newAssessment: NeurologicalAssessment = {
      ...data,
      id: Date.now().toString(),
      date: new Date(),
    };
    setAssessments(prev => [newAssessment, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <VoiceAssistant
        onSpeechResult={handleVoiceResult}
        isProcessing={isProcessing}
        lastBotMessage={messages[messages.length - 1]?.isBot ? messages[messages.length - 1].text : undefined}
      />

      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                SANA+ Sistema de Avaliação Neurológica do Alzheimer
              </h1>
            </div>
            <ConversationControls 
              messages={messages}
              cognitiveAnalysis={{
                timeOrientation: 8,
                speechCoherence: 7,
                memoryConsistency: 6,
                emotionalState: 'Estável',
                concerns: []
              }}
            />
          </div>
        </div>
      </header>

      <div className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-[144px] z-[5] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Faça uma pergunta..."
                className="w-full p-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm pr-12"
                disabled={isProcessing}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={isProcessing || !input.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white/80 rounded-lg border border-purple-100 h-[200px] overflow-y-auto p-4 space-y-4 mt-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message.text} isBot={message.isBot} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <MedicalDashboard
          assessments={assessments}
          onAssessmentSubmit={handleAssessmentSubmit}
        />
        <HealthDashboard />
        <AlzheimerAnalysisNotes />
      </main>
    </div>
  );
}

export default App;