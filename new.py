import re
import time
import requests
import pandas as pd
from dateutil import parser as dateparser
from datetime import datetime
from io import StringIO

# -----------------------------
# Config
# -----------------------------

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/123.0 Safari/537.36"
}

WIKI_BASE = "https://en.wikipedia.org/wiki/"

# 28 Indian states (you can add UTs with CMs if you want)
STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal"
]

# For each state, we will try pages in this order
def candidate_pages_for_state(state_name: str):
    base = state_name.replace(" ", "_")
    return [
        f"List_of_chief_ministers_of_{base}",
        f"Chief_Minister_of_{base}"
    ]

# -----------------------------
# Helpers
# -----------------------------

def get_html(url: str) -> str:
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    return resp.text

def parse_term_string(term: str):
    """
    Parse strings like:
      '14 January 2015 – 1 May 2018'
      '14 Jan 2015 – Incumbent'
      '1980–1984'
    into (start_datetime, end_datetime or None).
    """
    if not isinstance(term, str):
        return None, None
    s = term.strip()
    if not s:
        return None, None

    # Remove footnote markers like [1], [a]
    s = re.sub(r"\[[^\]]*\]", "", s).strip()

    # Split on dash variants
    if "–" in s or "-" in s:
        parts = re.split(r"[–-]", s)
        parts = [p.strip() for p in parts if p.strip()]
        if len(parts) == 2:
            raw_start, raw_end = parts
        else:
            raw_start, raw_end = parts[0], parts[-1]
    else:
        raw_start, raw_end = s, ""

    # Parse start
    start = None
    for candidate in [raw_start]:
        try:
            start = dateparser.parse(candidate, fuzzy=True, dayfirst=True)
            break
        except Exception:
            pass

    # Parse end
    end = None
    if raw_end and raw_end.lower() not in ["incumbent", "present"]:
        try:
            end = dateparser.parse(raw_end, fuzzy=True, dayfirst=True)
        except Exception:
            pass

    return start, end

def normalize_cols(cols):
    return [str(c).strip().lower().replace("\n", " ").replace("  ", " ") for c in cols]

def choose_cm_table(tables):
    """
    Pick a table that looks like the CM list:
    must have some 'party'/'political party' col and a term/date col.
    """
    for t in tables:
        cols = normalize_cols(t.columns)
        has_party = any("party" in c for c in cols)
        has_term = (
            any("term" in c for c in cols) or
            any("tenure" in c for c in cols) or
            any("in office" in c for c in cols) or
            any("took office" in c for c in cols)
        )
        if has_party and has_term:
            t.columns = cols
            return t
    return None

def extract_cm_rows_for_state(state: str):
    """
    Try Wikipedia pages for this state, parse CM table into rows:
      state, name, party, term_raw, start_date, end_date
    """
    rows = []
    page_candidates = candidate_pages_for_state(state)

    for page in page_candidates:
        url = WIKI_BASE + page
        try:
            html = get_html(url)
        except requests.HTTPError:
            continue

        try:
            tables = pd.read_html(StringIO(html))
        except ValueError:
            continue

        table = choose_cm_table(tables)
        if table is None:
            continue

        # Identify name, party, and term columns
        cols = list(table.columns)
        name_col = None
        party_col = None
        term_col = None
        took_office_col = None
        left_office_col = None

        for c in cols:
            lc = c.lower()
            if name_col is None and ("chief minister" in lc or "name" in lc or "ministers" in lc):
                name_col = c
            if party_col is None and "party" in lc:
                party_col = c
            if term_col is None and ("term" in lc or "tenure" in lc or "in office" in lc):
                term_col = c
            if took_office_col is None and "took office" in lc:
                took_office_col = c
            if left_office_col is None and "left office" in lc:
                left_office_col = c

        # If separate 'took office'/'left office' exist, we will use those
        use_separate_dates = took_office_col is not None and left_office_col is not None

        for _, r in table.iterrows():
            name = str(r[name_col]) if name_col is not None and pd.notna(r[name_col]) else None
            party = str(r[party_col]) if party_col is not None and pd.notna(r[party_col]) else None

            if not name or not party:
                continue

            # Raw term string (for debugging)
            if use_separate_dates:
                term_raw = f"{r[took_office_col]} – {r[left_office_col]}"
                start, end = None, None
                try:
                    start = dateparser.parse(str(r[took_office_col]), fuzzy=True, dayfirst=True)
                except Exception:
                    pass
                left_val = str(r[left_office_col]).strip()
                if left_val and left_val.lower() not in ["incumbent", "present"]:
                    try:
                        end = dateparser.parse(left_val, fuzzy=True, dayfirst=True)
                    except Exception:
                        end = None
            else:
                if term_col is None:
                    # Not enough info
                    continue
                term_raw = str(r[term_col])
                start, end = parse_term_string(term_raw)

            rows.append({
                "state": state,
                "name": name,
                "party": party,
                "term_raw": term_raw,
                "start_date": start,
                "end_date": end
            })

        # If we successfully parsed at least a few rows from this page, stop
        if rows:
            return rows

    return rows  # may be empty

# -----------------------------
# 1) Lok Sabha ruling party CSV
# -----------------------------

def scrape_lok_sabha_elections():
    url = WIKI_BASE + "List_of_Indian_general_elections"
    html = get_html(url)
    tables = pd.read_html(StringIO(html))

    elections_df = None
    for t in tables:
        if any("Election year" in str(c) for c in t.columns):
            elections_df = t.copy()
            break

    if elections_df is None:
        raise RuntimeError("Could not find Lok Sabha elections table")

    elections_df.columns = [
        str(c).strip().lower().replace("\n", " ").replace("  ", " ").replace(" ", "_")
        for c in elections_df.columns
    ]

    # Typical useful columns (may need tweaking if Wikipedia layout changes)
    keep_candidates = [
        "election_year",
        "lok_sabha",
        "party_in_government",
        "seats_won_by_the_ruling_party",
        "prime_minister",
        "voter_turnout"
    ]
    cols = [c for c in keep_candidates if c in elections_df.columns]
    if not cols:
        cols = elections_df.columns.tolist()

    elections_df = elections_df[cols].copy()

    # Save raw as CSV
    elections_df.to_csv("lok_sabha_ruling_party.csv", index=False)
    print("Saved lok_sabha_ruling_party.csv")

# -----------------------------
# 2) CMs for all states → CSV
# -----------------------------

def scrape_all_states_cm():
    all_rows = []
    for state in STATES:
        print(f"Scraping CMs for {state} ...")
        rows = extract_cm_rows_for_state(state)
        print(f"  Found {len(rows)} rows")
        all_rows.extend(rows)
        time.sleep(1.5)  # be polite to Wikipedia

    if not all_rows:
        print("No CM rows found; check your parsing logic.")
        return

    df = pd.DataFrame(all_rows)
    # Convert datetimes to ISO strings for CSV
    for col in ["start_date", "end_date"]:
        df[col] = df[col].apply(lambda x: x.isoformat() if isinstance(x, datetime) else "")

    df.to_csv("cm_raw_all_states.csv", index=False)
    print("Saved cm_raw_all_states.csv")

# -----------------------------
# 3) Optional aggregation: years in power per state+party
# -----------------------------

def aggregate_years_in_power(input_csv="cm_raw_all_states.csv", output_csv="state_party_years_all_states.csv"):
    df = pd.read_csv(input_csv)
    # Parse back dates
    for col in ["start_date", "end_date"]:
        df[col] = pd.to_datetime(df[col], errors="coerce")

    # Assume "today" for ongoing terms with no end_date
    today = pd.Timestamp.today().normalize()
    df["end_date_filled"] = df["end_date"].fillna(today)
    df["duration_days"] = (df["end_date_filled"] - df["start_date"]).dt.days

    # Drop obviously bad rows
    df = df[(df["duration_days"].notna()) & (df["duration_days"] > 0)]

    grouped = (
        df.groupby(["state", "party"], as_index=False)
          .agg(
              total_days=("duration_days", "sum"),
              first_start=("start_date", "min"),
              last_end=("end_date_filled", "max")
          )
    )
    grouped["total_years"] = grouped["total_days"] / 365.25
    grouped["first_year_in_power"] = grouped["first_start"].dt.year
    grouped["last_year_in_power"] = grouped["last_end"].dt.year

    grouped.to_csv(output_csv, index=False)
    print(f"Saved {output_csv}")

# -----------------------------
# Main
# -----------------------------

if __name__ == "__main__":
    scrape_lok_sabha_elections()
    scrape_all_states_cm()
    aggregate_years_in_power()