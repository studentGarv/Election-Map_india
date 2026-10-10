/**
 * Historical Prime Minister tenure reference data.
 *
 * Provides accurate tenure periods and calendar dates for each Prime Minister
 * corresponding to each Lok Sabha term in India's electoral history.
 */

export interface PMTenureInfo {
  tenurePeriod: string;
  fullDates: string;
  startYear: number;
  endYear: number | null;
  sortKey: number;
}

const PM_TENURE_REGISTRY: Record<string, PMTenureInfo> = {
  // First Lok Sabha
  'First|1951–52|Jawaharlal Nehru': {
    tenurePeriod: '1952 – 1957',
    fullDates: '13 May 1952 – 17 Apr 1957',
    startYear: 1952,
    endYear: 1957,
    sortKey: 1952.05,
  },
  // Second Lok Sabha
  'Second|1957|Jawaharlal Nehru': {
    tenurePeriod: '1957 – 1962',
    fullDates: '17 Apr 1957 – 2 Apr 1962',
    startYear: 1957,
    endYear: 1962,
    sortKey: 1957.04,
  },
  // Third Lok Sabha
  'Third|1962|Jawaharlal Nehru': {
    tenurePeriod: '1962 – 1964',
    fullDates: '2 Apr 1962 – 27 May 1964',
    startYear: 1962,
    endYear: 1964,
    sortKey: 1962.04,
  },
  'Third|1962|Gulzarilal Nanda (acting)': {
    tenurePeriod: '1964 & 1966 (Acting)',
    fullDates: '27 May 1964 – 9 Jun 1964 & 11 Jan 1966 – 24 Jan 1966',
    startYear: 1964,
    endYear: 1966,
    sortKey: 1964.05,
  },
  'Third|1962|Lal Bahadur Shastri': {
    tenurePeriod: '1964 – 1966',
    fullDates: '9 Jun 1964 – 11 Jan 1966',
    startYear: 1964,
    endYear: 1966,
    sortKey: 1964.06,
  },
  // Fourth Lok Sabha
  'Fourth|1967|Indira Gandhi': {
    tenurePeriod: '1966 – 1971',
    fullDates: '24 Jan 1966 – 15 Mar 1971',
    startYear: 1966,
    endYear: 1971,
    sortKey: 1966.01,
  },
  // Fifth Lok Sabha
  'Fifth|1971|Indira Gandhi': {
    tenurePeriod: '1971 – 1977',
    fullDates: '15 Mar 1971 – 24 Mar 1977',
    startYear: 1971,
    endYear: 1977,
    sortKey: 1971.03,
  },
  // Sixth Lok Sabha
  'Sixth|1977|Morarji Desai': {
    tenurePeriod: '1977 – 1979',
    fullDates: '24 Mar 1977 – 28 Jul 1979',
    startYear: 1977,
    endYear: 1979,
    sortKey: 1977.03,
  },
  'Sixth|1977|Charan Singh': {
    tenurePeriod: '1979 – 1980',
    fullDates: '28 Jul 1979 – 14 Jan 1980',
    startYear: 1979,
    endYear: 1980,
    sortKey: 1979.07,
  },
  // Seventh Lok Sabha
  'Seventh|1980|Indira Gandhi': {
    tenurePeriod: '1980 – 1984',
    fullDates: '14 Jan 1980 – 31 Oct 1984',
    startYear: 1980,
    endYear: 1984,
    sortKey: 1980.01,
  },
  // Eighth Lok Sabha
  'Eighth|1984|Rajiv Gandhi': {
    tenurePeriod: '1984 – 1989',
    fullDates: '31 Oct 1984 – 2 Dec 1989',
    startYear: 1984,
    endYear: 1989,
    sortKey: 1984.10,
  },
  // Ninth Lok Sabha
  'Ninth|1989|V. P. Singh': {
    tenurePeriod: '1989 – 1990',
    fullDates: '2 Dec 1989 – 10 Nov 1990',
    startYear: 1989,
    endYear: 1990,
    sortKey: 1989.12,
  },
  'Ninth|1989|Chandra Shekhar': {
    tenurePeriod: '1990 – 1991',
    fullDates: '10 Nov 1990 – 21 Jun 1991',
    startYear: 1990,
    endYear: 1991,
    sortKey: 1990.11,
  },
  // Tenth Lok Sabha
  'Tenth|1991|P. V. Narasimha Rao': {
    tenurePeriod: '1991 – 1996',
    fullDates: '21 Jun 1991 – 16 May 1996',
    startYear: 1991,
    endYear: 1996,
    sortKey: 1991.06,
  },
  // Eleventh Lok Sabha
  'Eleventh|1996|Atal Bihari Vajpayee': {
    tenurePeriod: '1996 (16 days)',
    fullDates: '16 May 1996 – 1 Jun 1996',
    startYear: 1996,
    endYear: 1996,
    sortKey: 1996.05,
  },
  'Eleventh|1996|H. D. Deve Gowda': {
    tenurePeriod: '1996 – 1997',
    fullDates: '1 Jun 1996 – 21 Apr 1997',
    startYear: 1996,
    endYear: 1997,
    sortKey: 1996.06,
  },
  'Eleventh|1996|I. K. Gujral': {
    tenurePeriod: '1997 – 1998',
    fullDates: '21 Apr 1997 – 19 Mar 1998',
    startYear: 1997,
    endYear: 1998,
    sortKey: 1997.04,
  },
  // Twelfth Lok Sabha
  'Twelfth|1998|Atal Bihari Vajpayee': {
    tenurePeriod: '1998 – 1999',
    fullDates: '19 Mar 1998 – 13 Oct 1999',
    startYear: 1998,
    endYear: 1999,
    sortKey: 1998.03,
  },
  // Thirteenth Lok Sabha
  'Thirteenth|1999|Atal Bihari Vajpayee': {
    tenurePeriod: '1999 – 2004',
    fullDates: '13 Oct 1999 – 22 May 2004',
    startYear: 1999,
    endYear: 2004,
    sortKey: 1999.10,
  },
  // Fourteenth Lok Sabha
  'Fourteenth|2004|Manmohan Singh': {
    tenurePeriod: '2004 – 2009',
    fullDates: '22 May 2004 – 22 May 2009',
    startYear: 2004,
    endYear: 2009,
    sortKey: 2004.05,
  },
  // Fifteenth Lok Sabha
  'Fifteenth|2009|Manmohan Singh': {
    tenurePeriod: '2009 – 2014',
    fullDates: '22 May 2009 – 26 May 2014',
    startYear: 2009,
    endYear: 2014,
    sortKey: 2009.05,
  },
  // Sixteenth Lok Sabha
  'Sixteenth|2014|Narendra Modi': {
    tenurePeriod: '2014 – 2019',
    fullDates: '26 May 2014 – 30 May 2019',
    startYear: 2014,
    endYear: 2019,
    sortKey: 2014.05,
  },
  // Seventeenth Lok Sabha
  'Seventeenth|2019|Narendra Modi': {
    tenurePeriod: '2019 – 2024',
    fullDates: '30 May 2019 – 9 Jun 2024',
    startYear: 2019,
    endYear: 2024,
    sortKey: 2019.05,
  },
  // Eighteenth Lok Sabha
  'Eighteenth|2024|Narendra Modi': {
    tenurePeriod: '2024 – Present',
    fullDates: '9 Jun 2024 – Present',
    startYear: 2024,
    endYear: null,
    sortKey: 2024.06,
  },
};

/**
 * Resolves tenure information for a PM record.
 */
export function getPMTenureInfo(name: string, lokSabha: string, electionYear: string): PMTenureInfo | null {
  const key = `${lokSabha}|${electionYear}|${name}`;
  if (PM_TENURE_REGISTRY[key]) {
    return PM_TENURE_REGISTRY[key];
  }

  // Fallback search by name and lokSabha
  const partialKey = Object.keys(PM_TENURE_REGISTRY).find((k) => {
    const [ls, , n] = k.split('|');
    return ls === lokSabha && n.toLowerCase() === name.toLowerCase();
  });

  return partialKey ? PM_TENURE_REGISTRY[partialKey] : null;
}
