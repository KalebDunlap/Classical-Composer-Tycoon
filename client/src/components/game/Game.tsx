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
import { ComposeTab } from './ComposeTab';
import { PremiereTab } from './PremiereTab';
import { CareerTab } from './CareerTab';
import { UpgradesTab } from './UpgradesTab';
import { HistoryTab } from './HistoryTab';
import { EventModal } from './EventModal';
import { ResultsModal } from './ResultsModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
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
  const [activeTab, setActiveTab] = useState('compose');
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
    
    let newState = {
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
    
    let newState = {
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
    
    const { quality, factors, earnings, reputationGained, review } = calculatePremiereSuccess(
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
      factors
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
    <div className="h-screen flex bg-background">
      <ResourcesSidebar gameState={gameState} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-3 border-b bg-card/50">
          <h1 className="font-serif text-lg font-semibold">
            Classical Composer Tycoon
          </h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveGame}
              data-testid="button-save-game"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleExitGame}
              className="text-muted-foreground hover:text-destructive"
              data-testid="button-exit-game"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="mx-4 mt-4 mb-0 justify-start bg-muted/50 p-1">
              <TabsTrigger value="compose" className="gap-2" data-testid="tab-compose">
                <Music className="h-4 w-4" />
                Compose
              </TabsTrigger>
              <TabsTrigger value="premiere" className="gap-2" data-testid="tab-premiere">
                <Theater className="h-4 w-4" />
                Premiere
                {readyForPremiere && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </TabsTrigger>
              <TabsTrigger value="career" className="gap-2" data-testid="tab-career">
                <Briefcase className="h-4 w-4" />
                Career
              </TabsTrigger>
              <TabsTrigger value="upgrades" className="gap-2" data-testid="tab-upgrades">
                <ShoppingBag className="h-4 w-4" />
                Upgrades
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2" data-testid="tab-history">
                <BookOpen className="h-4 w-4" />
                History
              </TabsTrigger>
              <div className="flex-1" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextWeek}
                className="h-8 gap-2 ml-2 hover:bg-primary/10"
                data-testid="button-next-week"
              >
                <span>Next Week</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-4">
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
    </div>
  );
}
