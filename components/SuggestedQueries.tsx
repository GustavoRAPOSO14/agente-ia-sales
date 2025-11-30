import React from 'react';
import { Tag, TrendingUp, Smartphone, Shirt } from 'lucide-react';

interface SuggestedQueriesProps {
  onSelectQuery: (query: string) => void;
}

export const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ onSelectQuery }) => {
  const suggestions = [
    { icon: <TrendingUp size={14} />, text: "Promoções de iPhone hoje", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { icon: <Smartphone size={14} />, text: "Melhor celular até R$ 2000", color: "bg-green-50 text-green-600 hover:bg-green-100" },
    { icon: <Tag size={14} />, text: "Ofertas de Notebook Gamer", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
    { icon: <Shirt size={14} />, text: "Tênis de corrida em promoção", color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSelectQuery(s.text)}
          className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-transparent transition-colors whitespace-nowrap ${s.color}`}
        >
          {s.icon}
          {s.text}
        </button>
      ))}
    </div>
  );
};