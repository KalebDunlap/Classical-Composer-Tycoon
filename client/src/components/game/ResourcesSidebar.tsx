import { GameState, formatDate, formatMoney } from '@/lib/gameTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Coins, Star, Sparkles, Heart, Users, TrendingUp, TrendingDown, BookOpen } from 'lucide-react';

interface ResourcesSidebarProps {
  gameState: GameState;
}

const trendLabels: Record<string, string> = {
  virtuosity: 'Virtuosity',
  lyricism: 'Lyricism',
  sacred: 'Sacred',
  secular: 'Secular',
  nationalist: 'Nationalist',
  cosmopolitan: 'Cosmopolitan'
};

export function ResourcesSidebar({ gameState }: ResourcesSidebarProps) {
  const { stats, currentDate, tastes, composerName } = gameState;
  
  return (
    <div className="w-72 flex-shrink-0 border-r bg-sidebar p-4 overflow-y-auto">
      <div className="space-y-4">
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg text-center">
              {formatDate(currentDate)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground text-center font-serif italic">
              {composerName}
            </p>
          </CardContent>
        </Card>
        
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
            Resources
          </h3>
          
          <StatRow
            icon={<Coins className="h-4 w-4" />}
            label="Money"
            value={formatMoney(stats.money)}
            color="text-amber-600 dark:text-amber-400"
          />
          
          {gameState.weeklyPublisherIncome > 0 && (
            <StatRow
              icon={<BookOpen className="h-4 w-4" />}
              label="Weekly Royalties"
              value={`+${gameState.weeklyPublisherIncome} Th./wk`}
              color="text-emerald-600 dark:text-emerald-400"
              subtext="From published works"
            />
          )}
          
          <StatRow
            icon={<Star className="h-4 w-4" />}
            label="Reputation"
            value={stats.reputation.toString()}
            color="text-purple-600 dark:text-purple-400"
            subtext={getReputationTitle(stats.reputation)}
          />
          
          <StatRow
            icon={<Sparkles className="h-4 w-4" />}
            label="Inspiration"
            value={stats.inspiration.toString()}
            color="text-blue-600 dark:text-blue-400"
            showProgress
            progressValue={stats.inspiration}
          />
          
          <StatRow
            icon={<Heart className="h-4 w-4" />}
            label="Health"
            value={`${stats.health}/${stats.maxHealth}`}
            color="text-red-600 dark:text-red-400"
            showProgress
            progressValue={(stats.health / stats.maxHealth) * 100}
            progressColor={stats.health < 30 ? 'bg-red-500' : undefined}
          />
          
          <StatRow
            icon={<Users className="h-4 w-4" />}
            label="Connections"
            value={stats.connections.toString()}
            color="text-green-600 dark:text-green-400"
          />
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
            Public Taste
          </h3>
          
          <div className="flex flex-wrap gap-1.5">
            {tastes.current.map(trend => (
              <Badge 
                key={trend} 
                variant="secondary"
                className="font-serif text-xs"
              >
                {trendLabels[trend]}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {tastes.intensity > 50 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>Trend strength: {tastes.intensity}%</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
            Skills
          </h3>
          
          <SkillBar label="Melody" value={gameState.skills.melody} />
          <SkillBar label="Harmony" value={gameState.skills.harmony} />
          <SkillBar label="Orchestration" value={gameState.skills.orchestration} />
          <SkillBar label="Form" value={gameState.skills.form} />
          <SkillBar label="Productivity" value={gameState.skills.productivity} />
          <SkillBar label="Social" value={gameState.skills.social} />
        </div>
      </div>
    </div>
  );
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  subtext?: string;
  showProgress?: boolean;
  progressValue?: number;
  progressColor?: string;
}

function StatRow({ icon, label, value, color, subtext, showProgress, progressValue, progressColor }: StatRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-mono font-semibold">{value}</span>
      </div>
      {subtext && (
        <p className="text-xs text-muted-foreground font-serif italic pl-6">{subtext}</p>
      )}
      {showProgress && progressValue !== undefined && (
        <Progress 
          value={progressValue} 
          className="h-1.5"
        />
      )}
    </div>
  );
}

interface SkillBarProps {
  label: string;
  value: number;
}

function SkillBar({ label, value }: SkillBarProps) {
  const maxSkill = 100;
  const percentage = (value / maxSkill) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <Progress value={percentage} className="h-1" />
    </div>
  );
}

function getReputationTitle(reputation: number): string {
  if (reputation < 10) return 'Unknown';
  if (reputation < 25) return 'Aspiring';
  if (reputation < 50) return 'Emerging';
  if (reputation < 75) return 'Established';
  if (reputation < 100) return 'Renowned';
  if (reputation < 150) return 'Celebrated';
  return 'Legendary';
}
