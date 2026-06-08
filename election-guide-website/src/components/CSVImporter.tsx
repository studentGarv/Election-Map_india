import React, { useState, useRef } from 'react';
import { useAppData } from '../context/AppContext';
import { parseCMCsv, parseLokSabhaCsv, parseStatePartyTenureCsv } from '../utils/csvParser';
import { DataLoadError } from '../types';

type CsvType = 'cm' | 'loksabha' | 'stateparty';

export function CSVImporter() {
  const { dispatch } = useAppData();
  const [selectedType, setSelectedType] = useState<CsvType>('cm');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<DataLoadError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSuccessMessage(null);
    setErrors([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        if (selectedType === 'cm') {
          const result = parseCMCsv(text);
          dispatch({ type: 'LOAD_CM_RECORDS', payload: result.records });
          if (result.errors.length > 0) setErrors(result.errors);
          else setSuccessMessage(`Successfully loaded ${result.records.length} CM records.`);
        } else if (selectedType === 'loksabha') {
          const result = parseLokSabhaCsv(text);
          dispatch({ type: 'LOAD_LOK_SABHA_RECORDS', payload: result.records });
          if (result.errors.length > 0) setErrors(result.errors);
          else setSuccessMessage(`Successfully loaded ${result.records.length} Lok Sabha records.`);
        } else if (selectedType === 'stateparty') {
          const result = parseStatePartyTenureCsv(text);
          dispatch({ type: 'LOAD_STATE_PARTY_TENURES', payload: result.records });
          if (result.errors.length > 0) setErrors(result.errors);
          else setSuccessMessage(`Successfully loaded ${result.records.length} State Party Tenure records.`);
        }

        dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
      } catch (err: any) {
        setErrors([{
          file: file.name,
          rowNumber: null,
          field: null,
          message: err.message || 'Fatal error parsing CSV',
        }]);
      }
    };
    reader.onerror = () => {
      setErrors([{
        file: file.name,
        rowNumber: null,
        field: null,
        message: 'Failed to read file from disk.',
      }]);
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // reset
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Election Data (CSV)</h2>
      
      <div className="mb-4">
        <label htmlFor="csv-type" className="block text-sm font-medium text-gray-700 mb-1">
          Select Data Type
        </label>
        <select
          id="csv-type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as CsvType)}
          className="w-full sm:max-w-xs block p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="cm">Chief Ministers</option>
          <option value="loksabha">Lok Sabha / Prime Ministers</option>
          <option value="stateparty">State Party Tenures</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700 mb-1">
          Select File
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {successMessage && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
          {successMessage}
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 max-h-64 overflow-y-auto">
          <p className="font-bold mb-2">Errors occurred during import:</p>
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>
                {err.rowNumber ? `Row ${err.rowNumber}: ` : ''}
                {err.field ? `Field '${err.field}' - ` : ''}
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
