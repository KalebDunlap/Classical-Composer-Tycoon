import { GameEvent } from './gameTypes';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'patron_request',
    title: 'A Noble Request',
    description: 'The Countess von Brunswick has heard of your talents and requests a piano sonata for her upcoming soirée. She offers generous payment, though her musical taste is decidedly old-fashioned.',
    choices: [
      {
        text: 'Accept graciously',
        effects: [
          { type: 'money', value: 80, description: '+80 Thalers' },
          { type: 'reputation', value: 5, description: '+5 Reputation' },
          { type: 'inspiration', value: -10, description: '-10 Inspiration (tedious work)' }
        ],
        tooltip: 'Reliable income but creatively unfulfilling'
      },
      {
        text: 'Politely decline',
        effects: [
          { type: 'inspiration', value: 10, description: '+10 Inspiration (artistic freedom)' },
          { type: 'reputation', value: -3, description: '-3 Reputation' }
        ],
        tooltip: 'Maintain your artistic integrity'
      }
    ]
  },
  {
    id: 'illness',
    title: 'A Fever Takes Hold',
    description: 'You awake with a pounding headache and chills. The doctor recommends rest, but you have compositions to finish.',
    choices: [
      {
        text: 'Rest as prescribed',
        effects: [
          { type: 'health', value: 20, description: '+20 Health (proper recovery)' },
          { type: 'inspiration', value: -15, description: '-15 Inspiration (lost time)' }
        ],
        tooltip: 'Your health is your wealth'
      },
      {
        text: 'Work through it',
        effects: [
          { type: 'health', value: -25, description: '-25 Health (worsening condition)' },
          { type: 'skill', value: 2, target: 'productivity', description: '+2 Productivity (discipline)' }
        ],
        tooltip: 'Risky but shows dedication'
      },
      {
        text: 'Seek expensive treatment',
        effects: [
          { type: 'money', value: -40, description: '-40 Thalers' },
          { type: 'health', value: 30, description: '+30 Health' }
        ],
        tooltip: 'The best care money can buy'
      }
    ]
  },
  {
    id: 'rival_premiere',
    title: 'A Rival\'s Triumph',
    description: 'Your contemporary, Herr Hummel, has premiered a new piano concerto to great acclaim. The papers speak of nothing else. You feel the pressure to respond.',
    choices: [
      {
        text: 'Attend and congratulate him',
        effects: [
          { type: 'reputation', value: 3, description: '+3 Reputation (gracious gesture)' },
          { type: 'connection', value: 5, description: '+5 Connections' },
          { type: 'inspiration', value: 15, description: '+15 Inspiration (musical insight)' }
        ],
        tooltip: 'Learn from your rivals'
      },
      {
        text: 'Redouble your efforts',
        effects: [
          { type: 'skill', value: 3, target: 'melody', description: '+3 Melody skill' },
          { type: 'health', value: -10, description: '-10 Health (overwork)' }
        ],
        tooltip: 'Competition drives excellence'
      },
      {
        text: 'Dismiss it publicly',
        effects: [
          { type: 'reputation', value: -8, description: '-8 Reputation (seen as jealous)' },
          { type: 'inspiration', value: 5, description: '+5 Inspiration (defiance)' }
        ],
        tooltip: 'A dangerous move'
      }
    ]
  },
  {
    id: 'publisher_offer',
    title: 'A Publisher\'s Proposal',
    description: 'Artaria & Co. offers to publish your recent works. They propose either a one-time payment or ongoing royalties.',
    choices: [
      {
        text: 'Accept one-time payment (150 Thalers)',
        effects: [
          { type: 'money', value: 150, description: '+150 Thalers (immediate)' }
        ],
        tooltip: 'Guaranteed money now'
      },
      {
        text: 'Negotiate royalties',
        effects: [
          { type: 'reputation', value: 8, description: '+8 Reputation (published composer)' },
          { type: 'connection', value: 10, description: '+10 Connections (publisher relationship)' }
        ],
        tooltip: 'Better long-term prospects'
      },
      {
        text: 'Refuse - self-publish instead',
        effects: [
          { type: 'money', value: -50, description: '-50 Thalers (printing costs)' },
          { type: 'reputation', value: 5, description: '+5 Reputation (independent spirit)' },
          { type: 'inspiration', value: 10, description: '+10 Inspiration (artistic control)' }
        ],
        tooltip: 'Expensive but maintains control'
      }
    ]
  },
  {
    id: 'war_news',
    title: 'War in Europe',
    description: 'Napoleon\'s armies march again. Concert halls close and patrons flee the city. Times are uncertain.',
    choices: [
      {
        text: 'Compose patriotic works',
        effects: [
          { type: 'reputation', value: 12, description: '+12 Reputation (patriotic fervor)' },
          { type: 'inspiration', value: -20, description: '-20 Inspiration (compromising art)' }
        ],
        tooltip: 'Popular but artistically limiting'
      },
      {
        text: 'Continue as before',
        effects: [
          { type: 'money', value: -30, description: '-30 Thalers (reduced income)' },
          { type: 'inspiration', value: 10, description: '+10 Inspiration (artistic purity)' }
        ],
        tooltip: 'Art transcends politics'
      },
      {
        text: 'Leave the city temporarily',
        effects: [
          { type: 'money', value: -80, description: '-80 Thalers (travel costs)' },
          { type: 'health', value: 15, description: '+15 Health (safer location)' },
          { type: 'connection', value: -10, description: '-10 Connections (absence)' }
        ],
        tooltip: 'Safety first'
      }
    ]
  },
  {
    id: 'instrument_trouble',
    title: 'The Piano Falls Silent',
    description: 'Your piano has developed a serious fault - several hammers are broken and the tuning is impossible to hold.',
    choices: [
      {
        text: 'Repair it (40 Thalers)',
        effects: [
          { type: 'money', value: -40, description: '-40 Thalers' }
        ],
        tooltip: 'A necessary expense'
      },
      {
        text: 'Borrow a friend\'s instrument',
        effects: [
          { type: 'connection', value: -5, description: '-5 Connections (inconvenience)' },
          { type: 'inspiration', value: -5, description: '-5 Inspiration (unfamiliar touch)' }
        ],
        tooltip: 'A temporary solution'
      },
      {
        text: 'Compose in silence',
        effects: [
          { type: 'skill', value: 4, target: 'form', description: '+4 Form skill (mental discipline)' },
          { type: 'inspiration', value: -10, description: '-10 Inspiration' }
        ],
        tooltip: 'Beethoven did it...'
      }
    ]
  },
  {
    id: 'virtuoso_visit',
    title: 'A Famous Visitor',
    description: 'The celebrated pianist Franz Liszt is in town and expresses interest in performing your works. He is brilliant but notorious for taking liberties.',
    choices: [
      {
        text: 'Welcome his interpretations',
        effects: [
          { type: 'reputation', value: 20, description: '+20 Reputation (Liszt\'s endorsement)' },
          { type: 'inspiration', value: -10, description: '-10 Inspiration (your vision altered)' }
        ],
        tooltip: 'Fame at the cost of control'
      },
      {
        text: 'Insist on faithful rendition',
        effects: [
          { type: 'reputation', value: 8, description: '+8 Reputation (principled)' },
          { type: 'skill', value: 3, target: 'orchestration', description: '+3 Orchestration (clearer writing)' }
        ],
        tooltip: 'Your art, your way'
      },
      {
        text: 'Collaborate on a new work',
        effects: [
          { type: 'inspiration', value: 25, description: '+25 Inspiration (creative exchange)' },
          { type: 'skill', value: 5, target: 'melody', description: '+5 Melody skill' },
          { type: 'health', value: -15, description: '-15 Health (intense work)' }
        ],
        tooltip: 'Learn from a master'
      }
    ]
  },
  {
    id: 'economic_crisis',
    title: 'Financial Panic',
    description: 'The banking houses are failing and currency is devalued. Your savings are worth less than yesterday.',
    choices: [
      {
        text: 'Accept the loss',
        effects: [
          { type: 'money', value: -50, description: '-50 Thalers (devaluation)' }
        ],
        tooltip: 'Weather the storm'
      },
      {
        text: 'Seek immediate commissions',
        effects: [
          { type: 'money', value: 30, description: '+30 Thalers (quick work)' },
          { type: 'inspiration', value: -15, description: '-15 Inspiration (mercenary work)' },
          { type: 'reputation', value: -5, description: '-5 Reputation (desperate appearance)' }
        ],
        tooltip: 'Survival mode'
      }
    ]
  },
  {
    id: 'musical_debate',
    title: 'A War of Words',
    description: 'The newspapers are ablaze with debate: should music be "absolute" or serve dramatic ends? Critics demand your opinion.',
    choices: [
      {
        text: 'Champion absolute music',
        effects: [
          { type: 'reputation', value: 5, description: '+5 Reputation (intellectual stance)' },
          { type: 'skill', value: 3, target: 'form', description: '+3 Form skill' }
        ],
        tooltip: 'Side with the formalists'
      },
      {
        text: 'Advocate programmatic music',
        effects: [
          { type: 'inspiration', value: 15, description: '+15 Inspiration (narrative freedom)' },
          { type: 'skill', value: 2, target: 'orchestration', description: '+2 Orchestration' }
        ],
        tooltip: 'Music should tell stories'
      },
      {
        text: 'Stay above the fray',
        effects: [
          { type: 'connection', value: 5, description: '+5 Connections (diplomatic)' },
          { type: 'health', value: 5, description: '+5 Health (less stress)' }
        ],
        tooltip: 'Let the work speak for itself'
      }
    ]
  },
  {
    id: 'student_request',
    title: 'A Promising Pupil',
    description: 'A young musician of exceptional talent begs to study with you. Teaching would consume time but could prove rewarding.',
    choices: [
      {
        text: 'Accept the student',
        effects: [
          { type: 'money', value: 20, description: '+20 Thalers (tuition)' },
          { type: 'skill', value: 4, target: 'harmony', description: '+4 Harmony (teaching clarifies)' },
          { type: 'inspiration', value: -10, description: '-10 Inspiration (time cost)' }
        ],
        tooltip: 'Teaching deepens understanding'
      },
      {
        text: 'Decline - focus on composing',
        effects: [
          { type: 'inspiration', value: 10, description: '+10 Inspiration (protected time)' }
        ],
        tooltip: 'Guard your creative energy'
      }
    ]
  },
  {
    id: 'royal_invitation',
    title: 'An Imperial Summons',
    description: 'The Emperor himself requests your presence at a private concert. This could change everything - or be an elaborate trap.',
    choices: [
      {
        text: 'Attend with your finest work',
        effects: [
          { type: 'reputation', value: 25, description: '+25 Reputation (imperial recognition)' },
          { type: 'connection', value: 20, description: '+20 Connections (court access)' },
          { type: 'money', value: -60, description: '-60 Thalers (formal attire)' }
        ],
        tooltip: 'A once-in-a-lifetime opportunity'
      },
      {
        text: 'Send regrets (claim illness)',
        effects: [
          { type: 'reputation', value: -10, description: '-10 Reputation (snub)' },
          { type: 'inspiration', value: 15, description: '+15 Inspiration (artistic independence)' }
        ],
        tooltip: 'Dangerous but principled'
      }
    ],
    requirements: {
      minReputation: 30
    }
  },
  {
    id: 'copyist_error',
    title: 'A Disastrous Mistake',
    description: 'Your copyist has made terrible errors in the orchestral parts. The premiere is in three days.',
    choices: [
      {
        text: 'Correct them yourself',
        effects: [
          { type: 'health', value: -20, description: '-20 Health (sleepless nights)' },
          { type: 'skill', value: 3, target: 'productivity', description: '+3 Productivity (under pressure)' }
        ],
        tooltip: 'Only you can fix this'
      },
      {
        text: 'Postpone the premiere',
        effects: [
          { type: 'money', value: -50, description: '-50 Thalers (venue fees lost)' },
          { type: 'reputation', value: -5, description: '-5 Reputation (unreliable)' }
        ],
        tooltip: 'Better safe than sorry'
      },
      {
        text: 'Proceed and hope for the best',
        effects: [
          { type: 'inspiration', value: -25, description: '-25 Inspiration (artistic compromise)' }
        ],
        tooltip: 'A gamble'
      }
    ]
  }
];

export function getRandomEvent(reputation: number): GameEvent | null {
  // 20% chance of event each week
  if (Math.random() > 0.20) {
    return null;
  }
  
  const eligibleEvents = GAME_EVENTS.filter(event => {
    if (!event.requirements) return true;
    if (event.requirements.minReputation && reputation < event.requirements.minReputation) return false;
    return true;
  });
  
  if (eligibleEvents.length === 0) return null;
  
  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
}
