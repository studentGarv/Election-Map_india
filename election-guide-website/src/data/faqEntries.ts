/**
 * Static FAQ data bundled with the application.
 *
 * Contains ≥10 entries across ≥3 categories covering India's election process.
 * Satisfies Requirement 9.1 and 9.4.
 */

import type { FAQEntry } from '../types';

export const faqEntries: FAQEntry[] = [
  // ─── Category: Voter Registration ─────────────────────────────────────────

  {
    id: 'faq-vr-01',
    category: 'Voter Registration',
    question: 'How do I register as a voter in India?',
    answer:
      'You can register as a voter by submitting Form 6 online at voters.eci.gov.in or in person at your local Electoral Registration Officer (ERO) office. You must be an Indian citizen aged 18 or above and ordinarily resident in the constituency where you wish to register. Supporting documents such as proof of age and proof of address are required.',
  },
  {
    id: 'faq-vr-02',
    category: 'Voter Registration',
    question: 'What is the minimum age to vote in India?',
    answer:
      'The minimum age to vote in India is 18 years. The qualifying date for age is January 1 of the year in which the electoral roll is being revised. If you turn 18 on or before January 1, you are eligible to register during that revision cycle.',
  },
  {
    id: 'faq-vr-03',
    category: 'Voter Registration',
    question: 'How do I update my address on the electoral roll?',
    answer:
      'If you have moved to a new address within the same constituency, submit Form 8A to update your address. If you have moved to a different constituency, you must delete your name from the old roll using Form 7 and register afresh in the new constituency using Form 6. Both forms are available at voters.eci.gov.in.',
  },
  {
    id: 'faq-vr-04',
    category: 'Voter Registration',
    question: 'What documents are accepted as proof of identity at the polling station?',
    answer:
      'The primary document is the Voter ID card (EPIC). However, the Election Commission also accepts 11 alternative photo identity documents including Aadhaar card, passport, driving licence, PAN card, MNREGA job card, bank or post office passbook with photograph, health insurance smart card, pension document with photograph, NPR smart card, and official identity documents issued by central or state governments.',
  },

  // ─── Category: Polling Day ─────────────────────────────────────────────────

  {
    id: 'faq-pd-01',
    category: 'Polling Day',
    question: 'What is NOTA and how do I use it?',
    answer:
      "NOTA stands for \"None of the Above.\" It is an option on the Electronic Voting Machine (EVM) that allows you to register your vote without choosing any candidate. NOTA was introduced by the Supreme Court of India in 2013. To use it, press the NOTA button on the EVM after the last candidate's name. A NOTA vote is counted but does not affect the result — the candidate with the most votes still wins.",
  },
  {
    id: 'faq-pd-02',
    category: 'Polling Day',
    question: 'What is an Electronic Voting Machine (EVM) and is it secure?',
    answer:
      'An EVM is a standalone electronic device used to record votes in Indian elections. It consists of a Control Unit operated by the Presiding Officer and a Balloting Unit used by the voter. EVMs are not connected to the internet or any network, making them immune to remote hacking. The Election Commission also uses Voter Verifiable Paper Audit Trail (VVPAT) machines alongside EVMs to allow voters to verify their vote.',
  },
  {
    id: 'faq-pd-03',
    category: 'Polling Day',
    question: 'What are the polling hours on election day?',
    answer:
      'Polling generally takes place from 7:00 am to 6:00 pm. However, the Election Commission may adjust polling hours for specific constituencies based on local conditions such as security concerns, weather, or geographic remoteness. The exact polling hours for your constituency are published in the official election notification.',
  },
  {
    id: 'faq-pd-04',
    category: 'Polling Day',
    question: 'Can I vote if my name is on the electoral roll but I have lost my Voter ID card?',
    answer:
      'Yes. If your name is on the electoral roll, you can vote using any of the 11 alternative photo identity documents accepted by the Election Commission, such as your Aadhaar card, passport, or driving licence. You do not need to have your Voter ID card with you on polling day as long as you can prove your identity with an accepted alternative document.',
  },

  // ─── Category: Results and Certification ──────────────────────────────────

  {
    id: 'faq-rc-01',
    category: 'Results and Certification',
    question: 'How are votes counted in a Lok Sabha election?',
    answer:
      'Votes are counted at designated counting centres on the counting day announced by the Election Commission. Postal ballots are counted first, followed by EVM votes. Counting agents of all candidates are present to observe the process. Results are declared constituency by constituency as counting progresses. The candidate with the highest number of valid votes in a constituency wins (first-past-the-post system).',
  },
  {
    id: 'faq-rc-02',
    category: 'Results and Certification',
    question: 'What is the Model Code of Conduct (MCC)?',
    answer:
      'The Model Code of Conduct is a set of guidelines issued by the Election Commission of India that governs the conduct of political parties, candidates, and the government during the election period. It comes into force from the date of announcement of the election schedule and remains in effect until results are declared. The MCC prohibits the use of government resources for campaigning, making policy announcements that could influence voters, and other activities that could give any party an unfair advantage.',
  },
  {
    id: 'faq-rc-03',
    category: 'Results and Certification',
    question: 'How is the Prime Minister chosen after a Lok Sabha election?',
    answer:
      'After the Lok Sabha election results are declared, the President of India invites the leader of the party or alliance that commands a majority (272 or more seats out of 543) to form the government. The invited leader is sworn in as Prime Minister by the President. The Prime Minister then advises the President on the appointment of the Council of Ministers.',
  },
  {
    id: 'faq-rc-04',
    category: 'Results and Certification',
    question: 'What is the difference between the Lok Sabha and the Rajya Sabha?',
    answer:
      "The Lok Sabha (House of the People) is the lower house of India's Parliament. Its 543 members are directly elected by citizens every five years. The Rajya Sabha (Council of States) is the upper house. Its 245 members are indirectly elected by the elected members of State Legislative Assemblies and Union Territory legislatures, plus 12 members nominated by the President. The Rajya Sabha is a permanent house and is never dissolved.",
  },

  // ─── Category: Election Commission and Process ────────────────────────────

  {
    id: 'faq-ec-01',
    category: 'Election Commission and Process',
    question: 'What is the role of the Election Commission of India?',
    answer:
      'The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India. It oversees elections to the Lok Sabha, Rajya Sabha, State Legislative Assemblies, and the offices of the President and Vice President. The ECI announces election schedules, enforces the Model Code of Conduct, manages the electoral roll, and ensures free and fair elections.',
  },
  {
    id: 'faq-ec-02',
    category: 'Election Commission and Process',
    question: 'How can I report an election violation?',
    answer:
      'You can report election violations using the cVIGIL mobile app developed by the Election Commission of India. The app allows citizens to report violations of the Model Code of Conduct, illegal distribution of cash or gifts, and other electoral malpractices with photo or video evidence. Reports are geotagged and sent to the flying squad for action within 100 minutes. You can also call the national voter helpline at 1950.',
  },
];
