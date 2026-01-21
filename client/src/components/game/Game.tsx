import { useState, useEffect, useCallback } from 'react';
import { 
  GameState, 
  WorkInProgress,
  PremiereSetup,
  CompletedWork,
  EventChoice
} from '@/lib/gameTypes';
import { 
  createInitialState, 
  saveGame, 
  loadGame, 
  advanceWeek,
  addLogEntry,
  checkMilestones
} from '@/lib/gameState';
import { getRandomEvent } from '@/lib/gameEvents';
import { calculatePremiereSuccess } from '@/lib/compositionEngine';
import { StartScreen } from './StartScreen';
import { ResourcesSidebar } from './ResourcesSidebar';
import { LogPanel } from './LogPanel';
import { HomeTab } from './HomeTab';
import { ComposeTab } from './ComposeTab';
import { PremiereTab } from './PremiereTab';
import { CareerTab } from './CareerTab';
import { UpgradesTab } from './UpgradesTab';
import { HistoryTab } from './HistoryTab';
import { EventModal } from './EventModal';
import { ResultsModal } from './ResultsModal';
import { AudioPlayer } from './AudioPlayer';
import { RevivalModal, REVIVAL_COST, REVIVAL_INSPIRATION_COST } from './RevivalModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Home,
  Music, 
  Theater, 
  Briefcase, 
  ShoppingBag, 
  BookOpen,
  Save,
  LogOut,
  ChevronRight
} from 'lucide-react';

export function Game() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [readyForPremiere, setReadyForPremiere] = useState<WorkInProgress | null>(null);
  const [premiereResult, setPremiereResult] = useState<CompletedWork | null>(null);
  const { toast } = useToast();
  
  // Auto-save
  useEffect(() => {
    if (gameState?.started) {
      saveGame(gameState);
    }
  }, [gameState]);

  const handleNewGame = useCallback((composerName: string) => {
    const newState = createInitialState(composerName);
    setGameState(newState);
    toast({
      title: 'A New Journey Begins',
      description: `${composerName} begins their career in Vienna, 1820.`
    });
  }, [toast]);

  const handleLoadGame = useCallback(() => {
    const loaded = loadGame();
    if (loaded) {
      setGameState(loaded);
      toast({
        title: 'Welcome Back',
        description: `Continuing the journey of ${loaded.composerName}.`
      });
    }
  }, [toast]);

  const handleSaveGame = useCallback(() => {
    if (gameState) {
      saveGame(gameState);
      toast({
        title: 'Progress Saved',
        description: 'Your game has been saved.'
      });
    }
  }, [gameState, toast]);

  const handleExitGame = useCallback(() => {
    if (gameState) {
      saveGame(gameState);
    }
    setGameState(null);
  }, [gameState]);

  const handleNextWeek = useCallback(() => {
    if (!gameState) return;
    
    let newState = advanceWeek(gameState);
    newState = addLogEntry(newState, "A week passed in quiet contemplation.", 'system');
    
    // Check for random events
    const event = getRandomEvent(newState.stats.reputation);
    if (event) {
      newState = {
        ...newState,
        currentEvent: event
      };
    }
    
    // Check milestones
    const { state: checkedState, newMilestones } = checkMilestones(newState);
    newState = checkedState;
    
    newMilestones.forEach(milestone => {
      toast({
        title: 'Achievement Unlocked!',
        description: milestone
      });
    });
    
    setGameState(newState);
    toast({
      title: 'Time Passes',
      description: 'You advanced to the next week.'
    });
  }, [gameState, toast]);

  const handleStartComposition = useCallback((work: WorkInProgress) => {
    if (!gameState) return;
    
    let newState: GameState = {
      ...gameState,
      workInProgress: work
    };
    newState = addLogEntry(newState, `Began work on "${work.title}".`, 'composition');
    setGameState(newState);
  }, [gameState]);

  const handleWorkWeek = useCallback((phases: WorkInProgress['phases']) => {
    if (!gameState?.workInProgress) return;
    
    // First update the work in progress with new phases and increment weeks
    let newState: GameState = {
      ...gameState,
      workInProgress: {
        ...gameState.workInProgress,
        phases,
        weeksSpent: gameState.workInProgress.weeksSpent + 1
      }
    };
    
    // Then advance the week (handles health recovery, inspiration drift, trend shifts)
    newState = advanceWeek(newState);
    
    // Check for random events
    const event = getRandomEvent(newState.stats.reputation);
    if (event) {
      newState = {
        ...newState,
        currentEvent: event
      };
    }
    
    // Check milestones
    const { state: checkedState, newMilestones } = checkMilestones(newState);
    newState = checkedState;
    
    newMilestones.forEach(milestone => {
      toast({
        title: 'Achievement Unlocked!',
        description: milestone
      });
    });
    
    setGameState(newState);
  }, [gameState, toast]);

  const handleFinishComposition = useCallback(() => {
    if (!gameState?.workInProgress) return;
    
    const work = gameState.workInProgress;
    setReadyForPremiere(work);
    
    let newState: GameState = {
      ...gameState,
      workInProgress: null
    };
    newState = addLogEntry(newState, `Completed "${work.title}". Ready for premiere.`, 'composition');
    setGameState(newState);
    setActiveTab('premiere');
    
    toast({
      title: 'Composition Complete!',
      description: `"${work.title}" is ready for its premiere.`
    });
  }, [gameState, toast]);

  const handleSchedulePremiere = useCallback((setup: PremiereSetup) => {
    if (!gameState || !readyForPremiere) return;
    
    const { quality, factors, earnings, reputationGained, review, initialPopularity } = calculatePremiereSuccess(
      readyForPremiere,
      gameState.skills,
      gameState.tastes,
      setup
    );
    
    // Import venue and musician costs
    const venueCosts: Record<string, number> = {
      salon: 10, church: 25, small_hall: 75, concert_hall: 200, opera_house: 500
    };
    const musicianCosts: Record<string, number> = {
      amateur: 20, competent: 50, professional: 120, virtuoso: 300
    };
    const instCosts: Record<string, number> = {
      solo_piano: 0, voice_and_piano: 15, chamber_ensemble: 30,
      small_orchestra: 80, full_orchestra: 150, choir_and_orchestra: 200
    };
    
    const totalCost = 
      venueCosts[setup.venue] +
      setup.advertisingSpent +
      musicianCosts[setup.musicianQuality] +
      instCosts[readyForPremiere.instrumentation];
    
    const completedWork: CompletedWork = {
      id: `work_${Date.now()}`,
      title: readyForPremiere.title,
      form: readyForPremiere.form,
      style: readyForPremiere.style,
      instrumentation: readyForPremiere.instrumentation,
      quality,
      premiereDate: { ...gameState.currentDate },
      venue: setup.venue,
      earnings,
      reputationGained,
      review,
      dedicatedTo: setup.dedicatedTo ? 
        gameState.patrons.find(p => p.id === setup.dedicatedTo)?.name : undefined,
      factors,
      popularity: initialPopularity,
      weeksSincePremiere: 0,
      totalPublisherEarnings: 0
    };
    
    // Update patron relationship if dedicated
    let updatedPatrons = gameState.patrons;
    if (setup.dedicatedTo) {
      updatedPatrons = gameState.patrons.map(p => 
        p.id === setup.dedicatedTo 
          ? { ...p, relationship: Math.min(100, p.relationship + 15) }
          : p
      );
    }
    
    // Skill progression from completing works
    const skillGains = {
      melody: quality >= 60 ? 1 : 0,
      harmony: quality >= 50 ? 1 : 0,
      orchestration: ['full_orchestra', 'small_orchestra', 'choir_and_orchestra'].includes(readyForPremiere.instrumentation) ? 2 : 0,
      form: quality >= 70 ? 1 : 0,
      productivity: 1,
      social: setup.dedicatedTo ? 1 : 0
    };
    
    const updatedSkills = {
      melody: Math.min(100, gameState.skills.melody + skillGains.melody),
      harmony: Math.min(100, gameState.skills.harmony + skillGains.harmony),
      orchestration: Math.min(100, gameState.skills.orchestration + skillGains.orchestration),
      form: Math.min(100, gameState.skills.form + skillGains.form),
      productivity: Math.min(100, gameState.skills.productivity + skillGains.productivity),
      social: Math.min(100, gameState.skills.social + skillGains.social)
    };
    
    let newState: GameState = {
      ...gameState,
      stats: {
        ...gameState.stats,
        money: gameState.stats.money - totalCost + earnings,
        reputation: gameState.stats.reputation + reputationGained,
        inspiration: Math.min(100, gameState.stats.inspiration + 10)
      },
      skills: updatedSkills,
      patrons: updatedPatrons,
      completedWorks: [...gameState.completedWorks, completedWork]
    };
    
    newState = addLogEntry(
      newState, 
      `Premiered "${completedWork.title}" at ${setup.venue.replace('_', ' ')}. Quality: ${quality}.`,
      'premiere'
    );
    
    // Check milestones
    const { state: checkedState, newMilestones } = checkMilestones(newState);
    newState = checkedState;
    
    setGameState(newState);
    setReadyForPremiere(null);
    setPremiereResult(completedWork);
    
    newMilestones.forEach(milestone => {
      toast({
        title: 'Achievement Unlocked!',
        description: milestone
      });
    });
  }, [gameState, readyForPremiere, toast]);

  const handleEventChoice = useCallback((choice: EventChoice) => {
    if (!gameState) return;
    
    let newStats = { ...gameState.stats };
    let newSkills = { ...gameState.skills };
    
    choice.effects.forEach(effect => {
      switch (effect.type) {
        case 'money':
          newStats.money = Math.max(0, newStats.money + effect.value);
          break;
        case 'reputation':
          newStats.reputation = Math.max(0, newStats.reputation + effect.value);
          break;
        case 'health':
          newStats.health = Math.max(0, Math.min(newStats.maxHealth, newStats.health + effect.value));
          break;
        case 'inspiration':
          newStats.inspiration = Math.max(0, Math.min(100, newStats.inspiration + effect.value));
          break;
        case 'connection':
          newStats.connections = Math.max(0, newStats.connections + effect.value);
          break;
        case 'skill':
          if (effect.target && effect.target in newSkills) {
            newSkills[effect.target as keyof typeof newSkills] = 
              Math.max(0, Math.min(100, newSkills[effect.target as keyof typeof newSkills] + effect.value));
          }
          break;
      }
    });
    
    let newState: GameState = {
      ...gameState,
      stats: newStats,
      skills: newSkills,
      currentEvent: null
    };
    
    newState = addLogEntry(newState, `${gameState.currentEvent?.title}: Chose "${choice.text}"`, 'event');
    
    setGameState(newState);
  }, [gameState]);

  const handlePurchaseUpgrade = useCallback((upgradeId: string) => {
    if (!gameState) return;
    
    const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return;
    if (gameState.stats.money < upgrade.cost) return;
    if (gameState.stats.reputation < upgrade.requiredReputation) return;
    
    let newStats = { ...gameState.stats };
    let newSkills = { ...gameState.skills };
    
    newStats.money -= upgrade.cost;
    
    upgrade.effects.forEach(effect => {
      if (effect.type === 'stat_boost' && effect.target) {
        if (effect.target in newStats) {
          (newStats as any)[effect.target] += effect.value;
        }
      } else if (effect.type === 'skill_boost' && effect.target) {
        if (effect.target in newSkills) {
          (newSkills as any)[effect.target] = Math.min(100, (newSkills as any)[effect.target] + effect.value);
        }
      }
    });
    
    const newUpgrades = gameState.upgrades.map(u => 
      u.id === upgradeId ? { ...u, purchased: true } : u
    );
    
    let newState: GameState = {
      ...gameState,
      stats: newStats,
      skills: newSkills,
      upgrades: newUpgrades
    };
    
    newState = addLogEntry(newState, `Purchased: ${upgrade.name}`, 'upgrade');
    
    setGameState(newState);
    
    toast({
      title: 'Upgrade Purchased',
      description: upgrade.name
    });
  }, [gameState, toast]);

  const handleCloseResults = useCallback(() => {
    setPremiereResult(null);
    setActiveTab('compose');
  }, []);

  const handleAcceptRevival = useCallback(() => {
    if (!gameState || !gameState.pendingRevival) return;
    
    const revival = gameState.pendingRevival;
    const originalWork = gameState.completedWorks.find(w => w.id === revival.workId);
    if (!originalWork) return;
    
    // Check if player can afford
    if (gameState.stats.money < REVIVAL_COST || gameState.stats.inspiration < REVIVAL_INSPIRATION_COST) {
      toast({
        title: 'Insufficient Resources',
        description: 'You need more money or inspiration to revive this work.',
        variant: 'destructive'
      });
      return;
    }
    
    // Create the revival work - a new version with boosted quality
    const qualityBoost = Math.round((gameState.skills.melody + gameState.skills.harmony) / 10);
    const newQuality = Math.min(100, revival.originalQuality + qualityBoost + Math.floor(Math.random() * 10));
    
    const revivedWork: CompletedWork = {
      id: `work_revival_${Date.now()}`,
      title: `${originalWork.title} (Revised)`,
      form: originalWork.form,
      style: originalWork.style,
      instrumentation: originalWork.instrumentation,
      quality: newQuality,
      premiereDate: { ...gameState.currentDate },
      venue: originalWork.venue,
      earnings: Math.round(newQuality * 5), // Bonus earnings from revival
      reputationGained: Math.round(newQuality / 10),
      review: `"A masterful revision that brings new life to a beloved classic."`,
      dedicatedTo: undefined,
      factors: {
        baseQuality: revival.originalQuality,
        skillBonus: qualityBoost,
        trendAlignment: 0,
        venueMatch: 0,
        musicianQuality: 0,
        patronBonus: 0
      },
      popularity: Math.min(100, newQuality + 10),
      weeksSincePremiere: 0,
      totalPublisherEarnings: 0,
      isRevival: true,
      originalWorkId: revival.workId
    };
    
    let newState: GameState = {
      ...gameState,
      stats: {
        ...gameState.stats,
        money: gameState.stats.money - REVIVAL_COST + revivedWork.earnings,
        reputation: gameState.stats.reputation + revivedWork.reputationGained,
        inspiration: gameState.stats.inspiration - REVIVAL_INSPIRATION_COST + 15
      },
      completedWorks: [...gameState.completedWorks, revivedWork],
      pendingRevival: null
    };
    
    newState = addLogEntry(
      newState, 
      `Revised and re-premiered "${revivedWork.title}" with quality ${newQuality}!`,
      'revival'
    );
    
    setGameState(newState);
    setPremiereResult(revivedWork);
    
    toast({
      title: 'Revival Complete!',
      description: `"${revivedWork.title}" has been successfully revived.`
    });
  }, [gameState, toast]);

  const handleDeclineRevival = useCallback(() => {
    if (!gameState) return;
    
    setGameState({
      ...gameState,
      pendingRevival: null
    });
    
    toast({
      title: 'Revival Declined',
      description: 'Perhaps another opportunity will arise.'
    });
  }, [gameState, toast]);

  // Not started yet - show start screen
  if (!gameState?.started) {
    return (
      <StartScreen 
        onNewGame={handleNewGame}
        onLoadGame={handleLoadGame}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      <div className="hidden md:block">
        <ResourcesSidebar gameState={gameState} />
      </div>
      
      {/* Mobile Resources Header */}
      <div className="md:hidden border-b bg-sidebar p-2 flex justify-around items-center text-xs overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Coins className="h-3 w-3 text-amber-600" />
          <span>{formatMoney(gameState.stats.money)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-purple-600" />
          <span>{gameState.stats.reputation}</span>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-blue-600" />
          <span>{gameState.stats.inspiration}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-3 w-3 text-red-600" />
          <span>{gameState.stats.health}/{gameState.stats.maxHealth}</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between p-2 md:p-3 border-b bg-card/50">
          <h1 className="font-serif text-base md:text-lg font-semibold truncate mr-2">
            Composer Tycoon
          </h1>
          <div className="flex items-center gap-1 md:gap-2">
            <AudioPlayer />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveGame}
              data-testid="button-save-game"
              className="h-8 px-2 md:px-3"
            >
              <Save className="h-3.5 w-3.5 md:mr-2" />
              <span className="hidden md:inline">Save</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleExitGame}
              className="h-8 px-2 md:px-3 text-muted-foreground hover:text-destructive"
              data-testid="button-exit-game"
            >
              <LogOut className="h-3.5 w-3.5 md:mr-2" />
              <span className="hidden md:inline">Exit</span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden flex flex-col">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-2 md:px-4 mt-2 md:mt-4 mb-0 overflow-x-auto scrollbar-hide">
              <TabsList className="justify-start bg-muted/50 p-1 h-auto flex-nowrap inline-flex">
                <TabsTrigger value="home" className="gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm" data-testid="tab-home">
                  <Home className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Home</span>
                </TabsTrigger>
                <TabsTrigger value="compose" className="gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm" data-testid="tab-compose">
                  <Music className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Compose</span>
                </TabsTrigger>
                <TabsTrigger value="premiere" className="gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm relative" data-testid="tab-premiere">
                  <Theater className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Premiere</span>
                  {readyForPremiere && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="career" className="gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm" data-testid="tab-career">
                  <Briefcase className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Career</span>
                </TabsTrigger>
                <TabsTrigger value="upgrades" className="gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm" data-testid="tab-upgrades">
                  <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Upgrades</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm" data-testid="tab-history">
                  <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex justify-end px-2 md:px-4 mt-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextWeek}
                className="h-8 gap-1 md:gap-2"
                data-testid="button-next-week"
              >
                <span className="text-xs md:text-sm">Next Week</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden p-2 md:p-4">
              <TabsContent value="home" className="m-0 h-full overflow-y-auto">
                <HomeTab 
                  gameState={gameState}
                  onStartComposing={() => setActiveTab('compose')}
                />
              </TabsContent>
              
              <TabsContent value="compose" className="m-0 h-full">
                <ComposeTab
                  gameState={gameState}
                  onStartComposition={handleStartComposition}
                  onWorkWeek={handleWorkWeek}
                  onFinishComposition={handleFinishComposition}
                />
              </TabsContent>
              
              <TabsContent value="premiere" className="m-0 h-full">
                <PremiereTab
                  gameState={gameState}
                  readyWork={readyForPremiere}
                  onSchedulePremiere={handleSchedulePremiere}
                />
              </TabsContent>
              
              <TabsContent value="career" className="m-0 h-full">
                <CareerTab gameState={gameState} />
              </TabsContent>
              
              <TabsContent value="upgrades" className="m-0 h-full">
                <UpgradesTab 
                  gameState={gameState}
                  onPurchaseUpgrade={handlePurchaseUpgrade}
                />
              </TabsContent>
              
              <TabsContent value="history" className="m-0 h-full">
                <HistoryTab works={gameState.completedWorks} />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
      
      <LogPanel entries={gameState.eventLog} />
      
      <EventModal 
        event={gameState.currentEvent}
        onChoice={handleEventChoice}
      />
      
      <ResultsModal
        result={premiereResult}
        onClose={handleCloseResults}
      />
      
      {gameState.pendingRevival && !gameState.currentEvent && !premiereResult && (
        <RevivalModal
          revival={gameState.pendingRevival}
          originalWork={gameState.completedWorks.find(w => w.id === gameState.pendingRevival?.workId)}
          onAccept={handleAcceptRevival}
          onDecline={handleDeclineRevival}
          playerMoney={gameState.stats.money}
          playerInspiration={gameState.stats.inspiration}
        />
      )}
    </div>
  );
}
