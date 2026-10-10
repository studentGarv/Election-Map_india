#!/usr/bin/env python3
"""Build the three public election-history CSVs from dated source tables."""

from __future__ import annotations

import csv
import html
import re
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime, timedelta
from pathlib import Path


AS_OF = date(2026, 10, 9)
BASE_URL = "https://janadeshonline.in"
STATE_SLUGS = {
    "Andhra Pradesh": "andhra-pradesh",
    "Arunachal Pradesh": "arunachal-pradesh",
    "Assam": "assam",
    "Bihar": "bihar",
    "Chhattisgarh": "chhattisgarh",
    "Delhi": "delhi",
    "Goa": "goa",
    "Gujarat": "gujarat",
    "Haryana": "haryana",
    "Himachal Pradesh": "himachal-pradesh",
    "Jammu and Kashmir": "jammu-and-kashmir",
    "Jharkhand": "jharkhand",
    "Karnataka": "karnataka",
    "Kerala": "kerala",
    "Madhya Pradesh": "madhya-pradesh",
    "Maharashtra": "maharashtra",
    "Manipur": "manipur",
    "Meghalaya": "meghalaya",
    "Mizoram": "mizoram",
    "Nagaland": "nagaland",
    "Odisha": "odisha",
    "Puducherry": "puducherry",
    "Punjab": "punjab",
    "Rajasthan": "rajasthan",
    "Sikkim": "sikkim",
    "Tamil Nadu": "tamil-nadu",
    "Telangana": "telangana",
    "Tripura": "tripura",
    "Uttar Pradesh": "uttar-pradesh",
    "Uttarakhand": "uttarakhand",
    "West Bengal": "west-bengal",
}

PARTY_NAME_FALLBACKS = {
    "ADSF": "Akali Dal (Sant Fateh Singh)",
    "AIADMK": "All India Anna Dravida Munnetra Kazhagam",
    "AINRC": "All India N.R. Congress",
    "APHLC": "All Party Hill Leaders Conference",
    "CFD": "Congress for Democracy",
    "GPC": "Goa People's Congress",
    "INCI": "Indian National Congress (Indira)",
    "INCO": "Indian National Congress (Organisation)",
    "INCR": "Indian National Congress (Requisitionists)",
    "INCS": "Indian National Congress (Socialist)",
    "INCU": "Indian National Congress (Urs)",
    "JDS": "Janata Dal (Secular)",
    "JDU": "Janata Dal (United)",
    "MGP": "Maharashtrawadi Gomantak Party",
    "MU": "Mizo Union",
    "MUF": "Manipur United Front",
    "NNDP": "Naga National Democratic Party",
    "SNC": "Sikkim National Congress",
    "SOCP": "Socialist Party",
    "SVD": "Samyukta Vidhayak Dal",
    "UDFP": "United Democratic Front Progressive",
}

# The seats column is the party's result in the linked general election. It is
# blank for caretaker successors whose breakaway party was not on that ballot.
LOK_SABHA_COLUMNS = [
    "election_year",
    "lok_sabha",
    "party_in_government",
    "seats_won_by_the_ruling_party",
    "prime_minister",
    "start_date",
    "end_date",
]

LOK_SABHA_ROWS = [
    ("1951–52", "First", "Indian National Congress", 364, "Jawaharlal Nehru", "1952-05-13", "1957-04-17"),
    ("1957", "Second", "Indian National Congress", 371, "Jawaharlal Nehru", "1957-04-17", "1962-04-02"),
    ("1962", "Third", "Indian National Congress", 361, "Jawaharlal Nehru", "1962-04-02", "1964-05-27"),
    ("1962", "Third", "Indian National Congress", 361, "Lal Bahadur Shastri", "1964-06-09", "1966-01-11"),
    ("1962", "Third", "Indian National Congress", 361, "Gulzarilal Nanda (acting)", "1964-05-27", "1964-06-09"),
    ("1967", "Fourth", "Indian National Congress", 283, "Indira Gandhi", "1966-01-24", "1971-03-15"),
    ("1971", "Fifth", "Indian National Congress", 352, "Indira Gandhi", "1971-03-15", "1977-03-24"),
    ("1977", "Sixth", "Janata Party", 295, "Morarji Desai", "1977-03-24", "1979-07-28"),
    ("1977", "Sixth", "Janata Party (Secular)", "", "Charan Singh", "1979-07-28", "1980-01-14"),
    ("1980", "Seventh", "Indian National Congress", 353, "Indira Gandhi", "1980-01-14", "1984-10-31"),
    ("1984", "Eighth", "Indian National Congress", 404, "Rajiv Gandhi", "1984-10-31", "1989-12-02"),
    ("1989", "Ninth", "Janata Dal", 143, "V. P. Singh", "1989-12-02", "1990-11-10"),
    ("1989", "Ninth", "Samajwadi Janata Party (Rashtriya)", "", "Chandra Shekhar", "1990-11-10", "1991-06-21"),
    ("1991", "Tenth", "Indian National Congress", 232, "P. V. Narasimha Rao", "1991-06-21", "1996-05-16"),
    ("1996", "Eleventh", "Bharatiya Janata Party", 161, "Atal Bihari Vajpayee", "1996-05-16", "1996-06-01"),
    ("1996", "Eleventh", "Janata Dal", 46, "H. D. Deve Gowda", "1996-06-01", "1997-04-21"),
    ("1996", "Eleventh", "Janata Dal", 46, "I. K. Gujral", "1997-04-21", "1998-03-19"),
    ("1998", "Twelfth", "Bharatiya Janata Party", 182, "Atal Bihari Vajpayee", "1998-03-19", "1999-10-13"),
    ("1999", "Thirteenth", "Bharatiya Janata Party", 182, "Atal Bihari Vajpayee", "1999-10-13", "2004-05-22"),
    ("2004", "Fourteenth", "Indian National Congress", 145, "Manmohan Singh", "2004-05-22", "2009-05-22"),
    ("2009", "Fifteenth", "Indian National Congress", 206, "Manmohan Singh", "2009-05-22", "2014-05-26"),
    ("2014", "Sixteenth", "Bharatiya Janata Party", 282, "Narendra Modi", "2014-05-26", "2019-05-30"),
    ("2019", "Seventeenth", "Bharatiya Janata Party", 303, "Narendra Modi", "2019-05-30", "2024-06-09"),
    ("2024", "Eighteenth", "Bharatiya Janata Party", 240, "Narendra Modi", "2024-06-09", ""),
]

OUTPUT_DIR = Path(__file__).resolve().parents[1] / "public" / "data"
DATE_RE = re.compile(r"^\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})\s*[–—-]\s*(present|current|\d{1,2}\s+[A-Za-z]+\s+\d{4})\s*$", re.I)
TAG_RE = re.compile(r"<[^>]+>")
ROW_RE = re.compile(r"<tr[^>]*>(.*?)</tr>", re.S)
CELL_RE = re.compile(r"<td[^>]*>(.*?)</td>", re.S)


def get(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "ElectionGuideDataBuilder/1.0 (public data extraction)"},
    )
    with urllib.request.urlopen(request, timeout=40) as response:
        return response.read().decode("utf-8", "replace")


def text_only(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(TAG_RE.sub("", value))).strip()


def parse_date(value: str) -> date:
    for pattern in ("%d %b %Y", "%d %B %Y"):
        try:
            return datetime.strptime(value.strip(), pattern).date()
        except ValueError:
            pass
    raise ValueError(f"Unsupported date: {value!r}")


def party_links(page: str) -> set[str]:
    return set(re.findall(r'href="/parties/([^"?#]+)"', page))


def extract_party_name(slug: str) -> str:
    page = get(f"{BASE_URL}/parties/{slug}")
    match = re.search(r"<title[^>]*>(.*?)</title>", page, re.S | re.I)
    if not match:
        raise ValueError(f"Party page has no title: {slug}")
    title = text_only(match.group(1)).replace(" | Janadesh Online", "")
    title = re.sub(
        r"\s+Election(?:\s+Results)?(?:\s*&\s*Seat(?:\s+History)?)?$",
        "",
        title,
        flags=re.I,
    ).strip()
    # Most titles end in "(CODE)"; preserve any parenthetical part of the name.
    code = slug.upper()
    title = re.sub(rf"\s+\({re.escape(code)}\)$", "", title, flags=re.I).strip()
    if not title:
        raise ValueError(f"Could not extract party name: {slug}")
    return title


def party_name_map(slugs: set[str]) -> dict[str, str]:
    names: dict[str, str] = {}
    errors: list[str] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        pending = {pool.submit(extract_party_name, slug): slug for slug in slugs}
        for future in as_completed(pending):
            slug = pending[future]
            try:
                names[slug] = future.result()
            except Exception as error:  # retain a readable code if a party page is unavailable
                names[slug] = slug.upper()
                errors.append(f"{slug}: {error}")
    if errors:
        print("Party-name fallbacks used:", "; ".join(sorted(errors)))
    return names


def page_records(state: str, page: str, names: dict[str, str]) -> list[dict[str, str | date | None]]:
    start = page.find(">Full timeline</h2>")
    if start < 0:
        raise ValueError(f"Full timeline heading missing for {state}")
    table = re.search(r"<table[^>]*>(.*?)</table>", page[start:], re.S | re.I)
    if not table:
        raise ValueError(f"Timeline table missing for {state}")

    records: list[dict[str, str | date | None]] = []
    for row in ROW_RE.findall(table.group(1)):
        cells = CELL_RE.findall(row)
        if len(cells) < 3:
            continue
        range_text = text_only(cells[0]).replace("\xa0", " ")
        date_match = DATE_RE.match(range_text)
        if not date_match:
            raise ValueError(f"Unparsed date range in {state}: {range_text!r}")
        start_date = parse_date(date_match.group(1))
        end_text = date_match.group(2)
        end_date = None if end_text.lower() in ("present", "current") else parse_date(end_text)
        raw_name = text_only(cells[1])

        if "office of chief minister abolished" in raw_name.lower() or "office abolished" in raw_name.lower():
            continue

        if len(cells) == 3 or "president" in raw_name.lower() or "governor's rule" in raw_name.lower():
            name = "President's Rule"
            party = "President's Rule"
            raw_term = f"{range_text}; {raw_name}"
        else:
            code = text_only(cells[2])
            link = re.search(r'href="/parties/([^"?#]+)"', cells[2])
            if not code:
                raise ValueError(f"Missing party for {state}, {raw_name}, {range_text}")
            slug = link.group(1) if link else ""
            party = names.get(slug, "") if link else ""
            if not party or party.upper() == slug.upper():
                party = PARTY_NAME_FALLBACKS.get(code.upper(), party or code)
            name = raw_name
            raw_term = range_text

        records.append({
            "state": state,
            "name": name,
            "party": party,
            "start_date": start_date,
            "end_date": end_date,
            "term_raw": raw_term,
            "source_end": end_date,
        })
    return records


def write_csv(path: Path, headers: list[str], rows: list[dict[str, object]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def build() -> None:
    state_pages: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        pending = {
            pool.submit(get, f"{BASE_URL}/chief-ministers/{slug}"): state
            for state, slug in STATE_SLUGS.items()
        }
        for future in as_completed(pending):
            state_pages[pending[future]] = future.result()

    slugs = set().union(*(party_links(page) for page in state_pages.values()))
    names = party_name_map(slugs)
    records = [
        record
        for state, page in state_pages.items()
        for record in page_records(state, page, names)
    ]
    records.sort(key=lambda record: (str(record["state"]), record["start_date"], str(record["name"])))

    deduped: list[dict[str, object]] = []
    seen: set[tuple[str, str, date]] = set()
    for record in records:
        key = (str(record["state"]), str(record["name"]), record["start_date"])
        if key not in seen:
            seen.add(key)
            deduped.append(record)

    # Some source ranges share the swearing-in day. Make adjacent date-only
    # intervals non-overlapping so the derived day totals do not count that day twice.
    by_state: dict[str, list[dict[str, object]]] = defaultdict(list)
    for record in deduped:
        by_state[str(record["state"])].append(record)
    for state_records in by_state.values():
        state_records.sort(key=lambda record: record["start_date"])
        for index in range(len(state_records) - 1):
            current = state_records[index]
            following = state_records[index + 1]
            end = current["end_date"]
            next_start = following["start_date"]
            if end is not None and end >= next_start and end > current["start_date"]:
                current["end_date"] = next_start - timedelta(days=1)

    cm_rows = []
    for record in deduped:
        cm_rows.append({
            "state": record["state"],
            "name": record["name"],
            "party": record["party"],
            "start_date": record["start_date"].isoformat(),
            "end_date": record["end_date"].isoformat() if record["end_date"] else "",
            "term_raw": record["term_raw"],
        })

    aggregate: dict[tuple[str, str], dict[str, object]] = {}
    for record in deduped:
        state = str(record["state"])
        party = str(record["party"])
        start_date = record["start_date"]
        end_date = record["end_date"] or AS_OF
        if end_date < start_date:
            continue
        days = (end_date - start_date).days + 1
        item = aggregate.setdefault((state, party), {
            "state": state,
            "party": party,
            "total_days": 0,
            "first_start": start_date,
            "last_end": end_date,
            "first_year_in_power": start_date.year,
            "last_year_in_power": end_date.year,
        })
        item["total_days"] += days
        item["first_start"] = min(item["first_start"], start_date)
        item["last_end"] = max(item["last_end"], end_date)
        item["first_year_in_power"] = item["first_start"].year
        item["last_year_in_power"] = item["last_end"].year

    tenure_rows = []
    for item in aggregate.values():
        days = int(item["total_days"])
        tenure_rows.append({
            "state": item["state"],
            "party": item["party"],
            "total_days": days,
            "first_start": item["first_start"].isoformat(),
            "last_end": item["last_end"].isoformat(),
            "total_years": f"{days / 365.25:.2f}",
            "first_year_in_power": item["first_year_in_power"],
            "last_year_in_power": item["last_year_in_power"],
        })
    # Newest last_end first within each state. This also makes getCurrentParty's
    # stable year-only sort choose the current party when a state changed parties
    # more than once during the same year.
    tenure_rows.sort(key=lambda row: (row["state"], -date.fromisoformat(str(row["last_end"])).toordinal()))

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    write_csv(OUTPUT_DIR / "cm_raw_all_states.csv",
              ["state", "name", "party", "start_date", "end_date", "term_raw"], cm_rows)
    lok_rows = [dict(zip(LOK_SABHA_COLUMNS, values)) for values in LOK_SABHA_ROWS]
    write_csv(OUTPUT_DIR / "lok_sabha_ruling_party.csv", LOK_SABHA_COLUMNS, lok_rows)
    write_csv(OUTPUT_DIR / "state_party_years_all_states.csv",
              ["state", "party", "total_days", "first_start", "last_end", "total_years", "first_year_in_power", "last_year_in_power"],
              tenure_rows)
    print(f"Wrote {len(cm_rows)} CM rows across {len(by_state)} state/UT histories.")
    print(f"Wrote {len(LOK_SABHA_ROWS)} Lok Sabha / PM history rows.")
    print(f"Wrote {len(tenure_rows)} party-tenure summaries as of {AS_OF.isoformat()}.")


if __name__ == "__main__":
    build()
