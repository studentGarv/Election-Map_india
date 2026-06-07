import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppShell from './AppShell';
import NavBar from './NavBar';
import Footer from './Footer';
import NotFoundPage from '../pages/NotFoundPage';

// Mock useAppData to avoid needing a full AppProvider in tests
vi.mock('../context/AppContext', () => ({
  useAppData: () => ({
    state: {
      lastUpdated: null,
      cmRecords: [],
      lokSabhaRecords: [],
      statePartyTenures: [],
      pmRecords: [],
      presidentRecords: [],
      electionSteps: [],
      faqEntries: [],
      dataLoadErrors: [],
    },
    dispatch: vi.fn(),
  }),
}));

// Helper to render with MemoryRouter
function renderWithRouter(ui: React.ReactElement, { initialEntries = ['/'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  );
}

// ─── NavBar Tests ─────────────────────────────────────────────────────────────

describe('NavBar', () => {
  it('renders the site brand link', () => {
    renderWithRouter(<NavBar />);
    expect(screen.getByRole('link', { name: /India Election Guide.*Home/i })).toBeInTheDocument();
  });

  it('renders the ECI link pointing to eci.gov.in', () => {
    renderWithRouter(<NavBar />);
    const eciLinks = screen.getAllByRole('link', { name: /Election Commission of India/i });
    expect(eciLinks.length).toBeGreaterThan(0);
    expect(eciLinks[0]).toHaveAttribute('href', 'https://eci.gov.in');
    expect(eciLinks[0]).toHaveAttribute('target', '_blank');
    expect(eciLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders nav links to all primary pages', () => {
    renderWithRouter(<NavBar />);
    // Check for key nav links in the desktop nav
    expect(screen.getByRole('link', { name: 'Map' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Guide' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'PM History' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'President History' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Election History' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'FAQ' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });

  it('renders a search input', () => {
    renderWithRouter(<NavBar />);
    const searchInputs = screen.getAllByRole('searchbox');
    expect(searchInputs.length).toBeGreaterThan(0);
  });

  it('renders a hamburger button for mobile', () => {
    renderWithRouter(<NavBar />);
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('toggles mobile menu on hamburger click', () => {
    renderWithRouter(<NavBar />);
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
    // Mobile nav should be visible
    expect(screen.getByRole('navigation', { name: /primary navigation \(mobile\)/i })).toBeInTheDocument();
  });

  it('search form has accessible label', () => {
    renderWithRouter(<NavBar />);
    const searchForms = screen.getAllByRole('search');
    expect(searchForms.length).toBeGreaterThan(0);
  });
});

// ─── Footer Tests ─────────────────────────────────────────────────────────────

describe('Footer', () => {
  it('renders the ECI link', () => {
    renderWithRouter(<Footer />);
    const eciLink = screen.getByRole('link', { name: /Election Commission of India official website/i });
    expect(eciLink).toHaveAttribute('href', 'https://eci.gov.in');
    expect(eciLink).toHaveAttribute('target', '_blank');
  });

  it('shows "Last updated date unavailable" when lastUpdated is null', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText(/last updated date unavailable/i)).toBeInTheDocument();
  });

  it('does not show staleness warning when lastUpdated is null', () => {
    renderWithRouter(<Footer />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('Footer with recent lastUpdated', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('shows the formatted date when lastUpdated is set', () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 10); // 10 days ago — not stale

    vi.doMock('../context/AppContext', () => ({
      useAppData: () => ({
        state: {
          lastUpdated: recentDate,
          cmRecords: [],
          lokSabhaRecords: [],
          statePartyTenures: [],
          pmRecords: [],
          presidentRecords: [],
          electionSteps: [],
          faqEntries: [],
          dataLoadErrors: [],
        },
        dispatch: vi.fn(),
      }),
    }));
  });
});

// ─── NotFoundPage Tests ───────────────────────────────────────────────────────

describe('NotFoundPage', () => {
  it('renders a 404 heading', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it('renders a link back to home', () => {
    renderWithRouter(<NotFoundPage />);
    const homeLink = screen.getByRole('link', { name: /go to home page/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders a descriptive error message', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText(/the page you're looking for doesn't exist/i)).toBeInTheDocument();
  });
});

// ─── AppShell Tests ───────────────────────────────────────────────────────────

describe('AppShell', () => {
  it('renders NavBar and Footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<div>Home content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    // NavBar brand link
    expect(screen.getByRole('link', { name: /India Election Guide.*Home/i })).toBeInTheDocument();
    // Footer ECI link
    expect(screen.getByRole('link', { name: /Election Commission of India official website/i })).toBeInTheDocument();
    // Outlet content
    expect(screen.getByText('Home content')).toBeInTheDocument();
  });
});

// ─── isStale utility tests ────────────────────────────────────────────────────

import { isStale, formatDate } from '../utils/dateUtils';

describe('isStale', () => {
  it('returns false for null', () => {
    expect(isStale(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isStale(undefined)).toBe(false);
  });

  it('returns false for a date 10 days ago', () => {
    const d = new Date();
    d.setDate(d.getDate() - 10);
    expect(isStale(d)).toBe(false);
  });

  it('returns false for a date exactly 180 days ago', () => {
    const d = new Date();
    d.setDate(d.getDate() - 180);
    expect(isStale(d)).toBe(false);
  });

  it('returns true for a date 181 days ago', () => {
    const d = new Date();
    d.setDate(d.getDate() - 181);
    expect(isStale(d)).toBe(true);
  });

  it('returns true for a date 365 days ago', () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    expect(isStale(d)).toBe(true);
  });

  it('returns false for a future date', () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    expect(isStale(d)).toBe(false);
  });
});

describe('formatDate', () => {
  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('returns a non-empty string for a valid date', () => {
    const d = new Date('2024-01-15');
    const result = formatDate(d);
    expect(result).toBeTruthy();
    expect(result).toContain('2024');
  });
});
