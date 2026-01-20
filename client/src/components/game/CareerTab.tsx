import { GameState } from '@/lib/gameTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Music2, 
  Layers, 
  Zap, 
  Combine, 
  Clock, 
  Users,
  Trophy,
  Star,
  Target,
  Award
} from 'lucide-react';

interface CareerTabProps {
  gameState: GameState;
}

const skillInfo: Record<string, { icon: React.ReactNode; description: string }> = {
  melody: {
    icon: <Music2 className="h-5 w-5" />,
    description: 'Your ability to craft memorable themes and tunes'
  },
  harmony: {
    icon: <Layers className="h-5 w-5" />,
    description: 'Understanding of chord progressions and voice leading'
  },
  orchestration: {
    icon: <Combine className="h-5 w-5" />,
    description: 'Skill in writing effectively for instruments'
  },
  form: {
    icon: <Target className="h-5 w-5" />,
    description: 'Mastery of musical structures and development'
  },
  productivity: {
    icon: <Clock className="h-5 w-5" />,
    description: 'Efficiency in completing composition phases'
  },
  social: {
    icon: <Users className="h-5 w-5" />,
    description: 'Ability to network and maintain relationships'
  }
};

const milestoneInfo: Record<string, { icon: React.ReactNode; description: string }> = {
  first_work: { icon: <Music2 className="h-4 w-4" />, description: 'Complete your first premiere' },
  reputation_25: { icon: <Star className="h-4 w-4" />, description: 'Reach 25 reputation' },
  reputation_50: { icon: <Star className="h-4 w-4" />, description: 'Reach 50 reputation' },
  reputation_100: { icon: <Trophy className="h-4 w-4" />, description: 'Reach 100 reputation' },
  five_works: { icon: <Award className="h-4 w-4" />, description: 'Complete 5 works' },
  symphony_premiere: { icon: <Zap className="h-4 w-4" />, description: 'Premiere a symphony' },
  wealthy: { icon: <Star className="h-4 w-4" />, description: 'Accumulate 1000 Thalers' },
  patron_favor: { icon: <Users className="h-4 w-4" />, description: 'Gain a patron\'s favor' }
};

const allMilestones = [
  { id: 'first_work', name: 'First Performance' },
  { id: 'reputation_25', name: 'Rising Talent' },
  { id: 'reputation_50', name: 'Established Composer' },
  { id: 'reputation_100', name: 'Minor Famous Composer' },
  { id: 'five_works', name: 'Prolific Artist' },
  { id: 'symphony_premiere', name: 'Symphonist' },
  { id: 'wealthy', name: 'Comfortable Living' },
  { id: 'patron_favor', name: 'Patron\'s Favorite' }
];

export function CareerTab({ gameState }: CareerTabProps) {
  const { skills, patrons, completedWorks, achievedMilestones } = gameState;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2">Career Overview</h2>
        <p className="text-muted-foreground">
          Track your skills, achievements, and relationships.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
            <CardDescription>
              Your compositional and social abilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(skills).map(([key, value]) => {
              const info = skillInfo[key];
              const level = Math.floor(value / 20) + 1;
              const levelLabels = ['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master'];
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{info.icon}</span>
                      <div>
                        <p className="font-medium capitalize">{key}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold">{value}</p>
                      <Badge variant="secondary" className="text-xs">
                        {levelLabels[Math.min(level - 1, 4)]}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Achievements
              </CardTitle>
              <CardDescription>
                {achievedMilestones.length} of {allMilestones.length} unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {allMilestones.map(milestone => {
                  const achieved = achievedMilestones.includes(milestone.id);
                  const info = milestoneInfo[milestone.id];
                  
                  return (
                    <div
                      key={milestone.id}
                      className={`
                        p-3 rounded-lg border text-center
                        ${achieved 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-muted/30 opacity-50'
                        }
                      `}
                      data-testid={`achievement-${milestone.id}`}
                    >
                      <div className={`flex justify-center mb-2 ${achieved ? 'text-primary' : 'text-muted-foreground'}`}>
                        {info?.icon || <Star className="h-4 w-4" />}
                      </div>
                      <p className="text-xs font-medium">{milestone.name}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Patrons
              </CardTitle>
              <CardDescription>
                Your noble benefactors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patrons.map(patron => (
                <div key={patron.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium font-serif">{patron.name}</p>
                      <p className="text-xs text-muted-foreground">{patron.title}</p>
                    </div>
                    <Badge variant={patron.relationship > 30 ? "default" : "secondary"}>
                      {getRelationshipLabel(patron.relationship)}
                    </Badge>
                  </div>
                  <Progress value={patron.relationship} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">
                    Prefers: {patron.preferredForms.map(f => f.replace('_', ' ')).join(', ')}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Works Completed" value={completedWorks.length} />
            <StatBox 
              label="Best Quality" 
              value={completedWorks.length > 0 
                ? Math.max(...completedWorks.map(w => w.quality))
                : 0
              } 
            />
            <StatBox 
              label="Total Earnings" 
              value={completedWorks.reduce((sum, w) => sum + w.earnings, 0)}
              suffix=" Th."
            />
            <StatBox 
              label="Years Active" 
              value={gameState.currentDate.year - 1820}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatBox({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="text-center p-4 rounded-lg bg-muted/30">
      <p className="text-3xl font-mono font-bold">{value}{suffix}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function getRelationshipLabel(value: number): string {
  if (value < 10) return 'Stranger';
  if (value < 25) return 'Acquaintance';
  if (value < 50) return 'Friendly';
  if (value < 75) return 'Favored';
  return 'Devoted';
}
