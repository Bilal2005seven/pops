import React from 'react';
import './HmiNavbar.css';

interface HmiNavbarProps {
  dateTime?: {
    date: string;
    time: string;
  };
}

const HmiNavbar: React.FC<HmiNavbarProps> = ({
  dateTime = { date: '10/18/2026', time: '11:56' },
}) => {
  return (
    <header className="hmi-header" id="hmi-header">
      {/* Top workplace tab bar */}
      <div className="hmi-workplace-tab">
        <span className="tab-icon">🗂</span>
        <span className="tab-title">IMLAIGU // HCIL_LAB VCO Operator Workplace</span>
      </div>

      {/* Main 2-layer Navbar Container */}
      <div className="hmi-navbar-body">
        {/* Column 1: Left ABB Column (aligned vertically across both rows) */}
        <div className="hmi-col-abb">
          {/* Row 1: ABB Logo */}
          <div className="hmi-abb-box" title="ABB Industrial IT">
            <svg
              className="hmi-abb-svg"
              viewBox="0 0 120 48"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Letter 'A' */}
              <path d="M6 42 L22 6 L30 6 L46 42 L36 42 L31 30 L21 30 L16 42 Z M23.5 24 L28.5 24 L26 14.5 Z" />
              <rect x="18" y="22" width="16" height="3" fill="#111114" />
              {/* Letter 'B' 1 */}
              <path d="M50 6 L68 6 C74 6 78 9 78 14 C78 18 75 21 70 22 C76 23 80 27 80 33 C80 39 74 42 67 42 L50 42 Z M59 13 L65 13 C68 13 70 14.5 70 17 C70 19.5 68 21 65 21 L59 21 Z M59 27 L66 27 C69 27 71 28.5 71 31.5 C71 34.5 69 36 66 36 L59 36 Z" />
              <rect x="56" y="21.5" width="18" height="3" fill="#111114" />
              {/* Letter 'B' 2 */}
              <path d="M84 6 L102 6 C108 6 112 9 112 14 C112 18 109 21 104 22 C110 23 114 27 114 33 C114 39 108 42 101 42 L84 42 Z M93 13 L99 13 C102 13 104 14.5 104 17 C104 19.5 102 21 99 21 L93 21 Z M93 27 L100 27 C103 27 105 28.5 105 31.5 C105 34.5 103 36 100 36 L93 36 Z" />
              <rect x="90" y="21.5" width="18" height="3" fill="#111114" />
            </svg>
          </div>

          {/* Row 2: Nav back arrow & 3D Cube (aligns directly under ABB) */}
          <div className="hmi-abb-subnav">
            <button className="hmi-tb-icon-btn hmi-nav-back" title="Back">
              <span className="hmi-green-circle">
                <svg viewBox="0 0 16 16" width="10" height="10" fill="#fff">
                  <path d="M10 3 L4 8 L10 13 L11.5 11.5 L7 8 L11.5 4.5 Z" />
                </svg>
              </span>
            </button>

            <div className="hmi-cube-btn" title="View Options">
              <svg viewBox="0 0 18 18" width="14" height="14" className="hmi-cube-svg">
                <polygon points="9,2 16,6 9,10 2,6" fill="#4a90e2" />
                <polygon points="2,6 9,10 9,17 2,13" fill="#2d6cb5" />
                <polygon points="16,6 9,10 9,17 16,13" fill="#1e4f8a" />
              </svg>
              <span className="hmi-tiny-arrow">▾</span>
            </div>
          </div>
        </div>

        {/* Column 2: Center Main Content (Top alarms + Bottom display dropdown & icons) */}
        <div className="hmi-col-center">
          {/* Row 1: Top Status / Alarms Strip */}
          <div className="hmi-center-status-row">
            <div className="hmi-status-left">
              <svg className="hmi-lamp-svg" viewBox="0 0 14 14" width="12" height="12">
                <rect x="1" y="1" width="12" height="12" fill="#d32020" stroke="#ff4d4d" strokeWidth="1" />
                <rect x="3.5" y="3.5" width="7" height="7" fill="#e8e8e8" />
              </svg>
              <span className="hmi-alarm-tag">FA0202SG05</span>
              <span className="hmi-alarm-name">Pnuematic Cut Off Gate</span>
            </div>

            <div className="hmi-status-right">
              <span className="hmi-alarm-detail">
                Close Limit SW Flt Failure 18.10.26 11:50:21
              </span>
            </div>
          </div>

          {/* Row 2: Lower Toolbar (MILLS COUNTER dropdown aligned with FA0202SG05) */}
          <div className="hmi-center-toolbar-row">
            {/* Display Dropdown / Input Box */}
            <div className="hmi-display-dropdown">
              <input
                type="text"
                readOnly
                value="MILLS COUNTER:Graphic Display"
                className="hmi-dropdown-input"
              />
              <span className="hmi-dropdown-arrow">▾</span>
            </div>

            {/* Toolbar Action Icons */}
            <div className="hmi-tb-actions">
              {/* Layers / Stack Icon */}
              <button className="hmi-tool-btn" title="Layers">
                <svg viewBox="0 0 16 16" width="13" height="13">
                  <polygon points="8,2 14,5 8,8 2,5" fill="#5c85b4" />
                  <polygon points="2,7 8,10 14,7 14,8.5 8,11.5 2,8.5" fill="#4a6e9a" />
                  <polygon points="2,10.5 8,13.5 14,10.5 14,12 8,15 2,12" fill="#355277" />
                  <polygon points="11,1 15,1 15,5" fill="#28a745" />
                </svg>
              </button>

              {/* Pin Icon */}
              <button className="hmi-tool-btn" title="Pin / Lock">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="#4a4a50">
                  <path d="M4 2 L12 2 L11 6 L13 8 L9 8 L9 15 L7 15 L7 8 L3 8 L5 6 Z" />
                </svg>
              </button>

              {/* Print Icon */}
              <button className="hmi-tool-btn" title="Print">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="#4a4a50">
                  <path d="M4 2 h8 v3 h-8 z M3 6 h10 v5 h-2 v3 h-6 v-3 h-2 z" />
                </svg>
              </button>

              {/* Undo / Redo */}
              <button className="hmi-tool-btn" title="Undo / Redo">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="#4a4a50">
                  <path d="M4 5 L1 8 L4 11 V9 C8 9 11 11 12 14 C13 10 11 6 4 6 Z" />
                </svg>
                <span className="hmi-tiny-arrow">▾</span>
              </button>

              {/* Calculator / Script */}
              <button className="hmi-tool-btn" title="Formulas">
                <span className="hmi-calc-badge">BG</span>
                <span className="hmi-tiny-arrow">▾</span>
              </button>

              {/* Document Icon */}
              <button className="hmi-tool-btn" title="Document Details">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="#4a4a50">
                  <path d="M3 2 h7 l3 3 v9 h-10 z M9 2 v4 h4" />
                  <line x1="5" y1="8" x2="11" y2="8" stroke="#666" strokeWidth="1" />
                  <line x1="5" y1="10" x2="11" y2="10" stroke="#666" strokeWidth="1" />
                </svg>
              </button>
            </div>

            {/* Trailing toolbar empty grey spacer */}
            <div className="hmi-toolbar-spacer"></div>
          </div>
        </div>

        {/* Column 3: Right Section - Controls & Heidelberg Logo */}
        <div className="hmi-col-right">
          {/* Date & Time Block */}
          <div className="hmi-nav-item hmi-datetime-box">
            <span className="hmi-datetime-date">{dateTime.date}</span>
            <span className="hmi-datetime-time">{dateTime.time}</span>
          </div>

          {/* Alarm Group with top red accent line */}
          <div className="hmi-alarm-group">
            <div className="hmi-alarm-item">
              <span className="hmi-alarm-lbl">Alarm</span>
              <span className="hmi-counter-badge">99</span>
            </div>

            <div className="hmi-alarm-item">
              <span className="hmi-alarm-lbl">Controller</span>
              <span className="hmi-counter-badge">99</span>
            </div>

            <div className="hmi-alarm-item">
              <span className="hmi-alarm-lbl">System</span>
              <span className="hmi-counter-badge">99</span>
            </div>
          </div>

          {/* Events with dropdown chevron */}
          <div className="hmi-nav-item hmi-events-box">
            <span className="hmi-nav-text">Events</span>
            <span className="hmi-chevron">▾</span>
          </div>

          {/* Operator Audit Button */}
          <div className="hmi-nav-item hmi-operator-audit-box">
            <button className="hmi-operator-audit-btn">
              <span>Operator</span>
              <span>Audit</span>
            </button>
          </div>

          {/* Start/Stop Dropdown */}
          <div className="hmi-nav-item hmi-startstop-box">
            <span className="hmi-nav-text">Start/Stop</span>
            <span className="hmi-chevron">▾</span>
          </div>

          {/* Hamburger Menu */}
          <div className="hmi-nav-item hmi-hamburger-box" title="Menu">
            <span className="hmi-hamburger-icon">☰</span>
          </div>

          {/* Heidelberg Green Brand Block */}
          <div className="hmi-brand-block" title="Heidelberg Materials">
            <div className="hmi-brand-inner">
              <span className="hmi-brand-text">HEIDELBERG</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(HmiNavbar);
