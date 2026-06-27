import { Activity, Battery, ChevronRight, Info, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {
  calculateResistor,
  CalculationResult,
  CURRENT_PRESETS,
  VOLTAGE_PRESETS
} from '../utils';
import ResultDisplay from './ResultDisplay';

// Import images for data entry and result
import imageEntrada from '../assets/imagem-entrada.png';
import imageResultado from '../assets/imagem-resultado.png';

const formatResistorValue = (resK: number) => {
  if (resK >= 1000) {
    const resM = resK / 1000;
    return `${resM.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} MΩ`;
  } else if (resK < 0.1) {
    const resOhm = resK * 1000;
    return `${resOhm.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} Ω`;
  } else {
    return `${resK.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kΩ`;
  }
};

const parseExampleCurrent = (val: string) => {
  const cleanVal = val.trim().replace(',', '.');
  if (!cleanVal) {
    return { error: 'Digite uma microcorrente para ver os exemplos.' };
  }
  const parsed = parseFloat(cleanVal);
  if (isNaN(parsed)) {
    return { error: 'A microcorrente precisa ser um número válido.' };
  }
  if (parsed <= 0) {
    return { error: 'A microcorrente precisa ser maior que zero.' };
  }
  return { parsed, error: null };
};

interface CalculatorProps {
  onCalculateSuccess: (res: CalculationResult | null) => void;
}

export default function Calculator({ onCalculateSuccess }: CalculatorProps) {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [currentImage, setCurrentImage] = useState<'entrada' | 'resultado'>('entrada');
  const [exampleCurrent, setExampleCurrent] = useState('100');

  const handleCalculate = (v: string = voltage, c: string = current) => {
    setError(null);
    const calculation = calculateResistor(v, c);
    if (calculation.error) {
      setError(calculation.error);
      setResult(null);
      setCurrentImage('entrada');
      onCalculateSuccess(null);
    } else if (calculation.result) {
      setResult(calculation.result);
      setCurrentImage('resultado');
      onCalculateSuccess(calculation.result);
    }
  };

  const handleClear = () => {
    setVoltage('');
    setCurrent('');
    setError(null);
    setResult(null);
    setCurrentImage('entrada');
    onCalculateSuccess(null);
  };

  const selectVoltagePreset = (val: string) => {
    const displayVal = val.replace('.', ',');
    setVoltage(displayVal);
    setCurrentImage('entrada');
    setError(null);
    if (current) {
      handleCalculate(displayVal, current);
    }
  };

  const selectCurrentPreset = (val: string) => {
    setCurrent(val);
    setCurrentImage('entrada');
    setError(null);
    if (voltage) {
      handleCalculate(voltage, val);
    }
  };

  const parsedExample = parseExampleCurrent(exampleCurrent);
  const exampleVoltages = [1.5, 3, 5, 9, 12];

  return (
    <div className="w-full" id="calculator-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Inputs, Controls & Dynamic Image */}
        <section className="col-span-1 lg:col-span-6 flex flex-col space-y-6">
          
          {/* Formula Highlight */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-600 p-4 rounded-2xl text-white flex items-center justify-center gap-3 shadow-lg"
            id="formula-highlight"
          >
            <span className="text-[10px] font-black uppercase opacity-75 tracking-wider bg-indigo-700 px-2 py-0.5 rounded">Fórmula</span>
            <span className="text-xl sm:text-2xl font-mono font-black tracking-tight">R(kΩ) = V × 1000 ÷ µA</span>
          </motion.div>

          {/* Sub-grid for Inputs and Image side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch flex-grow">
            
            {/* Input Card */}
            <div className="col-span-1 sm:col-span-7 bg-white p-6 rounded-3xl shadow-lg border-2 border-indigo-100 flex flex-col justify-between">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCalculate();
                }}
                className="space-y-6 flex-grow flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Voltage Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wide">
                      Voltagem da fonte ou bateria (V)
                    </label>
                    
                    <div className="relative">
                      <input
                        type="text"
                        value={voltage}
                        onChange={(e) => {
                          setVoltage(e.target.value);
                          setCurrentImage('entrada');
                          setError(null);
                        }}
                        placeholder="Ex: 1,5"
                        className="w-full text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-teal-400 focus:bg-white focus:outline-none text-indigo-600 transition-all"
                        id="voltage-input"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">
                        Volts
                      </span>
                    </div>

                    {/* Voltage Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {VOLTAGE_PRESETS.map((preset) => {
                        const isActive = voltage.replace(',', '.') === preset.value;
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => selectVoltagePreset(preset.value)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-xs scale-105'
                                : 'bg-slate-100 hover:bg-indigo-100 text-slate-600'
                            }`}
                            id={`preset-v-${preset.value}`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wide">
                      Corrente desejada em µA (Microamperes)
                    </label>
                    
                    <div className="relative">
                      <input
                        type="text"
                        value={current}
                        onChange={(e) => {
                          setCurrent(e.target.value);
                          setCurrentImage('entrada');
                          setError(null);
                        }}
                        placeholder="Ex: 100"
                        className="w-full text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-teal-400 focus:bg-white focus:outline-none text-indigo-600 transition-all"
                        id="current-input"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        µA
                      </span>
                    </div>

                    {/* Current Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {CURRENT_PRESETS.map((preset) => {
                        const isActive = current === preset.value;
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => selectCurrentPreset(preset.value)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-teal-600 text-white shadow-xs scale-105'
                                : 'bg-slate-100 hover:bg-teal-100 text-slate-600'
                            }`}
                            id={`preset-c-${preset.value}`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Error Banner */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-100 text-rose-600 font-bold text-xs flex items-center gap-2"
                      id="error-banner"
                    >
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                        !
                      </span>
                      <span>{error}</span>
                    </motion.div>
                  )}
                </div>

                {/* Calculate Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-base py-4 rounded-2xl shadow-[0_6px_0_rgb(217,119,6)] active:translate-y-1 active:shadow-none transition-all cursor-pointer border-none uppercase tracking-wide flex items-center justify-center gap-2 mt-4"
                  id="calculate-btn"
                >
                  <Activity className="w-4 h-4 text-slate-900" />
                  <span>Calcular resistor</span>
                </motion.button>
              </form>
            </div>

            {/* Image Card */}
            <div className="col-span-1 sm:col-span-5 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-3xl shadow-lg border-2 border-indigo-100 relative overflow-hidden min-h-[260px] sm:min-h-0">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400" />
              
              <AnimatePresence mode="wait">
                {currentImage === 'entrada' ? (
                  <motion.div
                    key="entrada"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center space-y-3 text-center"
                  >
                    <img
                      src={imageEntrada}
                      alt="Ilustração de entrada de dados da calculadora"
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-2xl shadow-sm bg-white p-1"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">
                        Aguardando dados
                      </span>
                      <p className="text-[10px] text-slate-400 max-w-[140px] leading-snug mx-auto font-medium">
                        Insira a voltagem e a corrente ao lado!
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="resultado"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center space-y-3 text-center"
                  >
                    <img
                      src={imageResultado}
                      alt="Ilustração de resultado do cálculo do resistor"
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-2xl shadow-sm bg-white p-1"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest block animate-pulse">
                        Cálculo Concluído!
                      </span>
                      <p className="text-[10px] text-teal-700/80 max-w-[140px] leading-snug mx-auto font-bold">
                        Resistor calculado com sucesso!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* Right Column: Results & Education */}
        <section className="col-span-1 lg:col-span-6 flex flex-col space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" className="flex flex-col flex-grow">
                <ResultDisplay result={result} onClear={handleClear} />
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-3xl p-8 shadow-xl border-b-8 border-teal-500 flex flex-col justify-center items-center flex-grow min-h-[300px] relative overflow-hidden"
                id="results-container-waiting"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full opacity-50"></div>
                
                <div className="text-slate-300 text-center flex flex-col items-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <p className="font-bold text-slate-500 text-base">Aguardando cálculo...</p>
                  <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed font-medium">
                    Preencha a voltagem e a corrente ao lado e aperte o botão de cálculo para descobrir o resistor ideal!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section: Exemplos por microcorrente */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-purple-100 space-y-6" id="examples-by-current-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-100 text-purple-600 text-xs">
                    💡
                  </span>
                  Exemplos por microcorrente
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Compare o resistor ideal para várias voltagens de uma vez
                </p>
              </div>
              
              {/* Microcurrent Input for Examples */}
              <div className="space-y-1 shrink-0 w-full sm:w-48">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Microcorrente desejada para os exemplos
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={exampleCurrent}
                    onChange={(e) => setExampleCurrent(e.target.value)}
                    placeholder="Ex: 100"
                    className="w-full text-base font-bold bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 focus:border-purple-400 focus:bg-white focus:outline-none text-purple-600 transition-all"
                    id="example-current-input"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    µA
                  </span>
                </div>
              </div>
            </div>

            {/* Content of Examples */}
            {parsedExample.error ? (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-100 text-amber-700 font-semibold text-xs flex items-center gap-2" id="example-error-box">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                  !
                </span>
                <span>{parsedExample.error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 inline-block">
                  <span>Microcorrente escolhida:</span>
                  <span className="text-purple-600 font-black text-sm">{exampleCurrent} µA</span>
                </div>

                {/* Table Layout */}
                <div className="overflow-hidden border-2 border-slate-100 rounded-2xl shadow-xs" id="examples-table-container">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-500 font-black uppercase tracking-wider text-[10px] border-b-2 border-slate-100">
                        <th className="p-3 pl-4">Voltagem</th>
                        <th className="p-3">Conta (V × 1000 ÷ µA)</th>
                        <th className="p-3 pr-4 text-right">Resistor ideal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {exampleVoltages.map((v) => {
                        const numerator = v * 1000;
                        const resK = numerator / (parsedExample.parsed || 1);
                        const displayRes = formatResistorValue(resK);
                        
                        // Choose tag color based on voltage
                        let tagBg = 'bg-cyan-50 text-cyan-700 border border-cyan-100';
                        if (v === 1.5) tagBg = 'bg-cyan-50 text-cyan-700 border border-cyan-100';
                        else if (v === 3) tagBg = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                        else if (v === 5) tagBg = 'bg-teal-50 text-teal-700 border border-teal-100';
                        else if (v === 9) tagBg = 'bg-purple-50 text-purple-700 border border-purple-100';
                        else if (v === 12) tagBg = 'bg-rose-50 text-rose-700 border border-rose-100';

                        return (
                          <tr key={v} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 pl-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${tagBg}`}>
                                {v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}V
                              </span>
                            </td>
                            <td className="p-3 font-mono text-xs text-slate-500">
                              {numerator.toLocaleString('pt-BR')} ÷ {exampleCurrent}
                            </td>
                            <td className="p-3 pr-4 text-right font-black text-purple-600 font-mono text-sm sm:text-base">
                              {displayRes}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Didactic explanation */}
                <div className="bg-purple-50/50 border border-purple-100/80 p-4 rounded-2xl" id="examples-didactic-box">
                  <p className="text-xs leading-relaxed text-purple-950 font-medium">
                    <span className="font-black text-purple-800 block mb-1">💡 Como funciona:</span>
                    Usamos o mesmo macete: pega a voltagem, coloca três zeros e divide pela microcorrente escolhida. O resultado já sai em kΩ.
                  </p>
                </div>
              </div>
            )}

            {/* Educational Warning */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                !
              </span>
              <div>
                <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-0.5">Aviso Educativo</h4>
                <p className="text-[11px] leading-relaxed text-amber-800 font-semibold">
                  Este cálculo é teórico e serve para circuitos de baixa tensão. Em aplicações reais, escolha o resistor comercial mais próximo e confira com um multímetro.
                </p>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
