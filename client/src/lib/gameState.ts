import { 
  GameState, 
  ComposerStats, 
  Skills, 
  TasteState, 
  Upgrade, 
  GameDate,
  LogEntry,
  TasteTrend,
  CompletedWork,
  COMPOSITION_FORMS,
  RevivalOpportunity
} from './gameTypes';

const STORAGE_KEY = 'classical_composer_tycoon_save';

export function createInitialState(composerName: string): GameState {
  const initialUpgrades = createInitialUpgrades();
  const initialPatrons = createInitialPatrons();
  
  return {
    started: true,
    composerName,
    currentDate: { year: 1820, month: 0, week: 1 },
    stats: {
      money: 100,
      reputation: 0,
      inspiration: 50,
      health: 100,
      maxHealth: 100,
      connections: 5
    },
    skills: {
      melody: 10,
      harmony: 10,
      orchestration: 5,
      form: 8,
      productivity: 10,
      social: 5
    },
    tastes: {
      current: ['lyricism', 'cosmopolitan'],
      intensity: 30
    },
    workInProgress: null,
    completedWorks: [],
    patrons: initialPatrons,
    upgrades: initialUpgrades,
    eventLog: [{
      id: 'start',
      date: { year: 1820, month: 0, week: 1 },
      text: `${composerName} begins their journey as a composer in Vienna.`,
      type: 'system'
    }],
    currentEvent: null,
    premiereSetup: null,
    achievedMilestones: [],
    pendingRevival: null,
    weeklyPublisherIncome: 0
  };
}

function createInitialUpgrades(): Upgrade[] {
  return [
    {
      id: 'better_apartment',
      name: 'Better Apartment',
      description: 'Move to a quieter neighborhood with more space for your piano.',
      category: 'living',
      cost: 150,
      effects: [
        { type: 'stat_boost', target: 'maxHealth', value: 20 },
        { type: 'stat_boost', target: 'inspiration', value: 10 }
      ],
      requiredReputation: 0,
      purchased: false
    },
    {
      id: 'quality_piano',
      name: 'Broadwood Piano',
      description: 'A fine English pianoforte with superior tone.',
      category: 'instrument',
      cost: 300,
      effects: [
        { type: 'skill_boost', target: 'melody', value: 5 },
        { type: 'skill_boost', target: 'harmony', value: 3 }
      ],
      requiredReputation: 10,
      purchased: false
    },
    {
      id: 'copyist',
      name: 'Hire Copyist',
      description: 'A skilled copyist to prepare performance parts.',
      category: 'staff',
      cost: 200,
      effects: [
        { type: 'skill_boost', target: 'productivity', value: 10 }
      ],
      requiredReputation: 15,
      purchased: false
    },
    {
      id: 'salon_invitation',
      name: 'Salon Invitation',
      description: 'Gain entry to the Countess von Thun\'s musical salon.',
      category: 'connections',
      cost: 100,
      effects: [
        { type: 'stat_boost', target: 'connections', value: 10 },
        { type: 'skill_boost', target: 'social', value: 5 }
      ],
      requiredReputation: 5,
      purchased: false
    },
    {
      id: 'grand_study',
      name: 'Grand Study',
      description: 'A proper composer\'s study with excellent acoustics.',
      category: 'living',
      cost: 500,
      effects: [
        { type: 'stat_boost', target: 'maxHealth', value: 30 },
        { type: 'multiplier', target: 'inspiration', value: 1.2 }
      ],
      requiredReputation: 40,
      purchased: false
    },
    {
      id: 'erard_piano',
      name: 'Érard Grand Piano',
      description: 'The finest Parisian instrument, favored by Liszt himself.',
      category: 'instrument',
      cost: 800,
      effects: [
        { type: 'skill_boost', target: 'melody', value: 10 },
        { type: 'skill_boost', target: 'orchestration', value: 5 }
      ],
      requiredReputation: 50,
      purchased: false
    },
    {
      id: 'assistant',
      name: 'Musical Assistant',
      description: 'A talented student to help with arrangements.',
      category: 'staff',
      cost: 400,
      effects: [
        { type: 'skill_boost', target: 'productivity', value: 15 },
        { type: 'skill_boost', target: 'orchestration', value: 5 }
      ],
      requiredReputation: 35,
      purchased: false
    },
    {
      id: 'publisher_contract',
      name: 'Publisher Contract',
      description: 'An exclusive arrangement with Peters Publishing.',
      category: 'connections',
      cost: 350,
      effects: [
        { type: 'multiplier', target: 'earnings', value: 1.3 },
        { type: 'stat_boost', target: 'connections', value: 15 }
      ],
      requiredReputation: 25,
      purchased: false
    },
    {
      id: 'country_retreat',
      name: 'Country Retreat',
      description: 'A peaceful cottage for summer composition.',
      category: 'living',
      cost: 1000,
      effects: [
        { type: 'stat_boost', target: 'maxHealth', value: 50 },
        { type: 'multiplier', target: 'inspiration', value: 1.5 }
      ],
      requiredReputation: 70,
      purchased: false
    },
    {
      id: 'court_position',
      name: 'Court Position',
      description: 'Secure a position at the Imperial Court.',
      category: 'connections',
      cost: 600,
      effects: [
        { type: 'stat_boost', target: 'connections', value: 25 },
        { type: 'multiplier', target: 'reputation', value: 1.2 }
      ],
      requiredReputation: 60,
      purchased: false
    }
  ];
}

function createInitialPatrons(): GameState['patrons'] {
  return [
    {
      id: 'archduke_rudolf',
      name: 'Archduke Rudolf',
      title: 'Imperial Archduke',
      preferredForms: ['symphony', 'concerto', 'mass'],
      preferredStyle: 'classical',
      generosity: 100,
      relationship: 0
    },
    {
      id: 'countess_erdody',
      name: 'Countess Erdődy',
      title: 'Hungarian Countess',
      preferredForms: ['string_quartet', 'piano_sonata'],
      preferredStyle: 'early_romantic',
      generosity: 60,
      relationship: 0
    },
    {
      id: 'baron_von_swieten',
      name: 'Baron van Swieten',
      title: 'Imperial Librarian',
      preferredForms: ['mass', 'symphony'],
      preferredStyle: 'classical',
      generosity: 80,
      relationship: 0
    }
  ];
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function loadGame(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as GameState;
    }
  } catch (e) {
    console.error('Failed to load game:', e);
  }
  return null;
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function resetGame(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function advanceWeek(state: GameState): GameState {
  const newDate = { ...state.currentDate };
  newDate.week++;
  
  if (newDate.week > 4) {
    newDate.week = 1;
    newDate.month++;
    
    if (newDate.month > 11) {
      newDate.month = 0;
      newDate.year++;
    }
  }
  
  // Check for trend shifts (every 3 months)
  let newTastes = state.tastes;
  if (newDate.month % 3 === 0 && newDate.week === 1) {
    newTastes = shiftTastes(state.tastes);
  }
  
  // Health recovery
  const healthRecovery = Math.min(5, state.stats.maxHealth - state.stats.health);
  
  // Inspiration drift
  const inspirationDrift = Math.random() > 0.5 ? 2 : -1;
  const newInspiration = Math.max(0, Math.min(100, state.stats.inspiration + inspirationDrift));
  
  // Process publisher income and popularity decay
  const { updatedWorks, weeklyIncome, revivalOpportunity } = processPublisherIncome(state.completedWorks, state.pendingRevival);
  
  // Add publisher income to money
  const newMoney = state.stats.money + weeklyIncome;

  // Death by old age check (after Jan 1870, 0.5% chance)
  let isGameOver = state.isGameOver;
  let gameOverReason = state.gameOverReason;

  if (!isGameOver && (newDate.year > 1870 || (newDate.year === 1870 && newDate.month >= 0))) {
    if (Math.random() < 0.005) {
      isGameOver = true;
      gameOverReason = "died_of_old_age";
    }
  }
  
  return {
    ...state,
    currentDate: newDate,
    tastes: newTastes,
    completedWorks: updatedWorks,
    weeklyPublisherIncome: weeklyIncome,
    pendingRevival: revivalOpportunity,
    isGameOver,
    gameOverReason,
    stats: {
      ...state.stats,
      money: newMoney,
      health: Math.min(state.stats.maxHealth, state.stats.health + healthRecovery),
      inspiration: newInspiration
    }
  };
}

// Calculate weekly publisher income and decay popularity
function processPublisherIncome(
  works: CompletedWork[],
  existingRevival: RevivalOpportunity | null
): { updatedWorks: CompletedWork[]; weeklyIncome: number; revivalOpportunity: RevivalOpportunity | null } {
  let weeklyIncome = 0;
  let revivalOpportunity = existingRevival;
  
  const updatedWorks = works.map(work => {
    const updatedWork = { ...work };
    updatedWork.weeksSincePremiere = (work.weeksSincePremiere || 0) + 1;
    
    // Initialize popularity if not set (for backwards compatibility)
    if (updatedWork.popularity === undefined) {
      updatedWork.popularity = Math.min(100, work.quality + 20);
    }
    
    if (updatedWork.totalPublisherEarnings === undefined) {
      updatedWork.totalPublisherEarnings = 0;
    }
    
    // Calculate income based on popularity and quality
    if (updatedWork.popularity > 0) {
      // Base income formula: higher quality and complexity = more publisher earnings
      const formData = COMPOSITION_FORMS[work.form];
      const baseIncome = formData.difficulty * 0.5; // 0.5 to 3 per week base
      const qualityMultiplier = work.quality / 100; // 0 to 1
      const popularityMultiplier = updatedWork.popularity / 100; // 0 to 1
      
      const income = Math.round(baseIncome * qualityMultiplier * popularityMultiplier * 2);
      weeklyIncome += income;
      updatedWork.totalPublisherEarnings += income;
      
      // Decay popularity - faster for simpler works, slower for complex masterpieces
      // Base decay: 1-3 points per week, modified by form complexity
      const baseDecay = Math.max(0.5, 3 - (formData.difficulty * 0.4));
      const qualityBonus = (work.quality / 100) * 0.5; // High quality decays slower
      const decayRate = Math.max(0.3, baseDecay - qualityBonus);
      
      updatedWork.popularity = Math.max(0, updatedWork.popularity - decayRate);
    }
    
    // Check for revival opportunity (only if no pending revival)
    // Must be at least 52 weeks old (1 year), have 0 popularity, quality >= 50
    // A piece can only be revived once (isRevival: true means it was already a revival,
    // and we also need to check if any existing completed work is a revival of THIS work)
    const hasBeenRevived = works.some(w => w.isRevival && w.originalWorkId === work.id);

    if (!revivalOpportunity && 
        updatedWork.popularity === 0 && 
        updatedWork.weeksSincePremiere >= 52 &&
        work.quality >= 50 &&
        !work.isRevival &&
        !hasBeenRevived) { // Can't revive a piece that was already used as a basis for a revival
      // 3% chance per week for a revival opportunity
      if (Math.random() < 0.03) {
        revivalOpportunity = {
          workId: work.id,
          workTitle: work.title,
          originalQuality: work.quality
        };
      }
    }
    
    return updatedWork;
  });
  
  return { updatedWorks, weeklyIncome, revivalOpportunity };
}

function shiftTastes(current: TasteState): TasteState {
  const allTrends: TasteTrend[] = ['virtuosity', 'lyricism', 'sacred', 'secular', 'nationalist', 'cosmopolitan'];
  const opposites: Record<TasteTrend, TasteTrend> = {
    virtuosity: 'lyricism',
    lyricism: 'virtuosity',
    sacred: 'secular',
    secular: 'sacred',
    nationalist: 'cosmopolitan',
    cosmopolitan: 'nationalist'
  };
  
  // 50% chance to shift one trend
  if (Math.random() > 0.5) {
    const newTrends = [...current.current];
    const indexToChange = Math.floor(Math.random() * newTrends.length);
    const available = allTrends.filter(t => 
      !newTrends.includes(t) && t !== opposites[newTrends[indexToChange]]
    );
    if (available.length > 0) {
      newTrends[indexToChange] = available[Math.floor(Math.random() * available.length)];
    }
    
    return {
      current: newTrends,
      intensity: Math.min(80, current.intensity + 10)
    };
  }
  
  return current;
}

export function addLogEntry(state: GameState, text: string, type: LogEntry['type']): GameState {
  const entry: LogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: { ...state.currentDate },
    text,
    type
  };
  
  return {
    ...state,
    eventLog: [entry, ...state.eventLog].slice(0, 100) // Keep last 100 entries
  };
}

export function checkMilestones(state: GameState): { state: GameState; newMilestones: string[] } {
  const milestones: { id: string; name: string; condition: (s: GameState) => boolean }[] = [
    { id: 'first_work', name: 'First Performance', condition: s => s.completedWorks.length >= 1 },
    { id: 'reputation_25', name: 'Rising Talent', condition: s => s.stats.reputation >= 25 },
    { id: 'reputation_50', name: 'Established Composer', condition: s => s.stats.reputation >= 50 },
    { id: 'reputation_100', name: 'Minor Famous Composer', condition: s => s.stats.reputation >= 100 },
    { id: 'five_works', name: 'Prolific Artist', condition: s => s.completedWorks.length >= 5 },
    { id: 'symphony_premiere', name: 'Symphonist', condition: s => s.completedWorks.some(w => w.form === 'symphony') },
    { id: 'wealthy', name: 'Comfortable Living', condition: s => s.stats.money >= 1000 },
    { id: 'patron_favor', name: 'Patron\'s Favorite', condition: s => s.patrons.some(p => p.relationship >= 50) }
  ];
  
  const newMilestones: string[] = [];
  let newState = state;
  
  for (const milestone of milestones) {
    if (!state.achievedMilestones.includes(milestone.id) && milestone.condition(state)) {
      newMilestones.push(milestone.name);
      newState = {
        ...newState,
        achievedMilestones: [...newState.achievedMilestones, milestone.id]
      };
      newState = addLogEntry(newState, `Achievement unlocked: ${milestone.name}!`, 'system');
    }
  }
  
  return { state: newState, newMilestones };
}
