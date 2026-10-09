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
          else setSuccessMessage(`Successfully loaded ${result.records.length} Chief Minister records.`);
        } else if (selectedType === 'loksabha') {
          const result = parseLokSabhaCsv(text);
          dispatch({ type: 'LOAD_LOK_SABHA_RECORDS', payload: result.records });
          if (result.errors.length > 0) setErrors(result.errors);
          else setSuccessMessage(`Successfully loaded ${result.records.length} Lok Sabha election records.`);
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
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
          📄
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Upload Election Data (CSV)</h2>
          <p className="text-xs text-slate-500">
            Select the dataset format and upload a compliant CSV file.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="csv-type" className="block text-sm font-semibold text-slate-700 mb-2">
            Dataset Target
          </label>
          <select
            id="csv-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CsvType)}
            className="w-full block px-3.5 py-2.5 bg-slate-50 hover:bg-white text-slate-800 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors cursor-pointer"
          >
            <option value="cm">Chief Ministers (State Leadership)</option>
            <option value="loksabha">Lok Sabha / Prime Ministers</option>
            <option value="stateparty">State Party Tenures & Statistics</option>
          </select>
          <p className="text-xs text-slate-400 mt-1.5">
            Determines the CSV parser schema and target store.
          </p>
        </div>

        <div>
          <label htmlFor="csv-upload" className="block text-sm font-semibold text-slate-700 mb-2">
            Select CSV File
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer border border-slate-200 rounded-lg bg-slate-50 p-1"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Only standard comma-delimited (.csv) files are supported.
          </p>
        </div>
      </div>

      {/* Dataset Schema Information */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Expected Header Format ({selectedType})
        </h3>
        {selectedType === 'cm' && (
          <p className="text-xs font-mono text-slate-700 break-all bg-white p-2.5 rounded border border-slate-200">
            State, Chief Minister, Party, Took office, Left office, Tenure
          </p>
        )}
        {selectedType === 'loksabha' && (
          <p className="text-xs font-mono text-slate-700 break-all bg-white p-2.5 rounded border border-slate-200">
            Lok Sabha, Election Year, Winning Party / Coalition, Prime Minister, Seats Won, Total Seats
          </p>
        )}
        {selectedType === 'stateparty' && (
          <p className="text-xs font-mono text-slate-700 break-all bg-white p-2.5 rounded border border-slate-200">
            State, Party, Total Tenure (Years), Percentage, Dominant Period
          </p>
        )}
      </div>

      {successMessage && (
        <div className="p-4 mb-4 text-sm text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
          <span className="text-emerald-600 text-lg leading-none" aria-hidden="true">✓</span>
          <div>
            <p className="font-semibold">{successMessage}</p>
            <p className="text-xs text-emerald-700 mt-0.5">Records are now active across all portal views.</p>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-4 text-sm text-red-800 bg-red-50 rounded-xl border border-red-200 max-h-64 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 font-bold text-red-900">
            <span aria-hidden="true">⚠️</span>
            <p>Errors occurred during CSV parsing:</p>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-xs text-red-700 font-medium">
            {errors.map((err, idx) => (
              <li key={idx}>
                {err.rowNumber ? <span className="font-semibold">Row {err.rowNumber}: </span> : null}
                {err.field ? <span className="font-mono bg-red-100 px-1 rounded text-red-900">[{err.field}]</span> : null}{' '}
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
