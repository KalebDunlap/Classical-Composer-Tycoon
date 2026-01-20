// Game Types and Interfaces for Classical Composer Tycoon

export type CompositionForm = 
  | 'piano_sonata' 
  | 'string_quartet' 
  | 'symphony' 
  | 'lied' 
  | 'opera' 
  | 'mass' 
  | 'concerto';

export type CompositionStyle = 
  | 'classical' 
  | 'early_romantic' 
  | 'late_romantic';

export type Instrumentation = 
  | 'solo_piano'
  | 'chamber_ensemble'
  | 'small_orchestra'
  | 'full_orchestra'
  | 'voice_and_piano'
  | 'choir_and_orchestra';

export type VenueType = 
  | 'salon'
  | 'church'
  | 'small_hall'
  | 'concert_hall'
  | 'opera_house';

export type TasteTrend = 
  | 'virtuosity'
  | 'lyricism'
  | 'sacred'
  | 'secular'
  | 'nationalist'
  | 'cosmopolitan';

export type SkillType = 
  | 'melody'
  | 'harmony'
  | 'orchestration'
  | 'form'
  | 'productivity'
  | 'social';

export type UpgradeCategory = 
  | 'living'
  | 'instrument'
  | 'staff'
  | 'connections';

export interface ComposerStats {
  money: number;
  reputation: number;
  inspiration: number;
  health: number;
  maxHealth: number;
  connections: number;
}

export interface Skills {
  melody: number;
  harmony: number;
  orchestration: number;
  form: number;
  productivity: number;
  social: number;
}

export interface TasteState {
  current: TasteTrend[];
  intensity: number; // 0-100 how strongly trends affect reviews
}

export interface CompositionPhases {
  sketching: number;
  orchestration: number;
  rehearsalPrep: number;
  revision: number;
}

export interface WorkInProgress {
  form: CompositionForm;
  style: CompositionStyle;
  instrumentation: Instrumentation;
  phases: CompositionPhases;
  weeksSpent: number;
  title: string;
}

export interface CompletedWork {
  id: string;
  title: string;
  form: CompositionForm;
  style: CompositionStyle;
  instrumentation: Instrumentation;
  quality: number;
  premiereDate: GameDate;
  venue: VenueType;
  earnings: number;
  reputationGained: number;
  review: string;
  dedicatedTo?: string;
  factors: ScoreFactors;
}

export interface ScoreFactors {
  baseQuality: number;
  skillBonus: number;
  trendAlignment: number;
  venueMatch: number;
  musicianQuality: number;
  patronBonus: number;
}

export interface GameDate {
  year: number;
  month: number;
  week: number;
}

export interface Venue {
  type: VenueType;
  name: string;
  capacity: number;
  prestige: number;
  cost: number;
  requiredReputation: number;
  bestFor: CompositionForm[];
}

export interface Patron {
  id: string;
  name: string;
  title: string;
  preferredForms: CompositionForm[];
  preferredStyle: CompositionStyle;
  generosity: number;
  relationship: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: UpgradeCategory;
  cost: number;
  effects: UpgradeEffect[];
  requiredReputation: number;
  purchased: boolean;
}

export interface UpgradeEffect {
  type: 'stat_boost' | 'skill_boost' | 'unlock' | 'multiplier';
  target: string;
  value: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  requirements?: EventRequirements;
}

export interface EventChoice {
  text: string;
  effects: EventEffect[];
  tooltip?: string;
}

export interface EventEffect {
  type: 'money' | 'reputation' | 'inspiration' | 'health' | 'skill' | 'connection' | 'special';
  value: number;
  target?: string;
  description: string;
}

export interface EventRequirements {
  minReputation?: number;
  minMoney?: number;
  hasPatron?: boolean;
}

export interface LogEntry {
  id: string;
  date: GameDate;
  text: string;
  type: 'event' | 'premiere' | 'composition' | 'upgrade' | 'system';
}

export interface PremiereSetup {
  work: WorkInProgress;
  venue: VenueType;
  musicianQuality: 'amateur' | 'competent' | 'professional' | 'virtuoso';
  dedicatedTo?: string;
  advertisingSpent: number;
}

export interface GameState {
  started: boolean;
  composerName: string;
  currentDate: GameDate;
  stats: ComposerStats;
  skills: Skills;
  tastes: TasteState;
  workInProgress: WorkInProgress | null;
  completedWorks: CompletedWork[];
  patrons: Patron[];
  upgrades: Upgrade[];
  eventLog: LogEntry[];
  currentEvent: GameEvent | null;
  premiereSetup: PremiereSetup | null;
  achievedMilestones: string[];
}

// Form definitions
export const COMPOSITION_FORMS: Record<CompositionForm, {
  name: string;
  difficulty: number;
  baseWeeks: number;
  requiredReputation: number;
  description: string;
  bestInstrumentation: Instrumentation[];
}> = {
  piano_sonata: {
    name: 'Piano Sonata',
    difficulty: 2,
    baseWeeks: 3,
    requiredReputation: 0,
    description: 'An intimate work showcasing pianistic mastery',
    bestInstrumentation: ['solo_piano']
  },
  string_quartet: {
    name: 'String Quartet',
    difficulty: 3,
    baseWeeks: 4,
    requiredReputation: 10,
    description: 'The purest test of compositional craft',
    bestInstrumentation: ['chamber_ensemble']
  },
  lied: {
    name: 'Lied',
    difficulty: 1,
    baseWeeks: 2,
    requiredReputation: 0,
    description: 'A German art song for voice and piano',
    bestInstrumentation: ['voice_and_piano']
  },
  symphony: {
    name: 'Symphony',
    difficulty: 5,
    baseWeeks: 8,
    requiredReputation: 50,
    description: 'The grandest orchestral statement',
    bestInstrumentation: ['full_orchestra']
  },
  concerto: {
    name: 'Concerto',
    difficulty: 4,
    baseWeeks: 6,
    requiredReputation: 30,
    description: 'A dialogue between soloist and orchestra',
    bestInstrumentation: ['full_orchestra', 'small_orchestra']
  },
  opera: {
    name: 'Opera',
    difficulty: 6,
    baseWeeks: 12,
    requiredReputation: 80,
    description: 'The ultimate dramatic musical work',
    bestInstrumentation: ['choir_and_orchestra', 'full_orchestra']
  },
  mass: {
    name: 'Mass',
    difficulty: 4,
    baseWeeks: 6,
    requiredReputation: 40,
    description: 'Sacred music for chorus and orchestra',
    bestInstrumentation: ['choir_and_orchestra']
  }
};

export const VENUES: Record<VenueType, Venue> = {
  salon: {
    type: 'salon',
    name: 'Private Salon',
    capacity: 30,
    prestige: 1,
    cost: 10,
    requiredReputation: 0,
    bestFor: ['piano_sonata', 'lied', 'string_quartet']
  },
  church: {
    type: 'church',
    name: 'St. Michael\'s Church',
    capacity: 200,
    prestige: 2,
    cost: 25,
    requiredReputation: 15,
    bestFor: ['mass']
  },
  small_hall: {
    type: 'small_hall',
    name: 'Municipal Concert Hall',
    capacity: 400,
    prestige: 3,
    cost: 75,
    requiredReputation: 30,
    bestFor: ['string_quartet', 'concerto', 'piano_sonata']
  },
  concert_hall: {
    type: 'concert_hall',
    name: 'Grand Concert Hall',
    capacity: 1200,
    prestige: 4,
    cost: 200,
    requiredReputation: 60,
    bestFor: ['symphony', 'concerto']
  },
  opera_house: {
    type: 'opera_house',
    name: 'Royal Opera House',
    capacity: 2000,
    prestige: 5,
    cost: 500,
    requiredReputation: 100,
    bestFor: ['opera', 'symphony']
  }
};

export const STYLES: Record<CompositionStyle, {
  name: string;
  description: string;
  modifiers: { melody: number; harmony: number; orchestration: number };
}> = {
  classical: {
    name: 'Classical',
    description: 'Formal elegance in the manner of Haydn and Mozart',
    modifiers: { melody: 1.0, harmony: 0.9, orchestration: 0.8 }
  },
  early_romantic: {
    name: 'Early Romantic',
    description: 'Emotional expressiveness with structural balance',
    modifiers: { melody: 1.1, harmony: 1.0, orchestration: 1.0 }
  },
  late_romantic: {
    name: 'Late Romantic',
    description: 'Grand gestures and rich orchestral colors',
    modifiers: { melody: 1.0, harmony: 1.2, orchestration: 1.3 }
  }
};

export const INSTRUMENTATIONS: Record<Instrumentation, {
  name: string;
  cost: number;
  complexity: number;
}> = {
  solo_piano: { name: 'Solo Piano', cost: 0, complexity: 1 },
  voice_and_piano: { name: 'Voice and Piano', cost: 15, complexity: 1.5 },
  chamber_ensemble: { name: 'Chamber Ensemble', cost: 30, complexity: 2 },
  small_orchestra: { name: 'Small Orchestra', cost: 80, complexity: 3 },
  full_orchestra: { name: 'Full Orchestra', cost: 150, complexity: 4 },
  choir_and_orchestra: { name: 'Choir and Orchestra', cost: 200, complexity: 5 }
};

export const MUSICIAN_COSTS: Record<PremiereSetup['musicianQuality'], { cost: number; multiplier: number }> = {
  amateur: { cost: 20, multiplier: 0.7 },
  competent: { cost: 50, multiplier: 1.0 },
  professional: { cost: 120, multiplier: 1.2 },
  virtuoso: { cost: 300, multiplier: 1.5 }
};

export function formatDate(date: GameDate): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.month]}, Week ${date.week}, ${date.year}`;
}

export function formatMoney(amount: number): string {
  return `${amount.toLocaleString()} Thalers`;
}
