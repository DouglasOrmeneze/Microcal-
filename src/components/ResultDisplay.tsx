import { Check, Copy, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { CalculationResult, formatLocalNumber } from '../utils';

interface ResultDisplayProps {
  result: CalculationResult;
  onClear: () => void;
}

export default function ResultDisplay({ result, onClear }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Cálculo de Resistor: V = ${formatLocalNumber(result.voltage)}V | I = ${formatLocalNumber(result.current)}µA => Resistor: ${result.formattedK} kΩ (${result.formattedOhm} Ω)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-b-8 border-teal-500 flex flex-col justify-center items-center flex-grow relative overflow-hidden"
      id="results-container"
    >
      {/* Decorative Background Circle */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full opacity-50 pointer-events-none"></div>

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handleCopy}
          className="p-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Copiar resultado"
          id="copy-result-btn"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
        <button
          onClick={onClear}
          className="p-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-500 hover:text-rose-600 transition-all flex items-center gap-1.5 text-xs font-bold"
          id="clear-result-btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      <div className="w-full text-center mt-4">
        <span className="text-xs font-black text-teal-600 uppercase tracking-widest block mb-1">
          Resistor Ideal
        </span>
        
        <div id="mainResValue" className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 my-4 tracking-tight leading-none">
          {result.formattedK} <span className="text-3xl sm:text-4xl text-indigo-600 font-extrabold">kΩ</span>
        </div>

        {/* Ohms / Megaohms equivalents */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-center min-w-[120px]">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Em Ohms</span>
            <span id="ohmValue" className="text-base sm:text-lg font-bold text-slate-700">{result.formattedOhm} Ω</span>
          </div>
          
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-center min-w-[120px]">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Em Megohms</span>
            <span id="megaOhmValue" className="text-base sm:text-lg font-bold text-slate-700">{result.formattedM} MΩ</span>
          </div>
        </div>

        {/* Step-by-Step Breakdown */}
        <div className="mt-8 p-4 bg-indigo-50/70 rounded-2xl text-left inline-block w-full max-w-md border border-indigo-100">
          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-2">Como chegamos aqui?</h4>
          <div className="space-y-1.5 font-mono text-xs sm:text-sm text-indigo-900 font-medium">
            <p id="step1">• {formatLocalNumber(result.voltage)}V vira {formatLocalNumber(result.stepVoltageTimes1000)}</p>
            <p id="step2">• {formatLocalNumber(result.stepVoltageTimes1000)} ÷ {formatLocalNumber(result.current)} µA = {result.formattedK}</p>
            <p id="step3" className="font-bold text-indigo-950">• Resultado: {result.formattedK} kΩ</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
