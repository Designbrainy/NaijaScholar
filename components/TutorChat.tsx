import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, TutorPersonality } from '../types';
import { TUTOR_PERSONALITY_PROMPTS } from '../constants';
import { getTutorResponse } from '../services/geminiService';
import Spinner from './Spinner';
import { SendIcon, AudioIcon } from './icons';

const TutorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState<TutorPersonality>(TutorPersonality.Friendly);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetChat = useCallback(() => {
    let greeting = '';
    if (personality === TutorPersonality.Friendly) {
      greeting = "Hi there! I'm your friendly AI tutor. What topic can I help you with today? E.g., 'Explain photosynthesis' or 'Help me with simultaneous equations'.";
    } else if (personality === TutorPersonality.Strict) {
      greeting = "I am your AI tutor. State the subject and topic you wish to study. Let's begin.";
    } else {
      greeting = "Welcome! You're on the path to success. What challenge can we conquer together today?";
    }
    setMessages([{ sender: 'ai', text: greeting }]);
  }, [personality]);

  useEffect(() => {
    resetChat();
  }, [resetChat]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    const currentInput = input;
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    const systemInstruction = TUTOR_PERSONALITY_PROMPTS[personality];
    const aiResponseText = await getTutorResponse(currentMessages, currentInput, systemInstruction);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handlePersonalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPersonality(e.target.value as TutorPersonality);
  };

  const handleAudioPlayback = (text: string) => {
    alert('Audio playback feature is currently in development.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="p-2 bg-white rounded-lg shadow-sm border border-brand-gray-100 flex items-center justify-between gap-4 mb-4">
        <label htmlFor="personality" className="text-sm font-medium text-brand-gray-600 whitespace-nowrap">Tutor Mode:</label>
        <select
          id="personality"
          value={personality}
          onChange={handlePersonalityChange}
          className="w-full bg-brand-gray-100 border-brand-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-brand-green focus:border-brand-green"
        >
          <option value={TutorPersonality.Friendly}>😊 Friendly</option>
          <option value={TutorPersonality.Strict}>🧐 Strict</option>
          <option value={TutorPersonality.Motivational}>🔥 Motivational</option>
        </select>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 p-4 bg-white rounded-lg shadow-inner border border-brand-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                AI
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-brand-green text-white rounded-br-lg'
                  : 'bg-brand-gray-100 text-brand-gray-800 rounded-bl-lg'
              }`}
            >
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
               {msg.sender === 'ai' && index > 0 && (
                <button
                    onClick={() => handleAudioPlayback(msg.text)}
                    className="mt-2 text-brand-gray-500 hover:text-brand-green flex items-center gap-1 text-xs"
                >
                    <AudioIcon/> Read Aloud
                </button>
               )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    AI
                </div>
                <div className="bg-brand-gray-100 p-3 rounded-2xl rounded-bl-lg">
                    <Spinner size="sm" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="w-full p-3 border border-brand-gray-300 rounded-full focus:ring-2 focus:ring-brand-green focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || input.trim() === ''}
          className="bg-brand-green text-white p-3 rounded-full disabled:bg-brand-gray-300 disabled:cursor-not-allowed hover:bg-brand-green-dark transition-colors"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default TutorChat;
