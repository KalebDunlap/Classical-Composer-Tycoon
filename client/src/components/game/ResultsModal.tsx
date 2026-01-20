import { CompletedWork, formatMoney, COMPOSITION_FORMS, STYLES, VENUES } from '@/lib/gameTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Music, 
  Coins, 
  Star, 
  Quote,
  TrendingUp,
  TrendingDown,
  Info,
  PartyPopper
} from 'lucide-react';

interface ResultsModalProps {
  result: CompletedWork | null;
  onClose: () => void;
}

export function ResultsModal({ result, onClose }: ResultsModalProps) {
  if (!result) return null;
  
  const formData = COMPOSITION_FORMS[result.form];
  const styleData = STYLES[result.style];
  const venueData = VENUES[result.venue];
  
  const isSuccess = result.quality >= 60;
  const isMasterpiece = result.quality >= 85;

  return (
    <Dialog open={!!result} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`
              p-4 rounded-full
              ${isMasterpiece ? 'bg-amber-500/20' : isSuccess ? 'bg-primary/20' : 'bg-muted'}
            `}>
              {isMasterpiece ? (
                <PartyPopper className="h-10 w-10 text-amber-500" />
              ) : (
                <Music className="h-10 w-10 text-primary" />
              )}
            </div>
          </div>
          <DialogTitle className="font-serif text-2xl">
            {result.title}
          </DialogTitle>
          <p className="text-muted-foreground">
            {formData.name} · {styleData.name} · {venueData.name}
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card className="border-2 bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 text-primary/50 flex-shrink-0 mt-1" />
                <blockquote className="font-serif italic text-lg leading-relaxed">
                  {result.review}
                </blockquote>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              icon={<Star className="h-6 w-6" />}
              label="Quality Score"
              value={result.quality}
              suffix="/100"
              className={isMasterpiece ? 'border-amber-500/50' : isSuccess ? 'border-primary/50' : ''}
            />
            <ResultCard
              icon={<Coins className="h-6 w-6" />}
              label="Earnings"
              value={`+${result.earnings}`}
              suffix=" Th."
              positive
            />
            <ResultCard
              icon={<Star className="h-6 w-6" />}
              label="Reputation"
              value={`+${result.reputationGained}`}
              positive
            />
            <ResultCard
              icon={<TrendingUp className="h-6 w-6" />}
              label="Works Completed"
              value="1"
              suffix=" more"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Score Breakdown
              </h4>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>These factors combined to determine your final quality score.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <FactorCard label="Base Quality" value={result.factors.baseQuality} description="From composition work" />
              <FactorCard label="Skill Bonus" value={result.factors.skillBonus} description="Your abilities" />
              <FactorCard label="Trend Match" value={result.factors.trendAlignment} description="Public taste alignment" />
              <FactorCard label="Venue Fit" value={result.factors.venueMatch} description="Venue appropriateness" />
              <FactorCard label="Musicians" value={result.factors.musicianQuality} description="Performer quality" />
              <FactorCard label="Patron" value={result.factors.patronBonus} description="Dedication bonus" />
            </div>
          </div>
          
          {result.dedicatedTo && (
            <p className="text-sm text-center text-muted-foreground">
              Dedicated to {result.dedicatedTo}
            </p>
          )}
          
          <Button 
            className="w-full" 
            size="lg" 
            onClick={onClose}
            data-testid="button-close-results"
          >
            {isMasterpiece ? 'Celebrate!' : isSuccess ? 'Continue' : 'Carry On'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  positive?: boolean;
  className?: string;
}

function ResultCard({ icon, label, value, suffix = '', positive, className = '' }: ResultCardProps) {
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={positive ? 'text-green-600 dark:text-green-400' : 'text-primary'}>
          {icon}
        </div>
        <div>
          <p className={`text-2xl font-mono font-bold ${positive ? 'text-green-600 dark:text-green-400' : ''}`}>
            {value}{suffix}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface FactorCardProps {
  label: string;
  value: number;
  description: string;
}

function FactorCard({ label, value, description }: FactorCardProps) {
  const isPositive = value >= 0;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`
          p-3 rounded-lg text-center cursor-help
          ${isPositive 
            ? 'bg-green-500/10 border border-green-500/20' 
            : 'bg-red-500/10 border border-red-500/20'
          }
        `}>
          <div className="flex items-center justify-center gap-1 mb-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
            )}
            <span className={`font-mono font-bold ${
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isPositive ? '+' : ''}{value}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
