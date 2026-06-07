/**
 * Application Data Store
 *
 * Implements AppContext, AppProvider (useReducer), useAppData hook,
 * and initializeData() for fetching and dispatching CSV data on startup.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type {
  AppState,
  CMRecord,
  LokSabhaRecord,
  StatePartyTenure,
  PresidentRecord,
  DataLoadError,
} from '../types';
import {
  parseCMCsv,
  parseLokSabhaCsv,
  parseStatePartyTenureCsv,
  derivePMRecords,
} from '../utils/csvParser';
import { electionSteps } from '../data/electionSteps';
import { faqEntries } from '../data/faqEntries';
import { presidentRecords as staticPresidentRecords } from '../data/presidentRecords';

// ─── Action Types ─────────────────────────────────────────────────────────────

export type AppAction =
  | { type: 'LOAD_CM_RECORDS'; payload: CMRecord[] }
  | { type: 'LOAD_LOK_SABHA_RECORDS'; payload: LokSabhaRecord[] }
  | { type: 'LOAD_STATE_PARTY_TENURES'; payload: StatePartyTenure[] }
  | { type: 'LOAD_PRESIDENT_RECORDS'; payload: PresidentRecord[] }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'ADD_DATA_ERROR'; payload: DataLoadError };

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AppState = {
  cmRecords: [],
  lokSabhaRecords: [],
  statePartyTenures: [],
  pmRecords: [],
  presidentRecords: staticPresidentRecords,
  electionSteps,
  faqEntries,
  lastUpdated: null,
  dataLoadErrors: [],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_CM_RECORDS':
      return { ...state, cmRecords: action.payload };

    case 'LOAD_LOK_SABHA_RECORDS':
      return {
        ...state,
        lokSabhaRecords: action.payload,
        pmRecords: derivePMRecords(action.payload),
      };

    case 'LOAD_STATE_PARTY_TENURES':
      return { ...state, statePartyTenures: action.payload };

    case 'LOAD_PRESIDENT_RECORDS':
      return { ...state, presidentRecords: action.payload };

    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };

    case 'ADD_DATA_ERROR':
      return {
        ...state,
        dataLoadErrors: [...state.dataLoadErrors, action.payload],
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initializeData(dispatch);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── useAppData Hook ──────────────────────────────────────────────────────────

/**
 * Consumes AppContext. Throws if used outside AppProvider.
 */
export function useAppData(): AppContextValue {
  const ctx = useContext(AppContext);
  if (ctx === null) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  return ctx;
}

// ─── initializeData ───────────────────────────────────────────────────────────

/**
 * Fetches all three CSV files from public/data/ and dispatches parsed records
 * to the store. Called once on app startup inside AppProvider.
 */
export async function initializeData(dispatch: React.Dispatch<AppAction>): Promise<void> {
  const fetchCSV = async (path: string): Promise<string> => {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
    }
    return response.text();
  };

  // Fetch and parse CM records
  try {
    const csvText = await fetchCSV('/data/cm_raw_all_states.csv');
    const { records, errors } = parseCMCsv(csvText);
    dispatch({ type: 'LOAD_CM_RECORDS', payload: records });
    errors.forEach((error) => dispatch({ type: 'ADD_DATA_ERROR', payload: error }));
  } catch (err) {
    dispatch({
      type: 'ADD_DATA_ERROR',
      payload: {
        file: 'cm_raw_all_states.csv',
        rowNumber: null,
        field: null,
        message: err instanceof Error ? err.message : 'Unknown error fetching cm_raw_all_states.csv',
      },
    });
  }

  // Fetch and parse Lok Sabha records
  try {
    const csvText = await fetchCSV('/data/lok_sabha_ruling_party.csv');
    const { records, errors } = parseLokSabhaCsv(csvText);
    dispatch({ type: 'LOAD_LOK_SABHA_RECORDS', payload: records });
    errors.forEach((error) => dispatch({ type: 'ADD_DATA_ERROR', payload: error }));
  } catch (err) {
    dispatch({
      type: 'ADD_DATA_ERROR',
      payload: {
        file: 'lok_sabha_ruling_party.csv',
        rowNumber: null,
        field: null,
        message: err instanceof Error ? err.message : 'Unknown error fetching lok_sabha_ruling_party.csv',
      },
    });
  }

  // Fetch and parse state party tenure records
  try {
    const csvText = await fetchCSV('/data/state_party_years_all_states.csv');
    const { records, errors } = parseStatePartyTenureCsv(csvText);
    dispatch({ type: 'LOAD_STATE_PARTY_TENURES', payload: records });
    errors.forEach((error) => dispatch({ type: 'ADD_DATA_ERROR', payload: error }));
  } catch (err) {
    dispatch({
      type: 'ADD_DATA_ERROR',
      payload: {
        file: 'state_party_years_all_states.csv',
        rowNumber: null,
        field: null,
        message: err instanceof Error ? err.message : 'Unknown error fetching state_party_years_all_states.csv',
      },
    });
  }

  // Mark data as loaded with current timestamp
  dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
}

export { AppContext };
