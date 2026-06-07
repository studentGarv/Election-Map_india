/**
 * IndiaMap Component
 *
 * Renders all Indian states and union territories as SVG paths using
 * react-simple-maps. Each region is:
 *  - Color-coded by the current ruling party (derived from StatePartyTenure)
 *  - Hoverable (tooltip showing state name) — task 6.3
 *  - Clickable (calls onStateClick)
 *  - Keyboard-navigable (tabIndex, aria-label, onKeyDown Enter/Space) — task 6.5
 *
 * ColorLegend sub-component — task 6.6
 */

import React, { useState, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import type { StatePartyTenure } from '../types';
import { getPartyColor } from '../utils/partyColors';

// ─── India TopoJSON source ────────────────────────────────────────────────────

const INDIA_TOPO_URL =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derives the current ruling party for a state from StatePartyTenure records.
 * Returns the party with the highest lastYearInPower (most recently in power).
 */
function getCurrentParty(
  stateName: string,
  stateData: StatePartyTenure[]
): string {
  const tenures = stateData.filter(
    (t) => t.state.toLowerCase() === stateName.toLowerCase()
  );
  if (tenures.length === 0) return '';

  const sorted = [...tenures].sort((a, b) => b.lastYearInPower - a.lastYearInPower);
  return sorted[0].party;
}

/**
 * Extracts the state name from a GeoJSON feature's properties.
 * The TopoJSON from deldersveld uses "NAME_1" for Indian state names.
 */
function getStateName(geo: { properties: Record<string, string> }): string {
  return (
    geo.properties['NAME_1'] ||
    geo.properties['name'] ||
    geo.properties['NAME'] ||
    geo.properties['st_nm'] ||
    ''
  );
}

// ─── ColorLegend ──────────────────────────────────────────────────────────────

interface ColorLegendProps {
  /** Map of party name → color hex string */
  partyColors: Record<string, string>;
}

/**
 * Displays a legend mapping party names to their map colors.
 * Rendered alongside the map (task 6.6).
 */
export const ColorLegend: React.FC<ColorLegendProps> = ({ partyColors }) => {
  const entries = Object.entries(partyColors).filter(([party]) => party.trim() !== '');

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
            <span className="truncate" title={party}>
              {party}
            </span>
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
  /** State party tenure data used for color-coding each state by ruling party */
  stateData: StatePartyTenure[];
  /** Called when a state region is clicked or activated via keyboard */
  onStateClick: (stateName: string) => void;
  /** Currently selected state (highlighted with a distinct color) */
  selectedState?: string | null;
}

// ─── IndiaMap Component ───────────────────────────────────────────────────────

/**
 * Interactive SVG map of India using react-simple-maps.
 * Each state/UT is color-coded by the current ruling party derived from
 * StatePartyTenure data (the party with the highest lastYearInPower wins).
 */
const IndiaMap: React.FC<IndiaMapProps> = ({
  stateData,
  onStateClick,
  selectedState = null,
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  // Accumulated party → color map used by the ColorLegend sub-component
  const [legendColors, setLegendColors] = useState<Record<string, string>>({});

  const handleMouseEnter = useCallback(
    (geo: { properties: Record<string, string> }, event: React.MouseEvent) => {
      const name = getStateName(geo);
      // Clamp x so the tooltip doesn't overflow the right edge of the viewport.
      // Approximate tooltip width is ~120px; keep at least 8px from the right edge.
      const TOOLTIP_WIDTH = 120;
      const MARGIN = 8;
      const clampedX =
        event.clientX + 12 + TOOLTIP_WIDTH > window.innerWidth - MARGIN
          ? event.clientX - TOOLTIP_WIDTH - 4
          : event.clientX + 12;
      setTooltip({
        visible: true,
        x: clampedX,
        y: event.clientY,
        content: name,
      });
    },
    []
  );

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltip((prev) => {
      if (!prev.visible) return prev;
      // Re-apply edge clamping on mouse move
      const TOOLTIP_WIDTH = 120;
      const MARGIN = 8;
      const clampedX =
        event.clientX + 12 + TOOLTIP_WIDTH > window.innerWidth - MARGIN
          ? event.clientX - TOOLTIP_WIDTH - 4
          : event.clientX + 12;
      return { ...prev, x: clampedX, y: event.clientY };
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleClick = useCallback(
    (geo: { properties: Record<string, string> }) => {
      const name = getStateName(geo);
      if (name) onStateClick(name);
    },
    [onStateClick]
  );

  const handleKeyDown = useCallback(
    (geo: { properties: Record<string, string> }, event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const name = getStateName(geo);
        if (name) onStateClick(name);
      }
    },
    [onStateClick]
  );

  return (
    <div className="relative w-full">
      {/* Tooltip — shows state name on hover (task 6.3) */}
      {tooltip.visible && (
        <div
          role="tooltip"
          className="fixed z-50 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 28,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* SVG Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [82, 22],
          scale: 900,
        }}
        width={600}
        height={650}
        style={{ width: '100%', height: 'auto' }}
        aria-label="Interactive map of India showing states and union territories"
        role="img"
      >
        <Geographies geography={INDIA_TOPO_URL}>
          {({ geographies }) => {
            // Collect party colors from all rendered states for the legend
            const newLegendColors: Record<string, string> = {};

            const elements = geographies.map((geo) => {
              const stateName = getStateName(geo);
              const party = getCurrentParty(stateName, stateData);
              const fillColor = party ? getPartyColor(party) : '#D1D5DB';

              if (party) {
                newLegendColors[party] = fillColor;
              }

              const isSelected =
                !!selectedState &&
                stateName.toLowerCase() === selectedState.toLowerCase();

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  tabIndex={0}
                  aria-label={stateName || 'Unknown region'}
                  role="button"
                  aria-pressed={isSelected ? 'true' : 'false'}
                  onClick={() => handleClick(geo)}
                  onKeyDown={(e) => handleKeyDown(geo, e)}
                  onMouseEnter={(e) => handleMouseEnter(geo, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: isSelected ? '#1E40AF' : fillColor,
                      stroke: '#FFFFFF',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: isSelected ? '#1E40AF' : '#93C5FD',
                      stroke: '#FFFFFF',
                      strokeWidth: 0.8,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: '#1E40AF',
                      stroke: '#FFFFFF',
                      strokeWidth: 0.8,
                      outline: 'none',
                    },
                  }}
                />
              );
            });

            // Schedule legend update after render to avoid setState-during-render
            if (
              Object.keys(newLegendColors).length > 0 &&
              JSON.stringify(newLegendColors) !== JSON.stringify(legendColors)
            ) {
              setTimeout(() => setLegendColors(newLegendColors), 0);
            }

            return <>{elements}</>;
          }}
        </Geographies>
      </ComposableMap>

      {/* Color Legend sub-component (task 6.6) */}
      <ColorLegend partyColors={legendColors} />
    </div>
  );
};

export default IndiaMap;
