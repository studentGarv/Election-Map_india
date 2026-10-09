/**
 * IndiaMap Component
 *
 * Uses @vishalvoid/react-india-map which ships with correct post-2019
 * administrative boundaries — including Jammu & Kashmir (IN-JK) and
 * Ladakh (IN-LA) as two separate Union Territories.
 *
 * Features:
 *  - Correct J&K / Ladakh split (real geographic boundary, not a straight line)
 *  - Full India map — all states and UTs visible
 *  - Color-coded by distinct political-map palette OR by ruling party
 *  - Click / hover / keyboard navigation
 *  - Color legend
 *
 * ColorLegend sub-component — task 6.6
 */

import React, { useState, useCallback } from 'react';
import { IndiaMap as BaseIndiaMap } from '@vishalvoid/react-india-map';
import type { StatePartyTenure } from '../types';
import { getPartyColor } from '../utils/partyColors';
import { getCurrentParty } from '../utils/mapUtils';

// ─── State ID ↔ Name mapping ─────────────────────────────────────────────────
// Maps the package's ISO IDs (e.g. "IN-MH") to display names used in the app.

export const STATE_ID_TO_NAME: Record<string, string> = {
  'IN-AP': 'Andhra Pradesh',
  'IN-AR': 'Arunachal Pradesh',
  'IN-AS': 'Assam',
  'IN-BR': 'Bihar',
  'IN-CT': 'Chhattisgarh',
  'IN-GA': 'Goa',
  'IN-GJ': 'Gujarat',
  'IN-HR': 'Haryana',
  'IN-HP': 'Himachal Pradesh',
  'IN-JH': 'Jharkhand',
  'IN-KA': 'Karnataka',
  'IN-KL': 'Kerala',
  'IN-MP': 'Madhya Pradesh',
  'IN-MH': 'Maharashtra',
  'IN-MN': 'Manipur',
  'IN-ML': 'Meghalaya',
  'IN-MZ': 'Mizoram',
  'IN-NL': 'Nagaland',
  'IN-OR': 'Odisha',
  'IN-PB': 'Punjab',
  'IN-RJ': 'Rajasthan',
  'IN-SK': 'Sikkim',
  'IN-TN': 'Tamil Nadu',
  'IN-TG': 'Telangana',
  'IN-TR': 'Tripura',
  'IN-UP': 'Uttar Pradesh',
  'IN-UT': 'Uttarakhand',
  'IN-WB': 'West Bengal',
  // Union Territories
  'IN-AN': 'Andaman and Nicobar',
  'IN-CH': 'Chandigarh',
  'IN-DN': 'Dadra and Nagar Haveli and Daman and Diu',
  'IN-DL': 'Delhi',
  'IN-JK': 'Jammu and Kashmir',
  'IN-LA': 'Ladakh',
  'IN-LD': 'Lakshadweep',
  'IN-PY': 'Puducherry',
};

const STATE_NAME_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_ID_TO_NAME).map(([id, name]) => [name.toLowerCase(), id])
);

// ─── Political map colors (distinct per-state) ────────────────────────────────

const STATE_MAP_COLORS: Record<string, string> = {
  'IN-AP': '#F4A460',  // Andhra Pradesh — sandy brown
  'IN-AR': '#98D8C8',  // Arunachal Pradesh — mint green
  'IN-AS': '#FFD700',  // Assam — gold
  'IN-BR': '#DDA0DD',  // Bihar — plum
  'IN-CT': '#87CEEB',  // Chhattisgarh — sky blue
  'IN-GA': '#FF9999',  // Goa — light pink
  'IN-GJ': '#98FB98',  // Gujarat — pale green
  'IN-HR': '#F0E68C',  // Haryana — khaki
  'IN-HP': '#D8B4FE',  // Himachal Pradesh — lavender (matches reference)
  'IN-JH': '#FFB347',  // Jharkhand — pastel orange
  'IN-KA': '#A8D5A2',  // Karnataka — sage green
  'IN-KL': '#FF8C94',  // Kerala — pastel red
  'IN-MP': '#FFDAB9',  // Madhya Pradesh — peach
  'IN-MH': '#D8BFD8',  // Maharashtra — thistle
  'IN-MN': '#AFEEEE',  // Manipur — pale turquoise
  'IN-ML': '#C8F7C5',  // Meghalaya — light green
  'IN-MZ': '#FFE4B5',  // Mizoram — moccasin
  'IN-NL': '#E0FFFF',  // Nagaland — light cyan
  'IN-OR': '#FFA07A',  // Odisha — light salmon
  'IN-PB': '#A5F3FC',  // Punjab — light cyan-blue (matches reference)
  'IN-RJ': '#FDE68A',  // Rajasthan — light amber
  'IN-SK': '#C8E6C9',  // Sikkim — light green
  'IN-TN': '#FCA5A5',  // Tamil Nadu — light red
  'IN-TG': '#CE93D8',  // Telangana — light purple
  'IN-TR': '#B2EBF2',  // Tripura — light blue
  'IN-UP': '#FFCC80',  // Uttar Pradesh — light orange
  'IN-UT': '#A5D6A7',  // Uttarakhand — green
  'IN-WB': '#EF9A9A',  // West Bengal — light red
  // Union Territories
  'IN-AN': '#80CBC4',  // Andaman & Nicobar — teal
  'IN-CH': '#FFE082',  // Chandigarh — amber
  'IN-DN': '#BCAAA4',  // Dadra/Daman — brown-grey
  'IN-DL': '#90CAF9',  // Delhi — light blue
  'IN-JK': '#FBBF8C',  // Jammu & Kashmir — salmon/peach (matches reference)
  'IN-LA': '#F5DEB3',  // Ladakh — wheat/sandy (matches reference — large pale region)
  'IN-LD': '#80DEEA',  // Lakshadweep — cyan
  'IN-PY': '#F48FB1',  // Puducherry — light pink
};

const DEFAULT_COLOR = '#D1D5DB';
const SELECTED_COLOR = '#1E40AF';
const HOVER_COLOR = '#93C5FD';

// ─── ColorLegend ──────────────────────────────────────────────────────────────

interface ColorLegendProps {
  partyColors: Record<string, string>;
}

export const ColorLegend: React.FC<ColorLegendProps> = ({ partyColors }) => {
  const entries = Object.entries(partyColors).filter(([p]) => p.trim() !== '');
  if (entries.length === 0) return null;

  return (
    <div
      className="mt-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200"
      aria-label="Party color legend"
      role="region"
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Party Legend</h3>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1" role="list">
        {entries.map(([party, color]) => (
          <li key={party} className="flex items-center gap-2 text-xs text-gray-600">
            <span
              className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="truncate" title={party}>{party}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

// ─── IndiaMap Props ───────────────────────────────────────────────────────────

export interface IndiaMapProps {
  stateData: StatePartyTenure[];
  onStateClick: (stateName: string) => void;
  selectedState?: string | null;
  viewMode?: 'party' | 'map';
}

// ─── IndiaMap Component ───────────────────────────────────────────────────────

/**
 * Interactive map of India built on @vishalvoid/react-india-map.
 *
 * Uses the package's correct post-2019 SVG paths so J&K and Ladakh
 * appear with their real geographic boundaries (not a straight-line split).
 *
 * We wrap the base component and intercept its onStateHover / onStateClick
 * events (which give us ISO codes like "IN-JK") to translate them into
 * state names used by the rest of the app.
 */
const IndiaMap: React.FC<IndiaMapProps> = ({
  stateData,
  onStateClick,
  selectedState = null,
  viewMode = 'map',
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, content: '',
  });
  const [legendColors, setLegendColors] = useState<Record<string, string>>({});
  const [internalMode, setInternalMode] = useState<'party' | 'map'>(viewMode);
  const activeMode = internalMode;

  // ── Build per-state fill color map for the base component ─────────────────
  // The base component accepts stateData[] with { id, customData } —
  // we abuse this by encoding the fill color in customData.color.
  // However, the base component doesn't support per-state colors directly
  // through stateData; it uses a single backgroundColor.
  //
  // Instead we use CSS custom styling: render an invisible overlay and style
  // each SVG path directly after mount.
  //
  // Actually, looking at the package API, mapStyle only supports one global
  // backgroundColor. To get per-state coloring we need to inject CSS that
  // targets each state's path by its data attribute or id.


  // Generate CSS rules for all state paths
  const generateStateCSS = useCallback((): string => {
    const newLegendColors: Record<string, string> = {};
    const rules = Object.keys(STATE_ID_TO_NAME).map((id) => {
      const stateName = STATE_ID_TO_NAME[id];
      const isSelected = !!selectedState && stateName.toLowerCase() === selectedState.toLowerCase();
      let color: string;

      if (isSelected) {
        color = SELECTED_COLOR;
      } else if (activeMode === 'party') {
        const party = getCurrentParty(stateName, stateData);
        color = party ? getPartyColor(party) : DEFAULT_COLOR;
        if (party) newLegendColors[party] = color;
      } else {
        color = STATE_MAP_COLORS[id] ?? DEFAULT_COLOR;
      }

      // The package renders SVG <path id="IN-MH" ...> so we target by id
      return `#${id} { fill: ${color} !important; transition: fill 0.2s; }
#${id}:hover { fill: ${isSelected ? SELECTED_COLOR : HOVER_COLOR} !important; cursor: pointer; }`;
    });

    // Update legend after render
    if (activeMode === 'party' && Object.keys(newLegendColors).length > 0) {
      setTimeout(() => setLegendColors(newLegendColors), 0);
    }

    return rules.join('\n');
  }, [activeMode, stateData, selectedState]);


  const handleStateHover = useCallback((stateId: string) => {
    const name = STATE_ID_TO_NAME[stateId] ?? stateId;
    setTooltip(prev => ({ ...prev, visible: true, content: name }));
  }, []);

  const handleStateClick = useCallback((stateId: string) => {
    const name = STATE_ID_TO_NAME[stateId] ?? stateId;
    if (name) onStateClick(name);
  }, [onStateClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const TOOLTIP_WIDTH = 180;
    const MARGIN = 8;
    const clampedX = e.clientX + 12 + TOOLTIP_WIDTH > window.innerWidth - MARGIN
      ? e.clientX - TOOLTIP_WIDTH - 4
      : e.clientX + 12;
    setTooltip(prev => ({ ...prev, x: clampedX, y: e.clientY }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // Build stateData for the base component (we only need the IDs; color is via CSS)
  const baseStateData = Object.keys(STATE_ID_TO_NAME).map(id => ({ id }));

  // Determine the selected state's ISO id for highlighting
  const selectedId = selectedState
    ? STATE_NAME_TO_ID[selectedState.toLowerCase()]
    : null;

  return (
    <div className="relative w-full">
      {/* View-mode toggle */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-gray-600">Color by:</span>
        <button
          onClick={() => setInternalMode('map')}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            activeMode === 'map'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Political Map
        </button>
        <button
          onClick={() => setInternalMode('party')}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            activeMode === 'party'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Ruling Party
        </button>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          role="tooltip"
          className="fixed z-50 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y - 28 }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Inject per-state CSS colors */}
      <style>{generateStateCSS()}</style>

      {/* Map container */}
      <div
        className="rounded-xl overflow-hidden shadow-lg border border-gray-200"
        style={{ background: 'linear-gradient(135deg, #AED6F1 0%, #85C1E9 100%)' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Title bar */}
        <div className="bg-white bg-opacity-90 px-4 py-2 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-800 tracking-wide">INDIA</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            States &amp; UTs Political Map
          </p>
        </div>

        {/* The base component renders the correct SVG with proper J&K + Ladakh boundaries */}
        <div
          className="india-map-wrapper p-2"
          style={{ background: 'transparent' }}
          aria-label="Interactive map of India"
        >
          <BaseIndiaMap
            mapStyle={{
              backgroundColor: DEFAULT_COLOR,
              hoverColor: HOVER_COLOR,
              stroke: '#FFFFFF',
              strokeWidth: 0.8,
              tooltipConfig: {
                backgroundColor: 'transparent',
                textColor: 'transparent',
              },
            }}
            stateData={baseStateData}
            onStateHover={handleStateHover}
            onStateClick={handleStateClick}
          />
        </div>

        {/* Footer */}
        <div className="bg-white bg-opacity-80 px-4 py-1.5 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-400">
            Click any state to view its election history
          </p>
        </div>
      </div>

      {/* Legend */}
      {activeMode === 'party' && <ColorLegend partyColors={legendColors} />}

      {activeMode === 'map' && (
        <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0 bg-blue-700" />
              <span>Selected State</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span
                className="inline-block w-5 h-3 flex-shrink-0 border border-gray-300"
                style={{ background: 'linear-gradient(90deg, #AED6F1, #85C1E9)' }}
              />
              <span>Water Bodies</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndiaMap;
