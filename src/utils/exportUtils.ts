import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

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
