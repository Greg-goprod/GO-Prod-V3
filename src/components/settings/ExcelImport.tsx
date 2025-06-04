import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface ExcelImportProps {
  allowedColumns: string[];
  templateName: string;
  onImport: (data: any[]) => Promise<void>;
  sampleRow?: Record<string, any>;
}

export const ExcelImport: React.FC<ExcelImportProps> = ({
  allowedColumns,
  templateName,
  onImport,
  sampleRow = {}
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setError(null);
      setSuccess(null);
      setIsProcessing(true);

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(firstSheet);

          // Validate columns
          const fileColumns = Object.keys(rawData[0] || {});
          const invalidColumns = fileColumns.filter(col => !allowedColumns.includes(col));

          if (invalidColumns.length > 0) {
            throw new Error(`Ce fichier contient des colonnes interdites à l'import: ${invalidColumns.join(', ')}. Veuillez utiliser le modèle fourni.`);
          }

          // Filter data to only include allowed columns
          const processedData = rawData.map((row: any) => {
            const filteredRow: any = {};
            allowedColumns.forEach(col => {
              if (row.hasOwnProperty(col)) {
                filteredRow[col] = row[col];
              }
            });
            return filteredRow;
          });

          // Validate required fields and data types
          processedData.forEach((row: any, index: number) => {
            // Ensure all required fields are present
            allowedColumns.forEach(col => {
              if (!row[col]) {
                throw new Error(`Ligne ${index + 1}: La colonne "${col}" est requise`);
              }
            });

            // Validate date format for birth_date if present
            if (row.birth_date) {
              const date = new Date(row.birth_date);
              if (isNaN(date.getTime())) {
                throw new Error(`Ligne ${index + 1}: Format de date invalide pour birth_date`);
              }
              row.birth_date = date.toISOString().split('T')[0];
            }

            // Validate numeric fields
            if (row.hired_year && isNaN(Number(row.hired_year))) {
              throw new Error(`Ligne ${index + 1}: hired_year doit être un nombre`);
            }
          });

          await onImport(processedData);
          setSuccess('Import réussi');
        } catch (error: any) {
          setError(error.message);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      setError(error.message);
      setIsProcessing(false);
    }
  }, [allowedColumns, onImport]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const downloadTemplate = () => {
    // Create template with only allowed columns
    const templateRow = allowedColumns.reduce((acc, col) => {
      acc[col] = sampleRow[col] || '';
      return acc;
    }, {} as Record<string, any>);

    const ws = XLSX.utils.json_to_sheet([templateRow]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${templateName}_template.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={downloadTemplate}
          icon={<Download size={16} />}
        >
          Télécharger le modèle
        </Button>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Déposez le fichier Excel ici'
            : 'Glissez-déposez un fichier Excel ici, ou cliquez pour sélectionner'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Seuls les fichiers .xlsx sont acceptés</p>
      </div>

      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4 mr-2" />
          {success}
        </Alert>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  );
};