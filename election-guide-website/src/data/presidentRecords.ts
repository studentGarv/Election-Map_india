/**
 * Static President of India historical data bundled with the application.
 *
 * Covers all Presidents from Dr. Rajendra Prasad (1950) to the present.
 * Satisfies Requirement 5.1 and 5.2.
 */

import type { PresidentRecord } from '../types';

export const presidentRecords: PresidentRecord[] = [
  {
    name: 'Dr. Rajendra Prasad',
    party: 'Indian National Congress',
    startDate: new Date('1950-01-26'),
    endDate: new Date('1962-05-13'),
    description:
      'First President of India and the only person to serve two full terms. A key figure in the Indian independence movement and the Constituent Assembly, he presided over the adoption of the Indian Constitution on January 26, 1950.',
  },
  {
    name: 'Dr. Sarvepalli Radhakrishnan',
    party: 'Independent',
    startDate: new Date('1962-05-13'),
    endDate: new Date('1967-05-13'),
    description:
      'Eminent philosopher, statesman, and educator who served as the second President of India. His birthday, September 5, is celebrated as Teachers\' Day in India. He previously served as Vice President from 1952 to 1962.',
  },
  {
    name: 'Dr. Zakir Husain',
    party: 'Independent',
    startDate: new Date('1967-05-13'),
    endDate: new Date('1969-05-03'),
    description:
      'Third President of India and the first Muslim to hold the office. An educationist and freedom fighter, he died in office on May 3, 1969, becoming the first Indian President to die while in office.',
  },
  {
    name: 'Varahagiri Venkata Giri',
    party: 'Independent',
    startDate: new Date('1969-08-24'),
    endDate: new Date('1974-08-24'),
    description:
      'Fourth President of India, elected in a controversial election in 1969 after serving as Acting President following the death of Dr. Zakir Husain. A trade union leader and freedom fighter, he was the first person to be elected President as an independent candidate.',
  },
  {
    name: 'Fakhruddin Ali Ahmed',
    party: 'Indian National Congress',
    startDate: new Date('1974-08-24'),
    endDate: new Date('1977-02-11'),
    description:
      'Fifth President of India who died in office on February 11, 1977. He is known for signing the Proclamation of Emergency in 1975 on the advice of Prime Minister Indira Gandhi, a controversial act that suspended civil liberties for nearly two years.',
  },
  {
    name: 'Neelam Sanjiva Reddy',
    party: 'Janata Party',
    startDate: new Date('1977-07-25'),
    endDate: new Date('1982-07-25'),
    description:
      'Sixth President of India and the first to be elected unanimously. He was the only person to have served as Speaker of the Lok Sabha before becoming President. He dissolved the Lok Sabha in 1979 following the collapse of the Charan Singh government.',
  },
  {
    name: 'Giani Zail Singh',
    party: 'Indian National Congress',
    startDate: new Date('1982-07-25'),
    endDate: new Date('1987-07-25'),
    description:
      'Seventh President of India and the first Sikh to hold the office. His tenure was marked by Operation Blue Star (1984), the assassination of Prime Minister Indira Gandhi, and the anti-Sikh riots of 1984. He controversially considered dismissing the Rajiv Gandhi government in 1987.',
  },
  {
    name: 'Ramaswamy Venkataraman',
    party: 'Indian National Congress',
    startDate: new Date('1987-07-25'),
    endDate: new Date('1992-07-25'),
    description:
      'Eighth President of India who administered the oath of office to three Prime Ministers during his tenure: Rajiv Gandhi, V. P. Singh, and Chandra Shekhar. A lawyer and freedom fighter, he previously served as Finance Minister and Defence Minister.',
  },
  {
    name: 'Dr. Shankar Dayal Sharma',
    party: 'Indian National Congress',
    startDate: new Date('1992-07-25'),
    endDate: new Date('1997-07-25'),
    description:
      'Ninth President of India who administered the oath of office to Prime Ministers P. V. Narasimha Rao and H. D. Deve Gowda. A lawyer and freedom fighter, he previously served as Chief Minister of Madhya Pradesh and Governor of several states.',
  },
  {
    name: 'Kocheril Raman Narayanan',
    party: 'Independent',
    startDate: new Date('1997-07-25'),
    endDate: new Date('2002-07-25'),
    description:
      'Tenth President of India and the first Dalit to hold the office. A diplomat and politician, he was known for his active interpretation of the presidential role. He returned the recommendation to impose President\'s Rule in Uttar Pradesh in 1998, setting a precedent.',
  },
  {
    name: 'Dr. A. P. J. Abdul Kalam',
    party: 'Independent',
    startDate: new Date('2002-07-25'),
    endDate: new Date('2007-07-25'),
    description:
      'Eleventh President of India, widely known as the "People\'s President." A renowned aerospace scientist who played a key role in India\'s civilian space programme and military missile development. He was awarded the Bharat Ratna in 1997.',
  },
  {
    name: 'Pratibha Patil',
    party: 'Indian National Congress',
    startDate: new Date('2007-07-25'),
    endDate: new Date('2012-07-25'),
    description:
      'Twelfth President of India and the first woman to hold the office. A lawyer and politician from Maharashtra, she previously served as Governor of Rajasthan. During her tenure she granted clemency to several death row convicts.',
  },
  {
    name: 'Pranab Mukherjee',
    party: 'Indian National Congress',
    startDate: new Date('2012-07-25'),
    endDate: new Date('2017-07-25'),
    description:
      'Thirteenth President of India and a veteran Congress politician who held several senior cabinet positions including Finance Minister, External Affairs Minister, and Defence Minister. He was awarded the Bharat Ratna in 2019.',
  },
  {
    name: 'Ram Nath Kovind',
    party: 'Bharatiya Janata Party',
    startDate: new Date('2017-07-25'),
    endDate: new Date('2022-07-25'),
    description:
      'Fourteenth President of India and the second Dalit to hold the office. A lawyer and politician from Uttar Pradesh, he previously served as Governor of Bihar. He was nominated by the National Democratic Alliance.',
  },
  {
    name: 'Droupadi Murmu',
    party: 'Bharatiya Janata Party',
    startDate: new Date('2022-07-25'),
    endDate: null,
    description:
      'Fifteenth and current President of India. The first person from a tribal community and the second woman to hold the office. A politician from Odisha, she previously served as Governor of Jharkhand. She was nominated by the National Democratic Alliance and elected in July 2022.',
  },
];
