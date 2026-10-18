import React from 'react';
import EditableCell from './EditableCell';
import type { MillData, CellValue } from '../data/initialData';

interface MillTableProps {
  title: string;
  data: MillData;
  onCellChange: (rowIndex: number, colIndex: number, value: CellValue) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const MillTable: React.FC<MillTableProps> = ({
  title,
  data,
  onCellChange,
  onDateChange,
  onTimeChange,
}) => {
  const colCount = data.columns.length;
  const isNarrow = colCount === 2; // Mill 3

  return (
    <div className={`mill-table-container ${isNarrow ? 'mill-narrow' : 'mill-wide'}`}>
      {/* Mill heading */}
      <div className="mill-heading">{title}</div>

      <table className="mill-table">
        <tbody>
          {/* DATE row */}
          <tr className="date-row">
            <td className="row-label date-label">DATE</td>
            <td colSpan={colCount} className="date-cell">
              <div className="date-input-wrapper">
                <input
                  type="text"
                  className="hmi-date-input"
                  value={data.date}
                  onChange={(e) => onDateChange(e.target.value)}
                />
                <input
                  type="text"
                  className="hmi-time-input"
                  value={data.time}
                  onChange={(e) => onTimeChange(e.target.value)}
                />
              </div>
            </td>
          </tr>

          {/* Column headers row */}
          <tr className="header-row">
            <td className="row-label header-label">CEMENT</td>
            {data.columns.map((col) => (
              <td key={col} className="col-header">
                {col}
              </td>
            ))}
          </tr>

          {/* Data rows */}
          {data.rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="data-row">
              <td className="row-label">
                {row.label.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </td>
              {row.values.map((val, colIdx) => (
                <EditableCell
                  key={colIdx}
                  value={val}
                  onChange={(newVal) => onCellChange(rowIdx, colIdx, newVal)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(MillTable);
