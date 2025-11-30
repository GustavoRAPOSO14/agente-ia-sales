import React from 'react';
import { ShoppingCart, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ShoppingCart className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">SmartShopper AI</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer transition-colors">
                <Search size={16} />
                Busca em tempo real
            </span>
        </div>
      </div>
    </header>
  );
};