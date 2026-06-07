/**
 * Party Color Utility
 *
 * Assigns deterministic, visually distinct colors to Indian political parties.
 * Known major parties get fixed brand-aligned colors; unknown parties get a
 * hash-derived color from a palette of distinct hues.
 */

// ─── Known Party Colors ───────────────────────────────────────────────────────

/**
 * Fixed color map for major Indian political parties.
 * Colors are chosen to be visually distinct and loosely aligned with party
 * branding where applicable.
 */
export const KNOWN_PARTY_COLORS: Record<string, string> = {
  // National parties
  'BJP': '#FF6B35',           // Saffron/orange — BJP's primary color
  'INC': '#19A7CE',           // Congress blue/teal
  'BSP': '#1565C0',           // Blue — BSP's elephant symbol color
  'CPI(M)': '#D32F2F',        // Red — Communist party
  'CPI': '#B71C1C',           // Dark red — Communist party
  'NCP': '#1B5E20',           // Dark green
  'SP': '#E53935',            // Red — Samajwadi Party
  'AAP': '#00BCD4',           // Cyan — Aam Aadmi Party
  'TMC': '#4CAF50',           // Green — Trinamool Congress
  'AITC': '#4CAF50',          // Green — All India Trinamool Congress (alias)
  'JD(U)': '#FF9800',         // Orange — Janata Dal United
  'JD(S)': '#8BC34A',         // Light green — Janata Dal Secular
  'RJD': '#9C27B0',           // Purple — Rashtriya Janata Dal
  'SS': '#FF5722',            // Deep orange — Shiv Sena
  'Shiv Sena': '#FF5722',     // Deep orange
  'TDP': '#FFEB3B',           // Yellow — Telugu Desam Party
  'YSRCP': '#3F51B5',         // Indigo — YSR Congress
  'DMK': '#F44336',           // Red — Dravida Munnetra Kazhagam
  'AIADMK': '#009688',        // Teal — All India Anna DMK
  'BJD': '#00897B',           // Teal-green — Biju Janata Dal
  'TRS': '#E91E63',           // Pink — Telangana Rashtra Samithi
  'BRS': '#E91E63',           // Pink — Bharat Rashtra Samithi (renamed TRS)
  'SAD': '#795548',           // Brown — Shiromani Akali Dal
  'NC': '#607D8B',            // Blue-grey — National Conference
  'PDP': '#9E9E9E',           // Grey — Peoples Democratic Party
  'MNS': '#FF7043',           // Deep orange — Maharashtra Navnirman Sena
  'INLD': '#66BB6A',          // Green — Indian National Lok Dal
  'HJC': '#AB47BC',           // Purple — Haryana Janhit Congress
  'SDF': '#26C6DA',           // Cyan — Sikkim Democratic Front
  'NPF': '#5C6BC0',           // Indigo — Naga Peoples Front
  'NPP': '#42A5F5',           // Blue — National People's Party
  'MDA': '#EC407A',           // Pink — Mizo Democratic Alliance
  'ZPM': '#7E57C2',           // Deep purple — Zoram People's Movement
  'MNF': '#26A69A',           // Teal — Mizo National Front
  'AGP': '#FFA726',           // Orange — Asom Gana Parishad
  'UPPL': '#29B6F6',          // Light blue — United People's Party Liberal
  'GFP': '#D4E157',           // Lime — Goa Forward Party
  'MGP': '#FFCA28',           // Amber — Maharashtrawadi Gomantak Party
  'President Rule': '#9E9E9E', // Grey — President's Rule / Governor's Rule
  "President's Rule": '#9E9E9E',
  "Governor's Rule": '#9E9E9E',
  'Independent': '#78909C',   // Blue-grey — Independent
};

// ─── Fallback Color Palette ───────────────────────────────────────────────────

/**
 * A palette of visually distinct colors used for parties not in KNOWN_PARTY_COLORS.
 * These are chosen to be distinguishable from each other and from the known colors.
 */
const FALLBACK_PALETTE: string[] = [
  '#F06292', '#BA68C8', '#4DB6AC', '#FFB74D', '#A1887F',
  '#90A4AE', '#AED581', '#4DD0E1', '#FF8A65', '#CE93D8',
  '#80CBC4', '#FFCC02', '#B0BEC5', '#C5E1A5', '#FFAB91',
  '#80DEEA', '#EF9A9A', '#A5D6A7', '#FFF176', '#B39DDB',
];

// ─── Hash Function ────────────────────────────────────────────────────────────

/**
 * Computes a simple deterministic hash of a string, returning a non-negative integer.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns a deterministic color string for the given party name.
 *
 * - Known major parties get their fixed brand color.
 * - Unknown parties get a color derived from a hash of their name, ensuring
 *   the same party always receives the same color across all renders.
 */
export function getPartyColor(partyName: string): string {
  if (!partyName || partyName.trim() === '') {
    return '#BDBDBD'; // Default grey for empty/unknown
  }

  const trimmed = partyName.trim();

  // Check known parties (case-sensitive first, then case-insensitive)
  if (KNOWN_PARTY_COLORS[trimmed] !== undefined) {
    return KNOWN_PARTY_COLORS[trimmed];
  }

  // Case-insensitive lookup
  const upperKey = Object.keys(KNOWN_PARTY_COLORS).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase()
  );
  if (upperKey !== undefined) {
    return KNOWN_PARTY_COLORS[upperKey];
  }

  // Hash-based fallback for unknown parties
  const index = hashString(trimmed) % FALLBACK_PALETTE.length;
  return FALLBACK_PALETTE[index];
}

/**
 * Builds a complete party → color map from an array of party names.
 * Each party is guaranteed to receive the same color on every call.
 */
export function buildPartyColorMap(partyNames: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const name of partyNames) {
    map[name] = getPartyColor(name);
  }
  return map;
}

/**
 * Pre-built color map for all known major parties.
 * Exported for direct use in components.
 */
export const partyColorMap: Record<string, string> = { ...KNOWN_PARTY_COLORS };
