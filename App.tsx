import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { SuggestedQueries } from './components/SuggestedQueries';
import { sendMessageToAgent } from './services/geminiService';
import { Message, LoadingState } from './types';
import { ShoppingBag, Sparkles } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Olá! Eu sou o SmartShopper AI. 🛍️\n\nEstou conectado ao Google Search em tempo real. Posso ajudar você a encontrar:\n\n* 🔥 As melhores promoções do dia\n* 📱 Comparativos de preços de eletrônicos\n* 👗 Tendências de moda com link de compra\n* 🎁 Ideias de presentes dentro do seu orçamento\n\nO que você gostaria de comprar hoje?",
      timestamp: new Date()
    }
  ]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setLoadingState('loading');

    try {
      // Get conversation history for context, excluding the latest message we just added manually
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendMessageToAgent(text, history);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        groundingMetadata: response.groundingMetadata,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Desculpe, tive um problema ao buscar essas informações. Por favor, tente novamente.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoadingState('idle');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <Header />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 max-w-5xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <ShoppingBag size={64} className="mb-4 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-700">Comece suas compras inteligentes</h2>
            <p className="text-slate-500 max-w-md mt-2">
              Pesquise produtos, compare preços e encontre ofertas reais da web.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {loadingState === 'loading' && (
              <div className="flex items-start gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-indigo-600" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-100 space-y-2 w-64">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
           {messages.length < 3 && (
            <SuggestedQueries onSelectQuery={handleSendMessage} />
          )}
          <ChatInput onSend={handleSendMessage} disabled={loadingState === 'loading'} />
          <p className="text-xs text-center text-slate-400">
            O SmartShopper usa IA e pode cometer erros. Sempre verifique os preços nos sites das lojas.
          </p>
        </div>
      </div>
    </div>
  );
}