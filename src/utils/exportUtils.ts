import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import XLSX from 'xlsx-js-style';
import type { MillData } from '../data/initialData';

/**
 * Ensures all live input values are mirrored as DOM attributes
 * so html-to-image cloneNode reliably captures the exact current user inputs.
 */
function syncInputs(element: HTMLElement) {
  const inputs = element.querySelectorAll<HTMLInputElement>('input');
  inputs.forEach((input) => {
    input.setAttribute('value', input.value);
  });
}

export async function exportPng(element: HTMLElement, filename = 'cement-mills-counters.png') {
  try {
    syncInputs(element);
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 3,
      backgroundColor: '#8e8e96',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });
    downloadDataUrl(dataUrl, filename);
  } catch (err) {
    console.error('PNG export failed:', err);
    alert('PNG export failed. Please try again.');
  }
}

export async function exportJpg(element: HTMLElement, filename = 'cement-mills-counters.jpg') {
  try {
    syncInputs(element);
    const dataUrl = await toJpeg(element, {
      quality: 0.95,
      pixelRatio: 3,
      backgroundColor: '#8e8e96',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });
    downloadDataUrl(dataUrl, filename);
  } catch (err) {
    console.error('JPG export failed:', err);
    alert('JPG export failed. Please try again.');
  }
}

export async function exportPdf(element: HTMLElement, filename = 'cement-mills-counters.pdf') {
  try {
    syncInputs(element);
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 3,
      backgroundColor: '#8e8e96',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const aspectRatio = imgWidth / imgHeight;

    // Landscape A4
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 4;

    let pdfImgWidth = pageWidth - 2 * margin;
    let pdfImgHeight = pdfImgWidth / aspectRatio;

    if (pdfImgHeight > pageHeight - 2 * margin) {
      pdfImgHeight = pageHeight - 2 * margin;
      pdfImgWidth = pdfImgHeight * aspectRatio;
    }

    const x = (pageWidth - pdfImgWidth) / 2;
    const y = (pageHeight - pdfImgHeight) / 2;

    pdf.addImage(dataUrl, 'PNG', x, y, pdfImgWidth, pdfImgHeight);
    pdf.save(filename);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('PDF export failed. Please try again.');
  }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Builds a single combined worksheet with all three mills arranged side by side horizontally.
 */
function buildCombinedWorksheet(millsData: {
  mill1: MillData;
  mill2: MillData;
  mill3: MillData;
}): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};

  const mills = [
    { title: 'CEMENT MILL - 1', data: millsData.mill1, startCol: 0 },
    { title: 'CEMENT MILL - 2', data: millsData.mill2, startCol: 6 }, // col 5 is spacer
    { title: 'CEMENT MILL - 3', data: millsData.mill3, startCol: 12 }, // col 11 is spacer
  ];

  const totalCols = 15; // 0 to 14: cols A through O
  const totalRows = 4 + 8; // Row 0: Title, Row 1: Mill Heading, Row 2: Date, Row 3: Headers, Rows 4..11: Data rows

  ws['!ref'] = XLSX.utils.encode_range(
    { r: 0, c: 0 },
    { r: totalRows - 1, c: totalCols - 1 }
  );

  const thinBorder = {
    top: { style: 'thin', color: { rgb: 'B0B0B0' } },
    bottom: { style: 'thin', color: { rgb: 'B0B0B0' } },
    left: { style: 'thin', color: { rgb: 'B0B0B0' } },
    right: { style: 'thin', color: { rgb: 'B0B0B0' } },
  };

  const merges: XLSX.Range[] = [];

  // Row 0: Main Dashboard Title across all 15 columns (A1:O1)
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } });
  for (let c = 0; c < totalCols; c++) {
    const ref = XLSX.utils.encode_cell({ r: 0, c });
    ws[ref] = {
      v: c === 0 ? 'CEMENT MILLS COUNTERS' : '',
      t: 's',
      s: {
        font: { name: 'Calibri', sz: 16, bold: true, color: { rgb: '4D3E00' } },
        fill: { fgColor: { rgb: 'FFD966' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: thinBorder,
      },
    };
  }

  // Populate each mill table side-by-side
  mills.forEach(({ title, data, startCol }) => {
    const numDataCols = data.columns.length;
    const millEndCol = startCol + numDataCols; // e.g. 0 + 4 = 4 (cols 0..4 for Mill 1 & 2; 12..14 for Mill 3)

    // Row 1: Mill Heading (e.g. A2:E2, G2:K2, M2:O2)
    merges.push({ s: { r: 1, c: startCol }, e: { r: 1, c: millEndCol } });
    for (let c = startCol; c <= millEndCol; c++) {
      const ref = XLSX.utils.encode_cell({ r: 1, c });
      ws[ref] = {
        v: c === startCol ? title : '',
        t: 's',
        s: {
          font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: '202020' } },
          fill: { fgColor: { rgb: 'FFE599' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: thinBorder,
        },
      };
    }

    // Row 2: DATE Row
    // Label cell
    ws[XLSX.utils.encode_cell({ r: 2, c: startCol })] = {
      v: 'DATE',
      t: 's',
      s: {
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '202020' } },
        fill: { fgColor: { rgb: 'F5F5F5' } },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: thinBorder,
      },
    };

    // Date & Time merged across data columns (e.g. B3:E3, H3:K3, N3:O3)
    merges.push({ s: { r: 2, c: startCol + 1 }, e: { r: 2, c: millEndCol } });
    const dateTimeStr = data.time ? `${data.date} ${data.time}`.trim() : data.date;
    for (let c = startCol + 1; c <= millEndCol; c++) {
      const ref = XLSX.utils.encode_cell({ r: 2, c });
      ws[ref] = {
        v: c === startCol + 1 ? dateTimeStr : '',
        t: 's',
        s: {
          font: { name: 'Calibri', sz: 11, bold: false, color: { rgb: '202020' } },
          fill: { fgColor: { rgb: 'FFFFFF' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: thinBorder,
        },
      };
    }

    // Row 3: Column Headers Row ('CEMENT' + columns)
    ws[XLSX.utils.encode_cell({ r: 3, c: startCol })] = {
      v: 'CEMENT',
      t: 's',
      s: {
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '202020' } },
        fill: { fgColor: { rgb: 'FFF2CC' } },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: thinBorder,
      },
    };

    data.columns.forEach((col, idx) => {
      const ref = XLSX.utils.encode_cell({ r: 3, c: startCol + 1 + idx });
      ws[ref] = {
        v: col,
        t: 's',
        s: {
          font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '202020' } },
          fill: { fgColor: { rgb: 'FFF2CC' } },
          alignment: { horizontal: 'right', vertical: 'center' },
          border: thinBorder,
        },
      };
    });

    // Rows 4..11: Data rows (8 rows)
    data.rows.forEach((row, rowIdx) => {
      const r = 4 + rowIdx;

      // Row label
      ws[XLSX.utils.encode_cell({ r, c: startCol })] = {
        v: row.label,
        t: 's',
        s: {
          font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '202020' } },
          fill: { fgColor: { rgb: 'FAFAFA' } },
          alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
          border: thinBorder,
        },
      };

      // Numeric value cells
      row.values.forEach((val, valIdx) => {
        const cellRef = XLSX.utils.encode_cell({ r, c: startCol + 1 + valIdx });
        if (val !== null && typeof val === 'number') {
          ws[cellRef] = {
            v: val,
            t: 'n',
            z: '0.00',
            s: {
              font: { name: 'Calibri', sz: 11, color: { rgb: '000000' } },
              alignment: { horizontal: 'right', vertical: 'center' },
              border: thinBorder,
            },
          };
        } else {
          // Blank cell preserved
          ws[cellRef] = {
            t: 'z',
            s: {
              border: thinBorder,
            },
          };
        }
      });
    });
  });

  ws['!merges'] = merges;

  // Row heights
  const rowHeights = [
    { hpt: 32 }, // Row 0: Main dashboard title
    { hpt: 26 }, // Row 1: Mill headings
    { hpt: 22 }, // Row 2: Date
    { hpt: 24 }, // Row 3: Column headers
  ];

  // For data rows, check if any mill has multiline label for that row
  for (let r = 0; r < 8; r++) {
    const hasNewline =
      millsData.mill1.rows[r]?.label.includes('\n') ||
      millsData.mill2.rows[r]?.label.includes('\n') ||
      millsData.mill3.rows[r]?.label.includes('\n');
    rowHeights.push({ hpt: hasNewline ? 32 : 22 });
  }

  ws['!rows'] = rowHeights;

  // Column widths:
  // Mill 1: A(19), B(12), C(12), D(12), E(12)
  // Spacer: F(3)
  // Mill 2: G(19), H(12), I(12), J(12), K(12)
  // Spacer: L(3)
  // Mill 3: M(19), N(12), O(12)
  ws['!cols'] = [
    { wch: 19 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, // Mill 1
    { wch: 3 },                                                        // Spacer 1
    { wch: 19 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, // Mill 2
    { wch: 3 },                                                        // Spacer 2
    { wch: 19 }, { wch: 12 }, { wch: 12 },                             // Mill 3
  ];

  // Landscape page setup to fit all three tables onto one page horizontally
  ws['!pageSetup'] = {
    orientation: 'landscape',
    fitToWidth: 1,
    fitToHeight: 0,
  };

  return ws;
}

/**
 * Returns a default filename like Cement_Mills_Counters_2026-10-20.xlsx
 */
export function getExcelExportFilename(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `Cement_Mills_Counters_${year}-${month}-${day}.xlsx`;
}

/**
 * Generates and downloads a clean, valid .xlsx Excel workbook containing
 * ONE worksheet with all three cement mills arranged side by side horizontally.
 */
export function exportExcel(
  millsData: {
    mill1: MillData;
    mill2: MillData;
    mill3: MillData;
  },
  customFilename?: string
) {
  try {
    const filename = customFilename || getExcelExportFilename();
    const wb = XLSX.utils.book_new();

    const ws = buildCombinedWorksheet(millsData);

    XLSX.utils.book_append_sheet(wb, ws, 'Cement Mills Counters');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Excel export failed:', err);
    alert('Excel export failed. Please try again.');
  }
}

