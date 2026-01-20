import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { hasSavedGame, resetGame } from '@/lib/gameState';
import { Music, BookOpen, Trash2 } from 'lucide-react';

interface StartScreenProps {
  onNewGame: (composerName: string) => void;
  onLoadGame: () => void;
}

export function StartScreen({ onNewGame, onLoadGame }: StartScreenProps) {
  const [showNameInput, setShowNameInput] = useState(false);
  const [composerName, setComposerName] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const hasSave = hasSavedGame();

  const handleNewGame = () => {
    if (composerName.trim()) {
      onNewGame(composerName.trim());
    }
  };

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Music className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="font-serif text-3xl tracking-tight">
            Classical Composer Tycoon
          </CardTitle>
          <CardDescription className="text-base italic font-serif">
            Build your legacy in 19th-century Europe
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!showNameInput ? (
            <>
              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowNameInput(true)}
                data-testid="button-new-game"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                New Game
              </Button>
              
              {hasSave && (
                <Button
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  onClick={onLoadGame}
                  data-testid="button-load-game"
                >
                  Continue Game
                </Button>
              )}
              
              {hasSave && !showResetConfirm && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowResetConfirm(true)}
                  data-testid="button-reset-show"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset Progress
                </Button>
              )}
              
              {showResetConfirm && (
                <div className="space-y-2 p-4 border rounded-md bg-destructive/5">
                  <p className="text-sm text-muted-foreground text-center">
                    Are you certain? All progress will be lost.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleReset}
                      data-testid="button-reset-confirm"
                    >
                      Yes, Reset
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowResetConfirm(false)}
                      data-testid="button-reset-cancel"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="composer-name" className="font-serif">
                  Your Name, Maestro
                </Label>
                <Input
                  id="composer-name"
                  placeholder="e.g., Ludwig van Beethoven"
                  value={composerName}
                  onChange={(e) => setComposerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewGame()}
                  className="font-serif"
                  autoFocus
                  data-testid="input-composer-name"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleNewGame}
                  disabled={!composerName.trim()}
                  data-testid="button-start-game"
                >
                  Begin Journey
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNameInput(false)}
                  data-testid="button-cancel-new-game"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground text-center pt-4 font-serif italic">
            "Music is the one incorporeal entrance into the higher world of knowledge."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
