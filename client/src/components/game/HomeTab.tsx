import { GameState } from '@/lib/gameTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Sparkles, Heart, Coins, Lightbulb } from 'lucide-react';

interface HomeTabProps {
  gameState: GameState;
  onStartComposing: () => void;
}

type RoomTier = 'garret' | 'apartment' | 'grand_study' | 'country_retreat';

function getRoomTier(upgrades: GameState['upgrades']): RoomTier {
  const hasBetterApartment = upgrades.find(u => u.id === 'better_apartment')?.purchased;
  const hasGrandStudy = upgrades.find(u => u.id === 'grand_study')?.purchased;
  const hasCountryRetreat = upgrades.find(u => u.id === 'country_retreat')?.purchased;
  
  if (hasCountryRetreat) return 'country_retreat';
  if (hasGrandStudy) return 'grand_study';
  if (hasBetterApartment) return 'apartment';
  return 'garret';
}

function getPianoType(upgrades: GameState['upgrades']): 'basic' | 'broadwood' | 'erard' {
  const hasErard = upgrades.find(u => u.id === 'erard_piano')?.purchased;
  const hasBroadwood = upgrades.find(u => u.id === 'quality_piano')?.purchased;
  
  if (hasErard) return 'erard';
  if (hasBroadwood) return 'broadwood';
  return 'basic';
}

const roomDescriptions: Record<RoomTier, { name: string; description: string }> = {
  garret: {
    name: 'Humble Garret',
    description: 'A small attic room in Vienna. Modest, but filled with dreams of greatness.'
  },
  apartment: {
    name: 'Modest Apartment',
    description: 'A comfortable dwelling in a quieter neighborhood. Room to think, room to compose.'
  },
  grand_study: {
    name: 'Grand Study',
    description: 'An elegant study with excellent acoustics. The workspace of a rising master.'
  },
  country_retreat: {
    name: 'Country Retreat',
    description: 'A peaceful villa in the countryside. Inspiration flows freely here.'
  }
};

const pianoDescriptions: Record<'basic' | 'broadwood' | 'erard', string> = {
  basic: 'A simple upright piano',
  broadwood: 'A fine Broadwood pianoforte',
  erard: 'A magnificent Érard grand piano'
};

export function HomeTab({ gameState, onStartComposing }: HomeTabProps) {
  const roomTier = getRoomTier(gameState.upgrades);
  const pianoType = getPianoType(gameState.upgrades);
  const roomInfo = roomDescriptions[roomTier];
  const pianoInfo = pianoDescriptions[pianoType];
  
  const isComposing = gameState.workInProgress !== null;
  const hasCopyist = gameState.upgrades.find(u => u.id === 'copyist')?.purchased;
  const hasAssistant = gameState.upgrades.find(u => u.id === 'assistant')?.purchased;
  
  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="font-serif" data-testid="text-room-name">{roomInfo.name}</CardTitle>
          <CardDescription data-testid="text-room-description">{roomInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20">
            <StudyScene 
              roomTier={roomTier} 
              pianoType={pianoType}
              isComposing={isComposing}
              composerName={gameState.composerName}
              workTitle={gameState.workInProgress?.title}
              hasCopyist={hasCopyist}
              hasAssistant={hasAssistant}
            />
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickStat 
              icon={<Coins className="h-4 w-4" />}
              label="Treasury"
              value={`${gameState.stats.money} Th.`}
            />
            <QuickStat 
              icon={<Sparkles className="h-4 w-4" />}
              label="Reputation"
              value={gameState.stats.reputation.toString()}
            />
            <QuickStat 
              icon={<Music className="h-4 w-4" />}
              label="Works"
              value={gameState.completedWorks.length.toString()}
            />
            <QuickStat 
              icon={<Heart className="h-4 w-4" />}
              label="Health"
              value={`${gameState.stats.health}/${gameState.stats.maxHealth}`}
            />
          </div>
          
          {!isComposing && (
            <div className="mt-4 flex justify-center">
              <Button 
                size="lg" 
                onClick={onStartComposing}
                className="gap-2"
                data-testid="button-home-compose"
              >
                <Music className="h-5 w-5" />
                Begin New Composition
              </Button>
            </div>
          )}
          
          {isComposing && gameState.workInProgress && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Currently composing:</p>
              <p className="font-serif text-lg font-semibold" data-testid="text-current-work">{gameState.workInProgress.title}</p>
              <p className="text-sm text-muted-foreground" data-testid="text-work-progress">
                Week {gameState.workInProgress.weeksSpent} of work
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Piano:</span>
            <span className="font-medium">{pianoInfo}</span>
          </div>
          {(hasCopyist || hasAssistant) && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Staff:</span>
              <span className="font-medium">
                {[hasCopyist && 'Copyist', hasAssistant && 'Assistant'].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface QuickStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function QuickStat({ icon, label, value }: QuickStatProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-semibold text-sm">{value}</span>
      </div>
    </div>
  );
}

interface StudySceneProps {
  roomTier: RoomTier;
  pianoType: 'basic' | 'broadwood' | 'erard';
  isComposing: boolean;
  composerName: string;
  workTitle?: string;
  hasCopyist?: boolean;
  hasAssistant?: boolean;
}

function StudyScene({ roomTier, pianoType, isComposing, composerName, hasCopyist, hasAssistant }: StudySceneProps) {
  const tierStyles = {
    garret: {
      wallColor: 'bg-amber-200/80 dark:bg-amber-900/40',
      floorColor: 'bg-amber-700/30 dark:bg-amber-800/50',
      windowCount: 1,
      hasBookshelf: false,
      hasChandelier: false,
      hasPortrait: false,
      windowView: 'rooftops'
    },
    apartment: {
      wallColor: 'bg-amber-100/90 dark:bg-amber-800/40',
      floorColor: 'bg-amber-600/25 dark:bg-amber-700/40',
      windowCount: 2,
      hasBookshelf: true,
      hasChandelier: false,
      hasPortrait: false,
      windowView: 'street'
    },
    grand_study: {
      wallColor: 'bg-emerald-100/80 dark:bg-emerald-900/30',
      floorColor: 'bg-amber-800/20 dark:bg-amber-900/50',
      windowCount: 2,
      hasBookshelf: true,
      hasChandelier: true,
      hasPortrait: true,
      windowView: 'garden'
    },
    country_retreat: {
      wallColor: 'bg-sky-100/80 dark:bg-sky-900/30',
      floorColor: 'bg-amber-700/15 dark:bg-amber-800/40',
      windowCount: 3,
      hasBookshelf: true,
      hasChandelier: true,
      hasPortrait: true,
      windowView: 'countryside'
    }
  };
  
  const style = tierStyles[roomTier];
  
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className={`flex-1 ${style.wallColor} relative overflow-hidden`}>
        <div className="absolute inset-x-0 bottom-0 h-2 bg-amber-800/20 dark:bg-amber-600/20" />
        
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-8">
          {Array.from({ length: style.windowCount }).map((_, i) => (
            <Window key={i} view={style.windowView} />
          ))}
        </div>
        
        {style.hasChandelier && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <Chandelier />
          </div>
        )}
        
        {style.hasPortrait && (
          <div className="absolute top-6 right-8">
            <Portrait />
          </div>
        )}
      </div>
      
      <div className={`h-1/3 ${style.floorColor} relative`}>
        <div className="absolute inset-0 flex items-end justify-center gap-8 pb-4 px-8">
          <div className="flex-1 flex justify-start items-end">
            {style.hasBookshelf && <Bookshelf />}
          </div>
          
          <div className="flex flex-col items-center">
            <Piano type={pianoType} isPlaying={isComposing} />
            <Composer name={composerName} isComposing={isComposing} />
          </div>
          
          <div className="flex-1 flex justify-end items-end gap-4">
            <Desk />
            {hasCopyist && <Staff role="copyist" />}
            {hasAssistant && <Staff role="assistant" />}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 text-center">
        <span className="text-xs font-serif text-muted-foreground/70 bg-background/50 px-2 py-1 rounded">
          {isComposing ? 'Hard at work...' : 'Awaiting inspiration...'}
        </span>
      </div>
    </div>
  );
}

function Window({ view }: { view: string }) {
  const viewColors = {
    rooftops: 'bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700',
    street: 'bg-gradient-to-b from-blue-200 to-gray-300 dark:from-blue-800 dark:to-gray-600',
    garden: 'bg-gradient-to-b from-sky-300 to-green-400 dark:from-sky-700 dark:to-green-800',
    countryside: 'bg-gradient-to-b from-sky-400 to-green-500 dark:from-sky-600 dark:to-green-700'
  };
  
  return (
    <div className="w-12 h-16 bg-amber-900/30 dark:bg-amber-700/40 rounded-t-lg p-1 shadow-inner">
      <div className={`w-full h-full rounded-t ${viewColors[view as keyof typeof viewColors] || viewColors.rooftops}`}>
        <div className="w-full h-full grid grid-cols-2 gap-px">
          <div className="bg-white/10" />
          <div className="bg-white/10" />
          <div className="bg-white/10" />
          <div className="bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function Chandelier() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-1 h-3 bg-amber-800/50" />
      <div className="w-8 h-3 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-full shadow-lg relative">
        <div className="absolute -bottom-1 left-1 w-1 h-2 bg-yellow-300/80 rounded-full animate-pulse" />
        <div className="absolute -bottom-1 right-1 w-1 h-2 bg-yellow-300/80 rounded-full animate-pulse" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-yellow-300/80 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

function Portrait() {
  return (
    <div className="w-8 h-10 bg-amber-800/40 dark:bg-amber-600/30 rounded-sm p-0.5 shadow">
      <div className="w-full h-full bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-800 rounded-sm flex items-center justify-center">
        <div className="w-3 h-4 bg-amber-600/30 rounded-full" />
      </div>
    </div>
  );
}

function Bookshelf() {
  return (
    <div className="w-12 h-20 bg-amber-800/60 dark:bg-amber-700/50 rounded-t-sm flex flex-col justify-end p-1 gap-1">
      <div className="flex gap-px h-4">
        <div className="flex-1 bg-red-800/70 rounded-t-sm" />
        <div className="flex-1 bg-blue-800/70 rounded-t-sm" />
        <div className="flex-1 bg-green-800/70 rounded-t-sm" />
      </div>
      <div className="flex gap-px h-4">
        <div className="flex-1 bg-amber-700/70 rounded-t-sm" />
        <div className="flex-1 bg-purple-800/70 rounded-t-sm" />
        <div className="flex-1 bg-gray-700/70 rounded-t-sm" />
      </div>
      <div className="flex gap-px h-4">
        <div className="flex-1 bg-emerald-800/70 rounded-t-sm" />
        <div className="flex-1 bg-rose-800/70 rounded-t-sm" />
        <div className="flex-1 bg-indigo-800/70 rounded-t-sm" />
      </div>
    </div>
  );
}

function Piano({ type, isPlaying }: { type: 'basic' | 'broadwood' | 'erard'; isPlaying: boolean }) {
  const sizes = {
    basic: 'w-16 h-12',
    broadwood: 'w-20 h-14',
    erard: 'w-28 h-16'
  };
  
  const colors = {
    basic: 'bg-amber-900/80 dark:bg-amber-800/70',
    broadwood: 'bg-amber-950/90 dark:bg-amber-900/80',
    erard: 'bg-gray-900/95 dark:bg-gray-800/90'
  };
  
  return (
    <div className={`${sizes[type]} ${colors[type]} rounded-t-sm relative shadow-lg`}>
      <div className="absolute bottom-0 left-1 right-1 h-2 flex">
        {Array.from({ length: type === 'erard' ? 12 : type === 'broadwood' ? 8 : 6 }).map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 ${i % 2 === 0 ? 'bg-white/90' : 'bg-gray-800/80'} ${isPlaying && i % 3 === 0 ? 'animate-pulse' : ''}`} 
          />
        ))}
      </div>
      {type === 'erard' && (
        <div className="absolute -right-2 top-0 bottom-2 w-8 bg-gray-900/95 dark:bg-gray-800/90 rounded-r-full" />
      )}
      {isPlaying && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-0.5">
          <Music className="w-2 h-2 text-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <Music className="w-2 h-2 text-primary animate-bounce" style={{ animationDelay: '200ms' }} />
          <Music className="w-2 h-2 text-primary animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
      )}
    </div>
  );
}

function Composer({ name, isComposing }: { name: string; isComposing: boolean }) {
  return (
    <div className="flex flex-col items-center mt-1">
      <div className="w-6 h-6 bg-amber-200 dark:bg-amber-300 rounded-full border-2 border-amber-900/50 relative">
        <div className="absolute top-1 left-1 w-1 h-1 bg-gray-800 rounded-full" />
        <div className="absolute top-1 right-1 w-1 h-1 bg-gray-800 rounded-full" />
        {isComposing && (
          <div className="absolute -right-2 -top-3">
            <Lightbulb className="w-3 h-3 text-yellow-500 animate-pulse" />
          </div>
        )}
      </div>
      <div className="w-8 h-6 bg-gray-800 dark:bg-gray-700 rounded-t-sm -mt-1" />
      <span className="text-[8px] text-muted-foreground mt-1 font-serif truncate max-w-[60px]">{name}</span>
    </div>
  );
}

function Desk() {
  return (
    <div className="w-14 h-8 bg-amber-800/70 dark:bg-amber-700/60 rounded-t-sm relative">
      <div className="absolute top-1 left-1 right-1 h-3 bg-white/80 rounded-sm" />
      <div className="absolute top-1.5 left-2 w-2 h-2 bg-gray-400/50 rounded-full" />
      <div className="absolute bottom-0 left-1 w-1 h-2 bg-amber-900/80" />
      <div className="absolute bottom-0 right-1 w-1 h-2 bg-amber-900/80" />
    </div>
  );
}

function Staff({ role }: { role: 'copyist' | 'assistant' }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-4 h-4 bg-amber-100 dark:bg-amber-200 rounded-full border border-amber-900/30" />
      <div className="w-5 h-4 bg-gray-600 dark:bg-gray-500 rounded-t-sm -mt-0.5" />
      <span className="text-[6px] text-muted-foreground capitalize">{role}</span>
    </div>
  );
}
