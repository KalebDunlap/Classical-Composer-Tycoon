import {
  CompositionForm,
  CompositionStyle,
  Instrumentation,
  CompositionPhases,
  Skills,
  TasteState,
  VenueType,
  ScoreFactors,
  WorkInProgress,
  COMPOSITION_FORMS,
  VENUES,
  STYLES,
  INSTRUMENTATIONS,
  MUSICIAN_COSTS,
  PremiereSetup,
  TasteTrend
} from './gameTypes';

export function calculateBaseQuality(
  work: WorkInProgress,
  skills: Skills
): number {
  const formData = COMPOSITION_FORMS[work.form];
  const styleData = STYLES[work.style];
  
  // Calculate how well each phase was completed (target is 25 each for perfect balance)
  const totalPhasePoints = work.phases.sketching + work.phases.orchestration + 
                          work.phases.rehearsalPrep + work.phases.revision;
  
  const phaseBalance = calculatePhaseBalance(work.phases);
  
  // Skill contribution with diminishing returns
  // Skills above 15 contribute less per point
  const diminishingSkill = (skill: number) => {
    if (skill <= 15) return skill;
    return 15 + (skill - 15) * 0.5; // Half value above 15
  };
  
  const melodyContrib = diminishingSkill(skills.melody) * styleData.modifiers.melody;
  const harmonyContrib = diminishingSkill(skills.harmony) * styleData.modifiers.harmony;
  const orchestrationContrib = diminishingSkill(skills.orchestration) * styleData.modifiers.orchestration;
  const formContrib = diminishingSkill(skills.form);
  
  const skillAverage = (melodyContrib + harmonyContrib + orchestrationContrib + formContrib) / 4;
  
  // Base quality formula - rebalanced to cap around 55-65 without bonuses
  // Phase efficiency matters more, but gives less points
  const phaseEfficiency = Math.min(1.2, totalPhasePoints / (formData.baseWeeks * 8));
  const baseQuality = (skillAverage * 0.4) + (phaseBalance * 12) + (phaseEfficiency * 20);
  
  // Difficulty penalty is steeper - complex works are harder to master
  const difficultyPenalty = (formData.difficulty - 1) * 3; // 0 to 15 penalty
  
  // Random luck factor (-10 to +8) - genius moments vs. off days
  const luckFactor = Math.floor(Math.random() * 19) - 10;
  
  // Inspiration affects quality ceiling - low inspiration caps quality
  // This is checked during premiere, not here, but we add a small modifier
  const rawQuality = baseQuality - difficultyPenalty + luckFactor;
  
  // Clamp to 0-75 for base quality - need bonuses to get higher
  return Math.round(Math.min(75, Math.max(0, rawQuality)));
}

function calculatePhaseBalance(phases: CompositionPhases): number {
  const values = [phases.sketching, phases.orchestration, phases.rehearsalPrep, phases.revision];
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  
  // Perfect balance is 25% each
  const targetPct = 0.25;
  const deviations = values.map(v => Math.abs((v / total) - targetPct));
  const avgDeviation = deviations.reduce((a, b) => a + b, 0) / 4;
  
  // Score from 0 to 1, where 1 is perfect balance
  return 1 - (avgDeviation * 4);
}

export function calculateTrendAlignment(
  work: WorkInProgress,
  tastes: TasteState
): number {
  let alignment = 0;
  
  const trendEffects: Record<TasteTrend, { forms: CompositionForm[]; styles: CompositionStyle[] }> = {
    virtuosity: { 
      forms: ['concerto', 'piano_sonata'], 
      styles: ['late_romantic'] 
    },
    lyricism: { 
      forms: ['lied', 'string_quartet'], 
      styles: ['early_romantic'] 
    },
    sacred: { 
      forms: ['mass'], 
      styles: ['classical'] 
    },
    secular: { 
      forms: ['opera', 'symphony', 'concerto'], 
      styles: ['late_romantic', 'early_romantic'] 
    },
    nationalist: { 
      forms: ['symphony', 'opera'], 
      styles: ['late_romantic'] 
    },
    cosmopolitan: { 
      forms: ['string_quartet', 'piano_sonata', 'concerto'], 
      styles: ['classical', 'early_romantic'] 
    }
  };
  
  for (const trend of tastes.current) {
    const effects = trendEffects[trend];
    if (effects.forms.includes(work.form)) alignment += 15;
    if (effects.styles.includes(work.style)) alignment += 10;
  }
  
  // Apply intensity modifier
  alignment = alignment * (tastes.intensity / 50);
  
  return Math.round(alignment);
}

export function calculateVenueMatch(
  work: WorkInProgress,
  venueType: VenueType
): number {
  const venue = VENUES[venueType];
  const formData = COMPOSITION_FORMS[work.form];
  
  // Check if venue is ideal for this form
  if (venue.bestFor.includes(work.form)) {
    return 20;
  }
  
  // Penalty for mismatched venues
  // E.g., Symphony in a salon is bad, Piano sonata in opera house is wasteful
  const instrumentation = INSTRUMENTATIONS[work.instrumentation];
  
  if (venue.capacity < 100 && instrumentation.complexity > 3) {
    return -15; // Too big for the space
  }
  
  if (venue.capacity > 1000 && instrumentation.complexity < 2) {
    return -10; // Too small for the venue
  }
  
  return 5; // Neutral match
}

export function calculateMusicianQualityBonus(
  quality: PremiereSetup['musicianQuality'],
  instrumentation: Instrumentation
): number {
  const { multiplier } = MUSICIAN_COSTS[quality];
  const complexity = INSTRUMENTATIONS[instrumentation].complexity;
  
  // Better musicians matter more for complex works
  const baseBonus = (multiplier - 1) * 30;
  const complexityBonus = (complexity - 1) * 2 * (multiplier - 0.7);
  
  return Math.round(baseBonus + complexityBonus);
}

export function calculatePremiereSuccess(
  work: WorkInProgress,
  skills: Skills,
  tastes: TasteState,
  premiereSetup: PremiereSetup
): { quality: number; factors: ScoreFactors; earnings: number; reputationGained: number; review: string; initialPopularity: number } {
  const baseQuality = calculateBaseQuality(work, skills);
  const trendAlignment = calculateTrendAlignment(work, tastes);
  const venueMatch = calculateVenueMatch(work, premiereSetup.venue);
  const musicianQuality = calculateMusicianQualityBonus(premiereSetup.musicianQuality, work.instrumentation);
  
  // Skill bonus - reduced impact, only kicks in at high skill levels
  const avgSkill = (skills.melody + skills.harmony + skills.orchestration + skills.form) / 4;
  const skillBonus = Math.max(0, Math.round((avgSkill - 15) * 0.3)); // Only bonus if avg > 15
  
  // Patron bonus if dedicated - reduced
  let patronBonus = 0;
  if (premiereSetup.dedicatedTo) {
    patronBonus = 5;
  }
  
  const factors: ScoreFactors = {
    baseQuality,
    skillBonus,
    trendAlignment,
    venueMatch,
    musicianQuality,
    patronBonus
  };
  
  // Perfect scores (95+) should be very rare
  const rawTotal = baseQuality + skillBonus + trendAlignment + venueMatch + musicianQuality + patronBonus;
  // Apply a soft cap above 85 - diminishing returns
  let totalQuality = rawTotal;
  if (rawTotal > 85) {
    totalQuality = 85 + (rawTotal - 85) * 0.5;
  }
  totalQuality = Math.min(100, Math.max(0, Math.round(totalQuality)));
  
  // Calculate earnings and reputation - increased base earnings
  const venue = VENUES[premiereSetup.venue];
  const formData = COMPOSITION_FORMS[work.form];
  
  // Premiere earnings boosted to help with costs
  const baseEarnings = venue.capacity * (totalQuality / 100) * 0.8;
  const advertisingBonus = premiereSetup.advertisingSpent * 2;
  const earnings = Math.round(baseEarnings + advertisingBonus);
  
  const baseReputation = formData.difficulty * (totalQuality / 100) * 3;
  const venuePrestigeBonus = venue.prestige * 2;
  const reputationGained = Math.round(baseReputation + venuePrestigeBonus);
  
  const review = generateReview(totalQuality, work, factors);
  
  // Calculate initial popularity based on quality and venue prestige
  const initialPopularity = Math.min(100, Math.round(totalQuality * 0.8 + venue.prestige * 5));
  
  return { quality: totalQuality, factors, earnings, reputationGained, review, initialPopularity };
}

function generateReview(quality: number, work: WorkInProgress, factors: ScoreFactors): string {
  const formData = COMPOSITION_FORMS[work.form];
  const styleData = STYLES[work.style];
  
  const reviews = {
    terrible: [
      `"A bewildering cacophony that sent half the audience fleeing before the finale."`,
      `"One struggles to find any redeeming quality in this unfortunate attempt at ${formData.name.toLowerCase()}."`,
      `"The less said about last evening's performance, the better for everyone concerned."`
    ],
    poor: [
      `"A work of modest ambitions, achieving even less than it attempts."`,
      `"While not entirely without merit, one cannot recommend this ${formData.name.toLowerCase()} to persons of refined taste."`,
      `"The ${styleData.name.toLowerCase()} idiom deserves better treatment than this."`
    ],
    mediocre: [
      `"A competent if uninspired work that will neither offend nor particularly delight."`,
      `"Perfectly adequate for background music at a modest gathering."`,
      `"The composer shows promise, though this ${formData.name.toLowerCase()} falls short of greatness."`
    ],
    good: [
      `"A thoroughly enjoyable ${formData.name.toLowerCase()} that rewards careful listening."`,
      `"The composer demonstrates genuine command of the ${styleData.name.toLowerCase()} style."`,
      `"An evening well spent - we eagerly await the next offering from this talented pen."`
    ],
    excellent: [
      `"A masterful ${formData.name.toLowerCase()} that had the audience in raptures."`,
      `"Here is a composer who truly understands the power of music to move the soul."`,
      `"Bravo! A work of genuine distinction that will surely enter the repertoire."`
    ],
    masterpiece: [
      `"We have witnessed history. This ${formData.name.toLowerCase()} will be remembered for generations."`,
      `"Sublime. There are no other words adequate to describe this triumph."`,
      `"The very heavens seemed to open. A work of transcendent genius."`
    ]
  };
  
  let category: keyof typeof reviews;
  if (quality < 20) category = 'terrible';
  else if (quality < 40) category = 'poor';
  else if (quality < 55) category = 'mediocre';
  else if (quality < 70) category = 'good';
  else if (quality < 85) category = 'excellent';
  else category = 'masterpiece';
  
  const options = reviews[category];
  return options[Math.floor(Math.random() * options.length)];
}

export function generateWorkTitle(form: CompositionForm, workNumber: number): string {
  const prefixes: Record<CompositionForm, string[]> = {
    piano_sonata: ['Sonata', 'Grand Sonata', 'Sonatina'],
    string_quartet: ['Quartet', 'String Quartet'],
    symphony: ['Symphony', 'Grand Symphony', 'Sinfonia'],
    lied: ['Lied', 'Song', 'Romance'],
    opera: ['', ''],
    mass: ['Mass', 'Missa'],
    concerto: ['Concerto', 'Grand Concerto']
  };
  
  const keys = ['C major', 'G major', 'D major', 'A major', 'E major', 'B major',
                'F major', 'B-flat major', 'E-flat major', 'A-flat major',
                'C minor', 'G minor', 'D minor', 'A minor', 'E minor', 'F minor',
                'B-flat minor', 'E-flat minor', 'F-sharp minor', 'C-sharp minor'];
  
  const opusNumber = 1 + Math.floor(workNumber * 1.5);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const prefix = prefixes[form][Math.floor(Math.random() * prefixes[form].length)];
  
  if (form === 'opera') {
    const operaTitles = ['Die Zauberflöte', 'Leonore', 'Der Freischütz', 'Euryanthe', 
                         'La Vestale', 'Medea', 'Armide', 'Iphigénie'];
    return operaTitles[Math.floor(Math.random() * operaTitles.length)];
  }
  
  if (form === 'lied') {
    const songTitles = ['Wanderer', 'Sehnsucht', 'An die Musik', 'Erlkönig', 
                        'Gretchen am Spinnrade', 'Die Forelle', 'Nachtlied'];
    return `"${songTitles[Math.floor(Math.random() * songTitles.length)]}", Op. ${opusNumber}`;
  }
  
  return `${prefix} in ${key}, Op. ${opusNumber}`;
}
