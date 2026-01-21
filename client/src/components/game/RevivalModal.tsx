import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RevivalOpportunity, CompletedWork, formatMoney, COMPOSITION_FORMS } from '@/lib/gameTypes';
import { Sparkles, RefreshCw, X, Music } from 'lucide-react';

interface RevivalModalProps {
  revival: RevivalOpportunity;
  originalWork: CompletedWork | undefined;
  onAccept: () => void;
  onDecline: () => void;
  playerMoney: number;
  playerInspiration: number;
}

const REVIVAL_COST = 50;
const REVIVAL_INSPIRATION_COST = 20;

export function RevivalModal({ 
  revival, 
  originalWork, 
  onAccept, 
  onDecline, 
  playerMoney, 
  playerInspiration 
}: RevivalModalProps) {
  const canAfford = playerMoney >= REVIVAL_COST && playerInspiration >= REVIVAL_INSPIRATION_COST;
  
  const formName = originalWork ? COMPOSITION_FORMS[originalWork.form].name : 'work';
  
  return (
    <Dialog open={true} onOpenChange={() => onDecline()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-amber-500/10">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <DialogTitle className="font-serif text-xl">Revival Opportunity!</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            A publisher has approached you about reviving an older work that has caught renewed public interest.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-serif font-semibold">{revival.workTitle}</h4>
                <p className="text-sm text-muted-foreground">{formName}</p>
                <Badge variant="secondary" className="mt-2">
                  Original Quality: {revival.originalQuality}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Revival Requirements:</p>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={playerMoney >= REVIVAL_COST ? "outline" : "destructive"}
              >
                {formatMoney(REVIVAL_COST)}
              </Badge>
              <Badge 
                variant={playerInspiration >= REVIVAL_INSPIRATION_COST ? "outline" : "destructive"}
              >
                {REVIVAL_INSPIRATION_COST} Inspiration
              </Badge>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>If you accept, you will revise and re-premiere this work with:</p>
            <ul className="list-disc list-inside pl-2 space-y-0.5">
              <li>Quality bonus from your improved skills</li>
              <li>Fresh popularity surge from the revival</li>
              <li>New publisher royalties stream</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDecline} data-testid="button-decline-revival">
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
          <Button 
            onClick={onAccept} 
            disabled={!canAfford}
            data-testid="button-accept-revival"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Accept Revival
          </Button>
        </DialogFooter>
        
        {!canAfford && (
          <p className="text-xs text-destructive text-center">
            Insufficient resources for revival
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { REVIVAL_COST, REVIVAL_INSPIRATION_COST };
