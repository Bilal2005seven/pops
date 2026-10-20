import React, { useState, useRef, useEffect, useCallback } from 'react';
import MillTable from './components/MillTable';
import HmiNavbar from './components/HmiNavbar';
import { getInitialData, INITIAL_NAVBAR_DATA } from './data/initialData';
import type { MillData, CellValue, NavbarData } from './data/initialData';
import { exportPng, exportJpg, exportPdf, exportExcel } from './utils/exportUtils';
import './App.css';

const STORAGE_KEY = 'cement-mills-counters-data';

interface AllMillData {
  navbar: NavbarData;
  mill1: MillData;
  mill2: MillData;
  mill3: MillData;
}

function loadFromStorage(): AllMillData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.mill1 && parsed.mill2 && parsed.mill3) {
        return {
          navbar: parsed.navbar
            ? { ...INITIAL_NAVBAR_DATA, ...parsed.navbar }
            : structuredClone(INITIAL_NAVBAR_DATA),
          mill1: parsed.mill1,
          mill2: parsed.mill2,
          mill3: parsed.mill3,
        };
      }
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
  const dataRef = useRef(data);

  // Save to localStorage and keep dataRef synchronized
  useEffect(() => {
    dataRef.current = data;
    saveToStorage(data);
  }, [data]);

  const updateNavbar = useCallback(
    (field: keyof NavbarData, value: string) => {
      setData((prev) => {
        const next = {
          ...prev,
          navbar: { ...prev.navbar, [field]: value },
        };
        dataRef.current = next;
        return next;
      });
    },
    []
  );

  const updateMill = useCallback(
    (millKey: 'mill1' | 'mill2' | 'mill3') =>
      (rowIndex: number, colIndex: number, value: CellValue) => {
        setData((prev) => {
          const mill = structuredClone(prev[millKey]);
          mill.rows[rowIndex].values[colIndex] = value;
          const next = { ...prev, [millKey]: mill };
          dataRef.current = next;
          return next;
        });
      },
    []
  );

  const updateDate = useCallback(
    (millKey: 'mill1' | 'mill2' | 'mill3') => (date: string) => {
      setData((prev) => {
        const next = {
          ...prev,
          [millKey]: { ...prev[millKey], date },
        };
        dataRef.current = next;
        return next;
      });
    },
    []
  );

  const updateTime = useCallback(
    (millKey: 'mill1' | 'mill2' | 'mill3') => (time: string) => {
      setData((prev) => {
        const next = {
          ...prev,
          [millKey]: { ...prev[millKey], time },
        };
        dataRef.current = next;
        return next;
      });
    },
    []
  );

  const handleReset = () => {
    if (window.confirm('Reset all values to the original reference data?')) {
      const initial = getInitialData();
      setData(initial);
      dataRef.current = initial;
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

  const handleExportExcel = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    exportExcel({
      mill1: dataRef.current.mill1,
      mill2: dataRef.current.mill2,
      mill3: dataRef.current.mill3,
    });
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
        <button className="ctrl-btn" onClick={handleExportExcel} title="Download Excel (.xlsx)">
          Download Excel (.xlsx)
        </button>
        <button className="ctrl-btn ctrl-btn-reset" onClick={handleReset} title="Reset to reference values">
          ↺ Reset
        </button>
      </div>

      {/* HMI Screen Display (Navbar + Dashboard) - this is what gets exported */}
      <div className="hmi-screen-container" ref={dashboardRef} id="dashboard">
        <HmiNavbar data={data.navbar} onChange={updateNavbar} />

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
