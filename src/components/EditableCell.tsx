import React, { useState, useRef, useEffect, useCallback } from 'react';

interface EditableCellProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== null) {
      setDisplayValue(formatValue(value));
    }
  }, [value]);

  const formatValue = (v: number): string => {
    // Preserve the exact decimal representation
    const str = v.toString();
    if (!str.includes('.')) {
      return str + '.00';
    }
    const parts = str.split('.');
    if (parts[1].length === 1) {
      return str + '0';
    }
    return str;
  };

  const handleFocus = () => {
    setEditing(true);
    if (value !== null) {
      setDisplayValue(value.toString());
    }
  };

  const handleBlur = () => {
    setEditing(false);
    if (displayValue.trim() === '') {
      onChange(0);
      setDisplayValue('0.00');
      return;
    }
    const parsed = parseFloat(displayValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
      setDisplayValue(formatValue(parsed));
    } else {
      // Revert to previous value
      if (value !== null) {
        setDisplayValue(formatValue(value));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === 'Tab') {
      // Let default tab behavior work
    }
  };

  // null = no input box
  if (value === null) {
    return <td className="cell-empty"></td>;
  }

  return (
    <td className="cell-input">
      <input
        ref={inputRef}
        type="text"
        className="hmi-input"
        value={editing ? displayValue : formatValue(value)}
        onChange={(e) => setDisplayValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </td>
  );
};

export default React.memo(EditableCell);
