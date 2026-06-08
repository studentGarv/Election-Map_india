import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { searchRecords } from '../utils/searchIndex';
import { SearchResult } from '../types';

// Feature: election-guide-website, Property 7: Search Whitespace Rejection
// Feature: election-guide-website, Property 8: Search Result Completeness

describe('Search Properties', () => {
  const searchResultArbitrary = fc.record({
    type: fc.constantFrom('step', 'cm', 'pm', 'president', 'faq') as fc.Arbitrary<'step' | 'cm' | 'pm' | 'president' | 'faq'>,
    id: fc.string({ minLength: 1 }),
    title: fc.string({ minLength: 1 }),
    snippet: fc.string({ minLength: 1 }),
    route: fc.string({ minLength: 1 }),
  });

  it('P7: Search whitespace rejection test', () => {
    // Generate whitespace-only strings
    const whitespaceArbitrary = fc.stringOf(fc.constantFrom(' ', '\\t', '\\n', '\\r'), { minLength: 1 });
    
    fc.assert(
      fc.property(
        fc.array(searchResultArbitrary, { maxLength: 10 }),
        whitespaceArbitrary,
        (index, query) => {
          const { results, error } = searchRecords(index, query);
          expect(results.length).toBe(0);
          expect(error).not.toBeNull();
          expect(error).toBe('Please enter a valid search term.');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('P8: Search result completeness test', () => {
    // Generate records and a matching keyword
    fc.assert(
      fc.property(
        fc.array(searchResultArbitrary, { minLength: 1, maxLength: 50 }),
        (index) => {
          // pick a random record
          const target = index[Math.floor(Math.random() * index.length)];
          // pick a word from its title
          const words = target.title.split(' ').filter(w => w.trim().length >= 2);
          if (words.length === 0) return true; // skip if no suitable word
          
          const keyword = words[0];
          
          const { results, error } = searchRecords(index, keyword);
          
          expect(error).toBeNull();
          // The target record should be in the results
          const found = results.some(r => r.id === target.id);
          expect(found).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
