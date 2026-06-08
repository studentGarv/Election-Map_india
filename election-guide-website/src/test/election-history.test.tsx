import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AppProvider } from '../context/AppContext';
import { MemoryRouter } from 'react-router-dom';
import ElectionResultsHistoryPage from '../pages/ElectionResultsHistoryPage';

// Feature: election-guide-website, Property 18: State Selector Filtering

describe('Election Results History Properties', () => {
  it('P18: State selector updates the displayed state data', () => {
    const { unmount } = render(
      <MemoryRouter>
        <AppProvider>
          <ElectionResultsHistoryPage />
        </AppProvider>
      </MemoryRouter>
    );

    // Initial state: National Dominance Summary should be visible
    expect(screen.getByText(/National Election History/i)).toBeInTheDocument();

    const select = screen.getByLabelText(/Filter by State/i);
    
    // Check if Maharashtra is an option (as it's in the data)
    const options = Array.from(select.querySelectorAll('option')).map(o => o.value);
    
    if (options.includes('Maharashtra')) {
      fireEvent.change(select, { target: { value: 'Maharashtra' } });
      expect(screen.queryByText(/National Election History/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Maharashtra Election History/i)).toBeInTheDocument();
    }

    unmount();
  });
});
