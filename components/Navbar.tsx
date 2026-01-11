import React from 'react';
import { Download, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md fixed top-0 z-50 flex items-center justify-between px-6 lg:px-12">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-lg">
          <Download className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          StreamSage
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <a href="#" className="hover:text-cyan-400 transition-colors">Supported Sites</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">How to Use</a>
        <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI Features
        </a>
      </div>

      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-full border border-slate-700 transition-all">
        Sign In
      </button>
    </nav>
  );
};

export default Navbar;
