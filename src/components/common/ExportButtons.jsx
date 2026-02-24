import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';

const ExportButtons = ({
  data,
  filename = 'export',
  columns,
  onExportPDF,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(null);

  const exportToCSV = async () => {
    setIsExporting('csv');
    try {
      // Transform data based on columns
      const exportData = data.map(row => {
        const newRow = {};
        columns.forEach(col => {
          newRow[col.label] = col.exportValue 
            ? col.exportValue(row[col.key], row)
            : row[col.key];
        });
        return newRow;
      });

      const csv = Papa.unparse(exportData);
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const exportToPDF = async () => {
    setIsExporting('pdf');
    try {
      if (onExportPDF) {
        await onExportPDF(data);
      } else {
        // Basic PDF export using print
        const printContent = generatePrintHTML();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const generatePrintHTML = () => {
    const headers = columns.map(col => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">${col.label}</th>`).join('');
    
    const rows = data.map(row => {
      const cells = columns.map(col => {
        const value = col.exportValue 
          ? col.exportValue(row[col.key], row)
          : row[col.key];
        return `<td style="border: 1px solid #ddd; padding: 8px;">${value || ''}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { color: #333; }
          .header { margin-bottom: 20px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${filename}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="footer">
          <p>Total Records: ${data.length}</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={exportToCSV}
        disabled={isExporting === 'csv' || !data?.length}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting === 'csv' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        <span>{t('export.csv')}</span>
      </button>

      <button
        onClick={exportToPDF}
        disabled={isExporting === 'pdf' || !data?.length}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting === 'pdf' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span>{t('export.pdf')}</span>
      </button>
    </div>
  );
};

export default ExportButtons;