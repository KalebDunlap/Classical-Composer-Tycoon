import { CompletedWork, formatDate, formatMoney, COMPOSITION_FORMS, STYLES, VENUES } from '@/lib/gameTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Music, 
  Calendar, 
  Star, 
  Coins,
  Quote,
  Theater,
  TrendingUp,
  Info
} from 'lucide-react';

interface HistoryTabProps {
  works: CompletedWork[];
}

export function HistoryTab({ works }: HistoryTabProps) {
  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Music className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="font-serif text-xl font-semibold mb-2">No Works Yet</h2>
        <p className="text-muted-foreground max-w-md">
          Your catalogue awaits. Complete your first composition to see it recorded here.
        </p>
      </div>
    );
  }

  const sortedWorks = [...works].sort((a, b) => {
    const dateA = a.premiereDate.year * 100 + a.premiereDate.month;
    const dateB = b.premiereDate.year * 100 + b.premiereDate.month;
    return dateB - dateA;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2">Catalogue of Works</h2>
        <p className="text-muted-foreground">
          {works.length} work{works.length !== 1 ? 's' : ''} premiered
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard 
          icon={<Music className="h-5 w-5" />}
          label="Total Works"
          value={works.length}
        />
        <StatCard 
          icon={<Star className="h-5 w-5" />}
          label="Average Quality"
          value={Math.round(works.reduce((s, w) => s + w.quality, 0) / works.length)}
        />
        <StatCard 
          icon={<Coins className="h-5 w-5" />}
          label="Total Earnings"
          value={works.reduce((s, w) => s + w.earnings, 0)}
          suffix=" Th."
        />
      </div>
      
      <ScrollArea className="h-[500px]">
        <Accordion type="single" collapsible className="space-y-3">
          {sortedWorks.map((work, index) => (
            <AccordionItem 
              key={work.id} 
              value={work.id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-serif font-bold text-primary">
                      {works.length - index}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold truncate">{work.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {COMPOSITION_FORMS[work.form].name} · {formatDate(work.premiereDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <QualityBadge quality={work.quality} />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4 pt-2">
                  <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                    <Quote className="h-4 w-4 mb-2 text-primary/50" />
                    {work.review}
                  </blockquote>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Details</p>
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Style:</span> {STYLES[work.style].name}</p>
                        <p><span className="text-muted-foreground">Venue:</span> {VENUES[work.venue].name}</p>
                        {work.dedicatedTo && (
                          <p><span className="text-muted-foreground">Dedicated to:</span> {work.dedicatedTo}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Results</p>
                      <div className="text-sm space-y-1">
                        <p className="flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          <span className="text-green-600 dark:text-green-400">
                            +{formatMoney(work.earnings)}
                          </span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span className="text-purple-600 dark:text-purple-400">
                            +{work.reputationGained} Reputation
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Quality Breakdown</p>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Factors that influenced the final quality score
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <FactorBadge label="Base" value={work.factors.baseQuality} />
                      <FactorBadge label="Skills" value={work.factors.skillBonus} />
                      <FactorBadge label="Trends" value={work.factors.trendAlignment} />
                      <FactorBadge label="Venue" value={work.factors.venueMatch} />
                      <FactorBadge label="Musicians" value={work.factors.musicianQuality} />
                      <FactorBadge label="Patron" value={work.factors.patronBonus} />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}

function StatCard({ icon, label, value, suffix = '' }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  suffix?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div>
          <p className="text-2xl font-mono font-bold">{value}{suffix}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QualityBadge({ quality }: { quality: number }) {
  let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
  let label = 'Average';
  
  if (quality >= 80) {
    variant = 'default';
    label = 'Excellent';
  } else if (quality >= 60) {
    label = 'Good';
  } else if (quality < 40) {
    variant = 'destructive';
    label = 'Poor';
  }
  
  return (
    <Badge variant={variant} className="font-mono">
      {quality} - {label}
    </Badge>
  );
}

function FactorBadge({ label, value }: { label: string; value: number }) {
  const isPositive = value >= 0;
  
  return (
    <div className={`
      px-2 py-1 rounded text-center
      ${isPositive ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'}
    `}>
      <span className="font-mono">{isPositive ? '+' : ''}{value}</span>
      <span className="block text-muted-foreground">{label}</span>
    </div>
  );
}
