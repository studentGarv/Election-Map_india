// Election Guide Website — TypeScript Types and Data Models

// ─── Union Types ─────────────────────────────────────────────────────────────

export type ElectionType = 'lok_sabha' | 'rajya_sabha' | 'state_assembly';

// ─── CSV-Derived Record Types ─────────────────────────────────────────────────

/** Parsed from cm_raw_all_states.csv */
export interface CMRecord {
  state: string;
  name: string;
  party: string;
  startDate: Date | null; // parsed from start_date (ISO or NaT)
  endDate: Date | null;   // parsed from end_date (ISO or NaT → null)
}

/** Parsed from lok_sabha_ruling_party.csv */
export interface LokSabhaRecord {
  electionYear: string;       // e.g. "1951–52"
  lokSabha: string;           // e.g. "First"
  partyInGovernment: string;
  seatsWon: number | null;
  primeMinister: string;
}

/** Parsed from state_party_years_all_states.csv */
export interface StatePartyTenure {
  state: string;
  party: string;
  totalDays: number;
  firstStart: Date | null;
  lastEnd: Date | null;
  totalYears: number;
  firstYearInPower: number;
  lastYearInPower: number;
}

// ─── Application Domain Types ─────────────────────────────────────────────────

export interface ExternalLink {
  label: string;
  url: string;
}

export interface ElectionStep {
  id: string;
  title: string;
  electionType: ElectionType;
  order: number;
  dateRange: string;
  description: string;          // ≤ 50 words
  keyDates: string[];
  responsibleParties: string[];
  citizenActions: string[];
  externalLinks: ExternalLink[];
  relatedStepIds: string[];
}

export interface FAQEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
}

/** Derived from LokSabhaRecord */
export interface PMRecord {
  name: string;
  party: string;
  lokSabha: string;
  electionYear: string;
  startDate: Date | null;
  endDate: Date | null;
  seatsWon: number | null;
}

export interface PresidentRecord {
  name: string;
  party: string | null;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
}

export interface SearchResult {
  type: 'step' | 'cm' | 'pm' | 'president' | 'faq';
  id: string;
  title: string;
  snippet: string;
  route: string;
}

// ─── Data Store Types ─────────────────────────────────────────────────────────

export interface DataLoadError {
  file: string;
  rowNumber: number | null;
  field: string | null;
  message: string;
}

export interface AppState {
  cmRecords: CMRecord[];
  lokSabhaRecords: LokSabhaRecord[];
  statePartyTenures: StatePartyTenure[];
  pmRecords: PMRecord[];           // derived from lokSabhaRecords
  presidentRecords: PresidentRecord[];
  electionSteps: ElectionStep[];   // static content, bundled
  faqEntries: FAQEntry[];          // static content, bundled
  lastUpdated: Date | null;
  dataLoadErrors: DataLoadError[];
}
