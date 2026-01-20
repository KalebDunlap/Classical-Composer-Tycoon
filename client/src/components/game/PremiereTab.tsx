import { useState } from 'react';
import { 
  GameState, 
  VenueType,
  VENUES,
  INSTRUMENTATIONS,
  MUSICIAN_COSTS,
  formatMoney,
  PremiereSetup,
  WorkInProgress
} from '@/lib/gameTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Theater, 
  Users, 
  Star, 
  Lock, 
  Check,
  Megaphone,
  Heart,
  Coins
} from 'lucide-react';

interface PremiereTabProps {
  gameState: GameState;
  readyWork: WorkInProgress | null;
  onSchedulePremiere: (setup: PremiereSetup) => void;
}

export function PremiereTab({ gameState, readyWork, onSchedulePremiere }: PremiereTabProps) {
  const [selectedVenue, setSelectedVenue] = useState<VenueType>('salon');
  const [musicianQuality, setMusicianQuality] = useState<PremiereSetup['musicianQuality']>('competent');
  const [dedicatedTo, setDedicatedTo] = useState<string>('');
  const [advertising, setAdvertising] = useState(0);
  
  const { stats, patrons } = gameState;
  
  if (!readyWork) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Theater className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="font-serif text-xl font-semibold mb-2">No Work Ready</h2>
        <p className="text-muted-foreground max-w-md">
          Complete a composition first, then return here to arrange its premiere performance.
        </p>
      </div>
    );
  }
  
  const venue = VENUES[selectedVenue];
  const instrumentation = INSTRUMENTATIONS[readyWork.instrumentation];
  const musicianCost = MUSICIAN_COSTS[musicianQuality];
  
  const totalCost = venue.cost + instrumentation.cost + musicianCost.cost + advertising;
  const canAfford = stats.money >= totalCost;
  
  const handlePremiere = () => {
    if (!canAfford) return;
    
    onSchedulePremiere({
      work: readyWork,
      venue: selectedVenue,
      musicianQuality,
      dedicatedTo: dedicatedTo || undefined,
      advertisingSpent: advertising
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2">Schedule Premiere</h2>
        <p className="text-muted-foreground">
          Arrange the first performance of "{readyWork.title}"
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Theater className="h-5 w-5" />
                Select Venue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(VENUES).map(([key, v]) => {
                const venueKey = key as VenueType;
                const isUnlocked = stats.reputation >= v.requiredReputation;
                const isSelected = selectedVenue === venueKey;
                const isIdeal = v.bestFor.includes(readyWork.form);
                
                return (
                  <div
                    key={key}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${isSelected ? 'ring-2 ring-primary border-primary bg-primary/5' : ''}
                      ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'hover-elevate'}
                    `}
                    onClick={() => isUnlocked && setSelectedVenue(venueKey)}
                    data-testid={`venue-${key}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                        {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        <span className="font-medium">{v.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isIdeal && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                            Ideal
                          </Badge>
                        )}
                        <Badge variant="secondary">{formatMoney(v.cost)}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {v.capacity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Prestige: {v.prestige}
                      </span>
                    </div>
                    {!isUnlocked && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Requires {v.requiredReputation} reputation
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Musicians
              </CardTitle>
              <CardDescription>
                Higher quality musicians improve the performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={musicianQuality} 
                onValueChange={(v) => setMusicianQuality(v as PremiereSetup['musicianQuality'])}
                className="space-y-3"
              >
                {(Object.entries(MUSICIAN_COSTS) as [PremiereSetup['musicianQuality'], typeof MUSICIAN_COSTS['amateur']][]).map(([quality, data]) => (
                  <div key={quality} className="flex items-center space-x-3">
                    <RadioGroupItem value={quality} id={quality} data-testid={`musician-${quality}`} />
                    <Label htmlFor={quality} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="capitalize">{quality}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Math.round((data.multiplier - 1) * 100)}% bonus
                          </span>
                          <Badge variant="secondary">{formatMoney(data.cost)}</Badge>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Dedication
              </CardTitle>
              <CardDescription>
                Dedicate this work to a patron for their favor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={dedicatedTo || "none"} onValueChange={(v) => setDedicatedTo(v === "none" ? "" : v)}>
                <SelectTrigger data-testid="select-patron">
                  <SelectValue placeholder="No dedication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No dedication</SelectItem>
                  {patrons.map(patron => (
                    <SelectItem key={patron.id} value={patron.id}>
                      {patron.name}, {patron.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {dedicatedTo && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  +10 quality bonus from patron's appreciation
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Advertising
              </CardTitle>
              <CardDescription>
                Spend money to promote the performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Investment</span>
                <Badge variant="outline" className="font-mono">
                  {formatMoney(advertising)}
                </Badge>
              </div>
              <Slider
                value={[advertising]}
                onValueChange={([v]) => setAdvertising(v)}
                max={100}
                step={10}
                data-testid="slider-advertising"
              />
              <p className="text-xs text-muted-foreground">
                Each 10 Thalers adds ~15 to potential earnings
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Cost Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Venue rental</span>
                  <span className="font-mono">{formatMoney(venue.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Instrumentation</span>
                  <span className="font-mono">{formatMoney(instrumentation.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Musicians ({musicianQuality})</span>
                  <span className="font-mono">{formatMoney(musicianCost.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Advertising</span>
                  <span className="font-mono">{formatMoney(advertising)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className={`font-mono ${!canAfford ? 'text-destructive' : ''}`}>
                    {formatMoney(totalCost)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your funds</span>
                <span className="font-mono">{formatMoney(stats.money)}</span>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!canAfford}
                    onClick={handlePremiere}
                    data-testid="button-premiere"
                  >
                    <Theater className="mr-2 h-5 w-5" />
                    Schedule Premiere
                  </Button>
                </TooltipTrigger>
                {!canAfford && (
                  <TooltipContent>
                    Insufficient funds
                  </TooltipContent>
                )}
              </Tooltip>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
