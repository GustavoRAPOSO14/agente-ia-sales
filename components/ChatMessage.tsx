import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Bot, User, ExternalLink, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const hasGrounding = message.groundingMetadata?.groundingChunks && message.groundingMetadata.groundingChunks.length > 0;

  // Filter out chunks that don't have web titles/uris valid
  const uniqueSources = message.groundingMetadata?.groundingChunks?.filter(
    (chunk, index, self) =>
      chunk.web?.uri &&
      chunk.web?.title &&
      index === self.findIndex((c) => c.web?.uri === chunk.web?.uri)
  );

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-slate-800 text-white' : 'bg-indigo-100 text-indigo-600'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isUser
              ? 'bg-slate-800 text-white rounded-tr-none'
              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
          } ${message.isError ? 'border-red-200 bg-red-50 text-red-800' : ''}`}
        >
          {message.isError && <AlertCircle className="w-4 h-4 inline-block mr-2 -mt-0.5" />}
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => <a {...props} className="text-indigo-500 hover:underline font-medium" target="_blank" rel="noopener noreferrer" />,
                ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-slate-900" />,
                p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sources / Grounding Chips */}
        {!isUser && hasGrounding && uniqueSources && uniqueSources.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-xl p-3 w-full animate-fadeIn mt-1">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 pl-1">Fontes & Ofertas Encontradas</p>
            <div className="flex flex-wrap gap-2">
              {uniqueSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.web?.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-700 transition-all truncate max-w-[200px]"
                  title={source.web?.title}
                >
                  <ExternalLink size={10} />
                  <span className="truncate">{source.web?.title || "Fonte da web"}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        <span className="text-[10px] text-slate-400 px-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};