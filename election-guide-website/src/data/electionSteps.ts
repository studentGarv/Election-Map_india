/**
 * Static Election Step data bundled with the application.
 *
 * Covers Lok Sabha, Rajya Sabha, and State Assembly election processes.
 * Each step's description is ≤ 50 words per Requirement 1.3.
 */

import type { ElectionStep } from '../types';

export const electionSteps: ElectionStep[] = [
  // ─── Lok Sabha Steps ──────────────────────────────────────────────────────

  {
    id: 'ls-01-voter-registration',
    title: 'Voter Registration',
    electionType: 'lok_sabha',
    order: 1,
    dateRange: 'Ongoing (rolls updated annually; special drives before election announcement)',
    description:
      'Citizens aged 18 or above register on the Electoral Roll using Form 6 at their local Electoral Registration Officer. Existing voters update details via Form 8. The final roll is published before the election schedule is announced.',
    keyDates: [
      'Annual summary revision: January 1 qualifying date',
      'Special summary revision: notified by Election Commission',
      'Last date to file Form 6: typically 30 days before poll date',
    ],
    responsibleParties: [
      'Election Commission of India (ECI)',
      'Chief Electoral Officer (state)',
      'Electoral Registration Officer (district)',
    ],
    citizenActions: [
      'Submit Form 6 online at voters.eci.gov.in or at the ERO office',
      'Verify your name on the draft electoral roll',
      'Correct errors using Form 8 before the final roll is published',
    ],
    externalLinks: [
      { label: 'Voter Registration Portal', url: 'https://voters.eci.gov.in' },
      { label: 'Election Commission of India', url: 'https://eci.gov.in' },
    ],
    relatedStepIds: ['ls-02-election-announcement', 'ls-03-model-code-of-conduct'],
  },
  {
    id: 'ls-02-election-announcement',
    title: 'Election Announcement',
    electionType: 'lok_sabha',
    order: 2,
    dateRange: 'Approximately 4–6 weeks before polling day',
    description:
      'The Election Commission announces the election schedule, specifying polling dates for each phase. This triggers the Model Code of Conduct. The President issues a notification dissolving the outgoing Lok Sabha if required.',
    keyDates: [
      'Press conference by ECI announcing schedule',
      'Gazette notification of election dates',
      'MCC comes into force immediately on announcement',
    ],
    responsibleParties: [
      'Election Commission of India',
      'President of India',
      'Ministry of Law and Justice',
    ],
    citizenActions: [
      "Check the official ECI website for your constituency's polling date",
      'Note the last date for filing nominations in your constituency',
    ],
    externalLinks: [
      { label: 'ECI Election Schedule', url: 'https://eci.gov.in/election-schedule' },
    ],
    relatedStepIds: ['ls-01-voter-registration', 'ls-03-model-code-of-conduct'],
  },
  {
    id: 'ls-03-model-code-of-conduct',
    title: 'Model Code of Conduct',
    electionType: 'lok_sabha',
    order: 3,
    dateRange: 'From election announcement until results are declared',
    description:
      'The Model Code of Conduct (MCC) restricts government announcements, use of state resources for campaigning, and party conduct. It ensures a level playing field for all candidates and parties during the election period.',
    keyDates: [
      'MCC in force: from date of election announcement',
      'MCC lifted: after results are declared',
    ],
    responsibleParties: [
      'Election Commission of India',
      'All political parties and candidates',
      'Central and state governments',
    ],
    citizenActions: [
      'Report MCC violations to the ECI via the cVIGIL app',
      'Avoid participating in activities that violate the MCC',
    ],
    externalLinks: [
      { label: 'cVIGIL App', url: 'https://cvigil.eci.gov.in' },
      { label: 'MCC Guidelines', url: 'https://eci.gov.in/model-code-of-conduct' },
    ],
    relatedStepIds: ['ls-02-election-announcement', 'ls-04-nomination'],
  },
  {
    id: 'ls-04-nomination',
    title: 'Nomination Filing',
    electionType: 'lok_sabha',
    order: 4,
    dateRange: 'Typically 7–14 days after election announcement',
    description:
      'Candidates file nomination papers with the Returning Officer of their constituency. Each candidate must submit a security deposit and an affidavit disclosing assets, liabilities, criminal antecedents, and educational qualifications.',
    keyDates: [
      'Last date for filing nominations (per gazette notification)',
      'Scrutiny of nominations: day after last filing date',
      'Last date for withdrawal of candidature: 2 days after scrutiny',
    ],
    responsibleParties: [
      'Returning Officer (constituency)',
      'Candidates and their proposers',
      'Election Commission of India',
    ],
    citizenActions: [
      'Check the affidavits of candidates on the ECI Affidavit Portal',
      'Verify candidate criminal records on the MyNeta portal',
    ],
    externalLinks: [
      { label: 'ECI Affidavit Portal', url: 'https://affidavit.eci.gov.in' },
      { label: 'MyNeta Candidate Info', url: 'https://myneta.info' },
    ],
    relatedStepIds: ['ls-03-model-code-of-conduct', 'ls-05-campaigning'],
  },
  {
    id: 'ls-05-campaigning',
    title: 'Election Campaigning',
    electionType: 'lok_sabha',
    order: 5,
    dateRange: 'From nomination withdrawal deadline until 48 hours before polling',
    description:
      'Candidates and parties campaign through rallies, door-to-door canvassing, media advertisements, and social media. Campaign expenditure is capped by the ECI. The campaign period ends 48 hours before polling (silent period).',
    keyDates: [
      'Campaign period begins: after withdrawal deadline',
      'Silent period: 48 hours before polling day',
    ],
    responsibleParties: [
      'Political parties and candidates',
      'Election Commission of India',
      'Media Certification and Monitoring Committee',
    ],
    citizenActions: [
      'Attend public meetings and rallies to hear candidates',
      'Verify campaign claims using fact-checking resources',
      'Report paid news or illegal campaign spending to ECI',
    ],
    externalLinks: [
      { label: 'ECI Campaign Finance Rules', url: 'https://eci.gov.in/expenditure-monitoring' },
    ],
    relatedStepIds: ['ls-04-nomination', 'ls-06-polling-day'],
  },
  {
    id: 'ls-06-polling-day',
    title: 'Polling Day',
    electionType: 'lok_sabha',
    order: 6,
    dateRange: 'As notified in the election schedule (typically 7 am – 6 pm)',
    description:
      'Registered voters cast their votes at designated polling stations using Electronic Voting Machines (EVMs). Voter ID or approved alternative documents are required. NOTA (None of the Above) is available as an option.',
    keyDates: [
      'Polling day: as per gazette notification',
      'Polling hours: 7:00 am to 6:00 pm (may vary by constituency)',
    ],
    responsibleParties: [
      'Election Commission of India',
      'Presiding Officer (polling station)',
      'Central Armed Police Forces',
    ],
    citizenActions: [
      'Carry your Voter ID card or approved alternative ID',
      'Locate your polling station on the Voter Helpline app or voters.eci.gov.in',
      'Cast your vote using the EVM; press NOTA if you choose not to vote for any candidate',
    ],
    externalLinks: [
      { label: 'Voter Helpline', url: 'https://voters.eci.gov.in' },
      { label: 'ECI Polling Guidelines', url: 'https://eci.gov.in/polling-day' },
    ],
    relatedStepIds: ['ls-05-campaigning', 'ls-07-vote-counting'],
  },
  {
    id: 'ls-07-vote-counting',
    title: 'Vote Counting',
    electionType: 'lok_sabha',
    order: 7,
    dateRange: 'Typically 1–2 days after the final phase of polling',
    description:
      'EVM votes are counted at designated counting centres under strict security. Postal ballots are counted first. Results are declared constituency by constituency as counting progresses throughout the day.',
    keyDates: [
      'Counting day: as notified by ECI',
      'Results declared: throughout counting day',
    ],
    responsibleParties: [
      'Returning Officer',
      'Election Commission of India',
      'Counting agents of candidates',
    ],
    citizenActions: [
      'Follow live results on the ECI Results portal or news channels',
      'Candidates may request a recount if the margin is very narrow',
    ],
    externalLinks: [
      { label: 'ECI Results Portal', url: 'https://results.eci.gov.in' },
    ],
    relatedStepIds: ['ls-06-polling-day', 'ls-08-result-certification'],
  },
  {
    id: 'ls-08-result-certification',
    title: 'Result Certification and Government Formation',
    electionType: 'lok_sabha',
    order: 8,
    dateRange: 'Within days of counting; government formed within 2–4 weeks',
    description:
      'The Returning Officer certifies the winning candidate in each constituency. The party or alliance with a majority (272+ seats) is invited by the President to form the government. The Prime Minister is sworn in.',
    keyDates: [
      'Winning candidate certificate issued: on counting day',
      'President invites majority party/alliance to form government',
      'Prime Minister sworn in: within 2–4 weeks of results',
    ],
    responsibleParties: [
      'Returning Officer',
      'President of India',
      'Winning party or alliance',
    ],
    citizenActions: [
      'Monitor the formation of the new government through official announcements',
      'Engage with your elected Member of Parliament after they take office',
    ],
    externalLinks: [
      { label: 'Lok Sabha Official Website', url: 'https://loksabha.nic.in' },
    ],
    relatedStepIds: ['ls-07-vote-counting'],
  },

  // ─── Rajya Sabha Steps ────────────────────────────────────────────────────

  {
    id: 'rs-01-biennial-elections',
    title: 'Biennial Elections Overview',
    electionType: 'rajya_sabha',
    order: 1,
    dateRange: 'Every two years (one-third of seats retire every two years)',
    description:
      'The Rajya Sabha is a permanent house; it is never dissolved. One-third of its 245 members retire every two years. Vacancies are filled by elections conducted by the Election Commission among elected members of State Legislative Assemblies.',
    keyDates: [
      'Retirement dates: as per schedule of each batch of members',
      'Election notification: issued by ECI approximately 30 days before retirement',
    ],
    responsibleParties: [
      'Election Commission of India',
      'State Legislative Assemblies (MLAs vote)',
      'Rajya Sabha Secretariat',
    ],
    citizenActions: [
      'Citizens do not vote directly for Rajya Sabha members',
      'Engage with your state MLA who will cast the vote on your behalf',
    ],
    externalLinks: [
      { label: 'Rajya Sabha Official Website', url: 'https://rajyasabha.nic.in' },
      { label: 'ECI Rajya Sabha Elections', url: 'https://eci.gov.in/rajya-sabha' },
    ],
    relatedStepIds: ['rs-02-nomination-rs', 'rs-03-voting-by-mlas'],
  },
  {
    id: 'rs-02-nomination-rs',
    title: 'Nomination by Political Parties',
    electionType: 'rajya_sabha',
    order: 2,
    dateRange: 'Approximately 2–3 weeks before the election date',
    description:
      'Political parties nominate candidates for Rajya Sabha seats proportional to their strength in the State Legislative Assembly. Candidates file nomination papers with the Returning Officer designated by the ECI.',
    keyDates: [
      'Last date for filing nominations: as per ECI notification',
      'Scrutiny of nominations: day after last filing date',
      'Last date for withdrawal: 2 days after scrutiny',
    ],
    responsibleParties: [
      'Political parties',
      'Returning Officer (designated by ECI)',
      'Election Commission of India',
    ],
    citizenActions: [
      'Follow party announcements for Rajya Sabha candidate nominations',
    ],
    externalLinks: [
      { label: 'Rajya Sabha Official Website', url: 'https://rajyasabha.nic.in' },
    ],
    relatedStepIds: ['rs-01-biennial-elections', 'rs-03-voting-by-mlas'],
  },
  {
    id: 'rs-03-voting-by-mlas',
    title: 'Voting by State MLAs',
    electionType: 'rajya_sabha',
    order: 3,
    dateRange: 'On the notified election date',
    description:
      'Elected members of the State Legislative Assembly vote using the Single Transferable Vote (STV) system with proportional representation. Votes are cast by preference. The quota required to win is calculated from total valid votes.',
    keyDates: [
      'Voting day: as notified by ECI',
      'Counting and result declaration: same day as voting',
    ],
    responsibleParties: [
      'Elected MLAs of the state',
      'Returning Officer',
      'Election Commission of India',
    ],
    citizenActions: [
      'Citizens do not vote directly; engage with your MLA to understand their voting intention',
    ],
    externalLinks: [
      { label: 'ECI STV Explanation', url: 'https://eci.gov.in/rajya-sabha' },
    ],
    relatedStepIds: ['rs-02-nomination-rs', 'rs-04-result-rs'],
  },
  {
    id: 'rs-04-result-rs',
    title: 'Result Declaration and Oath Taking',
    electionType: 'rajya_sabha',
    order: 4,
    dateRange: 'On counting day; oath taken at the start of the next session',
    description:
      'The Returning Officer declares results after counting. Elected members take an oath of office before the Chairman of the Rajya Sabha at the commencement of the next parliamentary session.',
    keyDates: [
      'Result declaration: on counting day',
      'Oath taking: at start of next Rajya Sabha session',
    ],
    responsibleParties: [
      'Returning Officer',
      'Chairman of the Rajya Sabha',
      'Rajya Sabha Secretariat',
    ],
    citizenActions: [
      "Track your state's newly elected Rajya Sabha members on the official website",
    ],
    externalLinks: [
      { label: 'Rajya Sabha Members List', url: 'https://rajyasabha.nic.in/rsnew/member_site/memberlist.aspx' },
    ],
    relatedStepIds: ['rs-03-voting-by-mlas'],
  },

  // ─── State Assembly Steps ─────────────────────────────────────────────────

  {
    id: 'sa-01-voter-registration-sa',
    title: 'Voter Registration (State Assembly)',
    electionType: 'state_assembly',
    order: 1,
    dateRange: 'Ongoing; special drives before state election announcement',
    description:
      'Citizens register on the state electoral roll using Form 6. The same electoral roll is used for both Lok Sabha and State Assembly elections. Voters must be registered in the constituency where they ordinarily reside.',
    keyDates: [
      'Annual summary revision: January 1 qualifying date',
      'Last date to file Form 6: typically 30 days before poll date',
    ],
    responsibleParties: [
      'Chief Electoral Officer (state)',
      'Electoral Registration Officer (district)',
      'Election Commission of India',
    ],
    citizenActions: [
      'Register at voters.eci.gov.in or at your local ERO office',
      'Verify your name on the draft electoral roll',
    ],
    externalLinks: [
      { label: 'Voter Registration Portal', url: 'https://voters.eci.gov.in' },
    ],
    relatedStepIds: ['sa-02-election-announcement-sa', 'sa-03-nomination-sa'],
  },
  {
    id: 'sa-02-election-announcement-sa',
    title: 'State Election Announcement',
    electionType: 'state_assembly',
    order: 2,
    dateRange: 'Approximately 4–6 weeks before polling day',
    description:
      'The Election Commission announces the state assembly election schedule. The Model Code of Conduct comes into force immediately. The Governor issues a notification for the election on the advice of the state cabinet.',
    keyDates: [
      'ECI press conference announcing schedule',
      'Gazette notification of election dates',
      'MCC in force from announcement date',
    ],
    responsibleParties: [
      'Election Commission of India',
      'Governor of the state',
      'State government',
    ],
    citizenActions: [
      "Check the ECI website for your constituency's polling date",
      'Note the last date for filing nominations',
    ],
    externalLinks: [
      { label: 'ECI Election Schedule', url: 'https://eci.gov.in/election-schedule' },
    ],
    relatedStepIds: ['sa-01-voter-registration-sa', 'sa-03-nomination-sa'],
  },
  {
    id: 'sa-03-nomination-sa',
    title: 'Nomination Filing (State Assembly)',
    electionType: 'state_assembly',
    order: 3,
    dateRange: 'Typically 7–14 days after election announcement',
    description:
      'Candidates file nomination papers with the Returning Officer of their assembly constituency. A security deposit and affidavit disclosing assets, liabilities, and criminal antecedents are mandatory for all candidates.',
    keyDates: [
      'Last date for filing nominations',
      'Scrutiny of nominations: day after last filing date',
      'Last date for withdrawal: 2 days after scrutiny',
    ],
    responsibleParties: [
      'Returning Officer (assembly constituency)',
      'Candidates and proposers',
      'Election Commission of India',
    ],
    citizenActions: [
      'Review candidate affidavits on the ECI Affidavit Portal',
    ],
    externalLinks: [
      { label: 'ECI Affidavit Portal', url: 'https://affidavit.eci.gov.in' },
    ],
    relatedStepIds: ['sa-02-election-announcement-sa', 'sa-04-campaigning-sa'],
  },
  {
    id: 'sa-04-campaigning-sa',
    title: 'Campaigning (State Assembly)',
    electionType: 'state_assembly',
    order: 4,
    dateRange: 'From withdrawal deadline until 48 hours before polling',
    description:
      'Candidates and parties campaign through rallies, media, and door-to-door outreach. Campaign expenditure limits are set by the ECI. The silent period begins 48 hours before polling day.',
    keyDates: [
      'Campaign period begins: after withdrawal deadline',
      'Silent period: 48 hours before polling day',
    ],
    responsibleParties: [
      'Political parties and candidates',
      'Election Commission of India',
      'Media Certification and Monitoring Committee',
    ],
    citizenActions: [
      'Attend public meetings to hear candidates',
      'Report MCC violations via the cVIGIL app',
    ],
    externalLinks: [
      { label: 'cVIGIL App', url: 'https://cvigil.eci.gov.in' },
    ],
    relatedStepIds: ['sa-03-nomination-sa', 'sa-05-polling-day-sa'],
  },
  {
    id: 'sa-05-polling-day-sa',
    title: 'Polling Day (State Assembly)',
    electionType: 'state_assembly',
    order: 5,
    dateRange: 'As notified in the election schedule (typically 7 am – 6 pm)',
    description:
      'Registered voters cast their votes at designated polling stations using EVMs. Voter ID or approved alternative documents are required. NOTA is available. Polling may be conducted in multiple phases for large states.',
    keyDates: [
      'Polling day: as per gazette notification',
      'Polling hours: 7:00 am to 6:00 pm (may vary)',
    ],
    responsibleParties: [
      'Election Commission of India',
      'Presiding Officer (polling station)',
      'State Police and Central Armed Police Forces',
    ],
    citizenActions: [
      'Carry your Voter ID or approved alternative ID',
      'Locate your polling station on the Voter Helpline app',
      'Cast your vote using the EVM',
    ],
    externalLinks: [
      { label: 'Voter Helpline', url: 'https://voters.eci.gov.in' },
    ],
    relatedStepIds: ['sa-04-campaigning-sa', 'sa-06-counting-sa'],
  },
  {
    id: 'sa-06-counting-sa',
    title: 'Vote Counting (State Assembly)',
    electionType: 'state_assembly',
    order: 6,
    dateRange: 'Typically 1–2 days after polling',
    description:
      'EVM votes are counted at designated counting centres. Postal ballots are counted first. Results are declared seat by seat. The party or alliance winning a majority (half of total seats + 1) is invited to form the state government.',
    keyDates: [
      'Counting day: as notified by ECI',
      'Results declared: throughout counting day',
    ],
    responsibleParties: [
      'Returning Officer',
      'Election Commission of India',
      'Counting agents of candidates',
    ],
    citizenActions: [
      'Follow live results on the ECI Results portal',
    ],
    externalLinks: [
      { label: 'ECI Results Portal', url: 'https://results.eci.gov.in' },
    ],
    relatedStepIds: ['sa-05-polling-day-sa', 'sa-07-government-formation-sa'],
  },
  {
    id: 'sa-07-government-formation-sa',
    title: 'Government Formation (State)',
    electionType: 'state_assembly',
    order: 7,
    dateRange: 'Within 2–4 weeks of results',
    description:
      'The Governor invites the leader of the majority party or alliance to form the state government. The Chief Minister and Council of Ministers are sworn in. The new government presents its agenda in the first session of the assembly.',
    keyDates: [
      'Governor invites majority party/alliance',
      'Chief Minister sworn in: within 2–4 weeks of results',
      'First assembly session: within 6 months of election',
    ],
    responsibleParties: [
      'Governor of the state',
      'Winning party or alliance',
      'State Legislative Assembly',
    ],
    citizenActions: [
      'Engage with your newly elected MLA after they take office',
      "Monitor the new government's policy announcements",
    ],
    externalLinks: [
      { label: 'State Legislature Portal', url: 'https://eci.gov.in/state-assembly' },
    ],
    relatedStepIds: ['sa-06-counting-sa'],
  },
];
