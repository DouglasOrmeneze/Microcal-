import { useState } from 'react';
import { motion } from 'motion/react';
import Header from './components/Header';
import Calculator from './components/Calculator';
import Footer from './components/Footer';
import { CalculationResult } from './utils';

export default function App() {
  const [hasResult, setHasResult] = useState(false);

  const handleCalculateSuccess = (result: CalculationResult | null) => {
    setHasResult(!!result);
  };

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 font-sans flex flex-col items-center justify-start overflow-x-hidden selection:bg-indigo-200">
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 z-10 flex flex-col">
        
        {/* Render Header */}
        <Header />

        {/* Render Main Interactive Calculator */}
        <Calculator onCalculateSuccess={handleCalculateSuccess} />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
