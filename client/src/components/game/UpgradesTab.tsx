import { GameState, Upgrade, formatMoney } from '@/lib/gameTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Home, 
  Piano, 
  Users, 
  Network, 
  Check, 
  Lock,
  Coins,
  ArrowUp
} from 'lucide-react';

interface UpgradesTabProps {
  gameState: GameState;
  onPurchaseUpgrade: (upgradeId: string) => void;
}

const categoryInfo: Record<string, { icon: React.ReactNode; label: string }> = {
  living: { icon: <Home className="h-5 w-5" />, label: 'Living Quarters' },
  instrument: { icon: <Piano className="h-5 w-5" />, label: 'Instruments' },
  staff: { icon: <Users className="h-5 w-5" />, label: 'Staff' },
  connections: { icon: <Network className="h-5 w-5" />, label: 'Connections' }
};

export function UpgradesTab({ gameState, onPurchaseUpgrade }: UpgradesTabProps) {
  const { stats, upgrades } = gameState;
  
  const groupedUpgrades = upgrades.reduce((acc, upgrade) => {
    if (!acc[upgrade.category]) {
      acc[upgrade.category] = [];
    }
    acc[upgrade.category].push(upgrade);
    return acc;
  }, {} as Record<string, Upgrade[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-2">Improvements</h2>
          <p className="text-muted-foreground">
            Invest in your career with lasting upgrades.
          </p>
        </div>
        <Card className="bg-card/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="font-mono font-semibold">{formatMoney(stats.money)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {Object.entries(groupedUpgrades).map(([category, categoryUpgrades]) => {
        const info = categoryInfo[category];
        
        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-primary">{info.icon}</span>
              <h3 className="font-semibold">{info.label}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryUpgrades.map(upgrade => (
                <UpgradeCard
                  key={upgrade.id}
                  upgrade={upgrade}
                  canAfford={stats.money >= upgrade.cost}
                  canUnlock={stats.reputation >= upgrade.requiredReputation}
                  onPurchase={() => onPurchaseUpgrade(upgrade.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface UpgradeCardProps {
  upgrade: Upgrade;
  canAfford: boolean;
  canUnlock: boolean;
  onPurchase: () => void;
}

function UpgradeCard({ upgrade, canAfford, canUnlock, onPurchase }: UpgradeCardProps) {
  const isPurchased = upgrade.purchased;
  const isAvailable = canAfford && canUnlock && !isPurchased;
  
  return (
    <Card className={`
      transition-all
      ${isPurchased ? 'bg-primary/5 border-primary/30' : ''}
      ${!canUnlock && !isPurchased ? 'opacity-60' : ''}
    `}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              {isPurchased && <Check className="h-4 w-4 text-primary" />}
              {!canUnlock && !isPurchased && <Lock className="h-4 w-4 text-muted-foreground" />}
              {upgrade.name}
            </CardTitle>
            <CardDescription>{upgrade.description}</CardDescription>
          </div>
          <Badge variant={isPurchased ? "default" : "secondary"} className="font-mono">
            {formatMoney(upgrade.cost)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {upgrade.effects.map((effect, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger>
                <Badge variant="outline" className="text-xs gap-1">
                  <ArrowUp className="h-3 w-3" />
                  {formatEffect(effect)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {getEffectTooltip(effect)}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        {!canUnlock && !isPurchased && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Requires {upgrade.requiredReputation} reputation
          </p>
        )}
        
        {!isPurchased && (
          <Button
            className="w-full"
            variant={isAvailable ? "default" : "secondary"}
            disabled={!isAvailable}
            onClick={onPurchase}
            data-testid={`button-upgrade-${upgrade.id}`}
          >
            {!canAfford ? 'Cannot Afford' : !canUnlock ? 'Locked' : 'Purchase'}
          </Button>
        )}
        
        {isPurchased && (
          <div className="text-center text-sm text-primary font-medium">
            Purchased
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatEffect(effect: Upgrade['effects'][0]): string {
  switch (effect.type) {
    case 'stat_boost':
      return `+${effect.value} ${effect.target?.replace(/([A-Z])/g, ' $1').trim()}`;
    case 'skill_boost':
      return `+${effect.value} ${effect.target}`;
    case 'multiplier':
      return `${Math.round((effect.value - 1) * 100)}% ${effect.target}`;
    default:
      return `+${effect.value}`;
  }
}

function getEffectTooltip(effect: Upgrade['effects'][0]): string {
  switch (effect.type) {
    case 'stat_boost':
      return `Permanently increases your ${effect.target} by ${effect.value}`;
    case 'skill_boost':
      return `Permanently increases your ${effect.target} skill by ${effect.value}`;
    case 'multiplier':
      return `Multiplies ${effect.target} by ${effect.value}x`;
    default:
      return 'Special effect';
  }
}
