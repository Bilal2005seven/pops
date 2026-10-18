import React, { useState, useRef, useEffect, useCallback } from 'react';
import MillTable from './components/MillTable';
import HmiNavbar from './components/HmiNavbar';
import { getInitialData } from './data/initialData';
import type { MillData, CellValue } from './data/initialData';
import { exportPng, exportJpg, exportPdf } from './utils/exportUtils';
import './App.css';

const STORAGE_KEY = 'cement-mills-counters-data';

interface AllMillData {
  mill1: MillData;
  mill2: MillData;
  mill3: MillData;
}

function loadFromStorage(): AllMillData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as AllMillData;
    }
  } catch {
    // Corrupted data, ignore
  }
  return null;
}

function saveToStorage(data: AllMillData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

const App: React.FC = () => {
  const [data, setData] = useState<AllMillData>(() => {
    return loadFromStorage() || getInitialData();
  });

  const dashboardRef = useRef<HTMLDivElement>(null);

  // Save to localStorage on every change
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const updateMill = useCallback(
    (millKey: 'mill1' | 'mill2' | 'mill3') =>
      (rowIndex: number, colIndex: number, value: CellValue) => {
        setData((prev) => {
          const mill = structuredClone(prev[millKey]);
          mill.rows[rowIndex].values[colIndex] = value;
          return { ...prev, [millKey]: mill };
        });
      },
    []
  );

  const updateDate = useCallback(
    (millKey: 'mill1' | 'mill2' | 'mill3') => (date: string) => {
      setData((prev) => ({
        ...prev,
        [millKey]: { ...prev[millKey], date },
      }));
    },
    []
  );

  const updateTime = useCallback(
    (millKey: 'mill1' | 'mill2' | 'mill3') => (time: string) => {
      setData((prev) => ({
        ...prev,
        [millKey]: { ...prev[millKey], time },
      }));
    },
    []
  );

  const handleReset = () => {
    if (window.confirm('Reset all values to the original reference data?')) {
      const initial = getInitialData();
      setData(initial);
      saveToStorage(initial);
    }
  };

  const handleExportPng = () => {
    if (dashboardRef.current) exportPng(dashboardRef.current);
  };

  const handleExportJpg = () => {
    if (dashboardRef.current) exportJpg(dashboardRef.current);
  };

  const handleExportPdf = () => {
    if (dashboardRef.current) exportPdf(dashboardRef.current);
  };

  return (
    <div className="app-root">
      {/* Control bar - outside the exported dashboard */}
      <div className="control-bar">
        <button className="ctrl-btn" onClick={handleExportPng} title="Download PNG">
          ⬇ PNG
        </button>
        <button className="ctrl-btn" onClick={handleExportJpg} title="Download JPG">
          ⬇ JPG
        </button>
        <button className="ctrl-btn" onClick={handleExportPdf} title="Export PDF">
          ⬇ PDF
        </button>
        <button className="ctrl-btn ctrl-btn-reset" onClick={handleReset} title="Reset to reference values">
          ↺ Reset
        </button>
      </div>

      {/* HMI Screen Display (Navbar + Dashboard) - this is what gets exported */}
      <div className="hmi-screen-container" ref={dashboardRef} id="dashboard">
        <HmiNavbar />

        <div className="dashboard">
          <h1 className="dashboard-title">CEMENT MILLS COUNTERS</h1>

          <div className="mills-row">
            <MillTable
              title="CEMENT MILL - 1"
              data={data.mill1}
              onCellChange={updateMill('mill1')}
              onDateChange={updateDate('mill1')}
              onTimeChange={updateTime('mill1')}
            />

            <MillTable
              title="CEMENT MILL - 2"
              data={data.mill2}
              onCellChange={updateMill('mill2')}
              onDateChange={updateDate('mill2')}
              onTimeChange={updateTime('mill2')}
            />

            <MillTable
              title="CEMENT MILL - 3"
              data={data.mill3}
              onCellChange={updateMill('mill3')}
              onDateChange={updateDate('mill3')}
              onTimeChange={updateTime('mill3')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
