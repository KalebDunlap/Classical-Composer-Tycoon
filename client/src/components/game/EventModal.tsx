import { GameEvent, EventChoice, EventEffect } from '@/lib/gameTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Coins, Star, Heart, Sparkles, Users, Zap, AlertCircle } from 'lucide-react';

interface EventModalProps {
  event: GameEvent | null;
  onChoice: (choice: EventChoice) => void;
}

const effectIcons: Record<EventEffect['type'], React.ReactNode> = {
  money: <Coins className="h-3 w-3" />,
  reputation: <Star className="h-3 w-3" />,
  health: <Heart className="h-3 w-3" />,
  inspiration: <Sparkles className="h-3 w-3" />,
  connection: <Users className="h-3 w-3" />,
  skill: <Zap className="h-3 w-3" />,
  special: <AlertCircle className="h-3 w-3" />
};

export function EventModal({ event, onChoice }: EventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{event.title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2 font-serif">
            {event.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {event.choices.map((choice, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 px-4 text-left justify-start flex-col items-start gap-2"
                  onClick={() => onChoice(choice)}
                  data-testid={`button-event-choice-${index}`}
                >
                  <span className="font-medium">{choice.text}</span>
                  <div className="flex flex-wrap gap-2">
                    {choice.effects.map((effect, idx) => (
                      <EffectBadge key={idx} effect={effect} />
                    ))}
                  </div>
                </Button>
              </TooltipTrigger>
              {choice.tooltip && (
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm">{choice.tooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EffectBadge({ effect }: { effect: EventEffect }) {
  const isPositive = effect.value > 0;
  
  return (
    <Badge 
      variant="outline" 
      className={`
        text-xs gap-1
        ${isPositive 
          ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30' 
          : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
        }
      `}
    >
      {effectIcons[effect.type]}
      <span>{effect.description}</span>
    </Badge>
  );
}
