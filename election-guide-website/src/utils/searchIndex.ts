import { AppState, SearchResult } from '../types';

export function buildSearchIndex(state: AppState): SearchResult[] {
  const index: SearchResult[] = [];

  // Index Election Steps
  state.electionSteps.forEach((step) => {
    index.push({
      type: 'step',
      id: step.id,
      title: step.title,
      snippet: step.description,
      route: `/guide/${step.id}`,
    });
  });

  // Index CM Records
  state.cmRecords.forEach((cm) => {
    index.push({
      type: 'cm',
      id: `cm-${cm.state}-${cm.name}-${cm.startDate?.getTime()}`,
      title: cm.name,
      snippet: `Chief Minister of ${cm.state} (${cm.party})`,
      route: `/map?state=${encodeURIComponent(cm.state)}`,
    });
  });

  // Index PM Records
  state.pmRecords.forEach((pm) => {
    index.push({
      type: 'pm',
      id: `pm-${pm.name}-${pm.electionYear}`,
      title: pm.name,
      snippet: `Prime Minister of India (${pm.party}) - ${pm.electionYear}`,
      route: `/pm-history`,
    });
  });

  // Index President Records
  state.presidentRecords.forEach((pres) => {
    index.push({
      type: 'president',
      id: `president-${pres.name}`,
      title: pres.name,
      snippet: `President of India - ${pres.party || 'Independent'}`,
      route: `/president-history`,
    });
  });

  // Index FAQ
  state.faqEntries.forEach((faq) => {
    index.push({
      type: 'faq',
      id: faq.id,
      title: faq.question,
      snippet: faq.answer,
      route: `/faq`,
    });
  });

  return index;
}

export function searchRecords(index: SearchResult[], query: string): { results: SearchResult[], error: string | null } {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length === 0) {
    return { results: [], error: 'Please enter a valid search term.' };
  }

  if (normalizedQuery.length < 2) {
    return { results: [], error: 'Search query must be at least 2 characters long.' };
  }

  const results = index.filter((item) => {
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.snippet.toLowerCase().includes(normalizedQuery)
    );
  });

  return { results, error: null };
}
