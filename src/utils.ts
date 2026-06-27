/**
 * Utility functions and data for Calculadora de Resistor µA
 */

export interface CalculationResult {
  voltage: number; // in Volts (V)
  current: number; // in microamperes (µA)
  resistanceKiloOhms: number; // in kΩ
  resistanceOhms: number; // in Ω
  resistanceMegaOhms: number; // in MΩ
  stepVoltageTimes1000: number; // V * 1000
  stepDivisionResult: number; // (V * 1000) / µA
  formattedK: string;
  formattedOhm: string;
  formattedM: string;
}

/**
 * Parses a string representation of a number, accepting both dot '.' and comma ',' as decimal separators.
 */
export function parseLocalFloat(value: string): number {
  if (!value) return NaN;
  const normalized = value.trim().replace(',', '.');
  return parseFloat(normalized);
}

/**
 * Formats a number to Brazilian standard (comma for decimal, dot for thousands)
 */
export function formatLocalNumber(value: number, maxDecimals: number = 3): string {
  if (isNaN(value)) return '0';
  
  // Custom formatting for neat electrical symbols
  return value.toLocaleString('pt-BR', {
    maximumFractionDigits: maxDecimals,
  });
}

/**
 * Performs the main resistor calculation: R(kΩ) = V * 1000 / µA
 */
export function calculateResistor(voltageStr: string, currentStr: string): { error?: string; result?: CalculationResult } {
  const voltage = parseLocalFloat(voltageStr);
  const current = parseLocalFloat(currentStr);

  // Validation checks
  if (!voltageStr.trim()) {
    return { error: 'Digite a voltagem.' };
  }
  if (isNaN(voltage) || voltage <= 0) {
    return { error: 'A voltagem precisa ser maior que zero.' };
  }

  if (!currentStr.trim()) {
    return { error: 'Digite a corrente em microampere.' };
  }
  if (isNaN(current)) {
    return { error: 'A corrente precisa ser um número válido.' };
  }
  if (current === 0) {
    return { error: 'A corrente precisa ser maior que zero.' };
  }
  if (current < 0) {
    return { error: 'A corrente precisa ser maior que zero.' };
  }

  const stepVoltageTimes1000 = voltage * 1000;
  const resistanceKiloOhms = stepVoltageTimes1000 / current;
  const resistanceOhms = resistanceKiloOhms * 1000;
  const resistanceMegaOhms = resistanceKiloOhms / 1000;

  // Formatting results for native PT-BR user experience
  const formattedK = formatLocalNumber(resistanceKiloOhms, 3);
  const formattedOhm = formatLocalNumber(resistanceOhms, 0);
  const formattedM = formatLocalNumber(resistanceMegaOhms, 6);

  return {
    result: {
      voltage,
      current,
      resistanceKiloOhms,
      resistanceOhms,
      resistanceMegaOhms,
      stepVoltageTimes1000,
      stepDivisionResult: resistanceKiloOhms,
      formattedK,
      formattedOhm,
      formattedM,
    }
  };
}

// Preset values for quick-click buttons
export const VOLTAGE_PRESETS = [
  { label: '1,5 V', value: '1.5' },
  { label: '3 V', value: '3' },
  { label: '5 V', value: '5' },
  { label: '9 V', value: '9' },
  { label: '12 V', value: '12' },
];

export const CURRENT_PRESETS = [
  { label: '10 µA', value: '10' },
  { label: '50 µA', value: '50' },
  { label: '100 µA', value: '100' },
  { label: '200 µA', value: '200' },
  { label: '500 µA', value: '500' },
];

// Interactive examples
export interface QuickExample {
  voltage: string;
  current: string;
  voltageLabel: string;
  currentLabel: string;
  resultLabel: string;
}

export const QUICK_EXAMPLES: QuickExample[] = [
  { voltage: '1.5', current: '100', voltageLabel: '1,5V', currentLabel: '100 µA', resultLabel: '15 kΩ' },
  { voltage: '3', current: '100', voltageLabel: '3V', currentLabel: '100 µA', resultLabel: '30 kΩ' },
  { voltage: '5', current: '100', voltageLabel: '5V', currentLabel: '100 µA', resultLabel: '50 kΩ' },
  { voltage: '12', current: '100', voltageLabel: '12V', currentLabel: '100 µA', resultLabel: '120 kΩ' },
];
