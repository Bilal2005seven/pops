// null = no input box (dash in reference), number = editable value
export type CellValue = number | null;

export interface MillData {
  date: string;
  time: string;
  columns: string[];
  rows: {
    label: string;
    values: CellValue[];
  }[];
}

export const INITIAL_MILL_1: MillData = {
  date: '10/17/2026',
  time: '11:59:59 PM',
  columns: ['PPC', 'OPC', 'WRC', 'PCC'],
  rows: [
    { label: 'CLINKER W/F', values: [0.00, 0.00, 970.50, 0.00] },
    { label: 'GYPSUM W/F', values: [0.00, 0.00, 88.50, 0.00] },
    { label: 'PI/SLAG/\nFA WF', values: [0.00, 0.00, 492.10, 0.00] },
    { label: 'FLY ASH\nSFF', values: [0.00, null, 728.40, 0.00] },
    { label: 'TOTAL', values: [0.00, 0.00, 2279.50, 0.00] },
    { label: 'CM\nRunning\n(Hrs)', values: [0.00, 0.00, 24.00, 0.00] },
    { label: 'GRINDING\nAID Kg/H', values: [null, null, 580.22, null] },
    { label: 'CHEMICAL\nAID Kg/H', values: [null, null, null, null] },
  ],
};

export const INITIAL_MILL_2: MillData = {
  date: '10/17/2026',
  time: '11:59:59 PM',
  columns: ['PPC', 'OPC', 'WRC', 'PCC'],
  rows: [
    { label: 'CLINKER\nW/F', values: [0.00, 0.00, 0.00, 946.20] },
    { label: 'GYPSUM\nW/F', values: [0.00, 0.00, 0.00, 84.00] },
    { label: 'PI/SLAG/\nFA WF', values: [0.00, 0.00, 0.00, 469.42] },
    { label: 'FLY ASH\nSFF', values: [0.00, null, 0.00, 698.50] },
    { label: 'TOTAL', values: [0.00, 0.00, 0.00, 2198.12] },
    { label: 'CM\nRunning\n(Hrs)', values: [0.00, 0.00, 0.00, 24.00] },
    { label: 'GRINDING\nAID Kg/H', values: [null, null, 0.00, null] },
    { label: 'CHEMICAL\nAID Kg/H', values: [null, null, null, null] },
  ],
};

export const INITIAL_MILL_3: MillData = {
  date: '10/17/2026',
  time: '11:59:59 PM',
  columns: ['PPC', 'PCC'],
  rows: [
    { label: 'CLINKER\nW/F', values: [0.00, 894.00] },
    { label: 'GYPSUM\nW/F', values: [0.00, 82.10] },
    { label: 'PI/SLAG/\nFA WF', values: [0.00, 452.78] },
    { label: 'FLY ASH\nSFF', values: [0.00, 671.20] },
    { label: 'TOTAL', values: [0.00, 2100.08] },
    { label: 'CM\nRunning\n(Hrs)', values: [0.00, 24.00] },
    { label: 'GRINDING\nAID Kg/H', values: [null, null] },
    { label: 'CHEMICAL\nAID Kg/H', values: [null, null] },
  ],
};

export function getInitialData() {
  return {
    mill1: structuredClone(INITIAL_MILL_1),
    mill2: structuredClone(INITIAL_MILL_2),
    mill3: structuredClone(INITIAL_MILL_3),
  };
}
