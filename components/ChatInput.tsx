import React, { useState, KeyboardEvent } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span className="text-slate-400">✨</span>
      </div>
      <input
        type="text"
        className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-4 pr-12 shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        placeholder="Encontre o melhor preço para..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="absolute inset-y-2 right-2 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full w-10 h-10 transition-colors shadow-sm"
      >
        {disabled ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <SendHorizontal size={18} className="ml-0.5" />
        )}
      </button>
    </div>
  );
};