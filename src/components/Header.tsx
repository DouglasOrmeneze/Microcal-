import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="w-full mb-6 bg-white p-6 rounded-3xl shadow-sm border-b-4 border-indigo-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
      <div>
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider mb-2 shadow-xs"
          id="badge-creator"
        >
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Desenvolvido por Douglas Ormeneze</span>
        </motion.div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight leading-none uppercase" id="main-title">
          Calculadora de Resistor µA
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1.5" id="main-subtitle">
          Calcule o resistor ideal usando voltagem e microampere.
        </p>
      </div>
      
      <div className="md:text-right border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 w-full md:w-auto flex md:flex-col justify-between items-center md:items-end">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Organização Criadora</span>
        <div className="text-lg sm:text-xl font-black text-teal-500 uppercase tracking-tight" id="org-brand">
          Oz Hidrogênio
        </div>
      </div>
    </header>
  );
}
