import { useState } from 'react';
import { 
  GameState, 
  CompositionForm, 
  CompositionStyle, 
  Instrumentation,
  WorkInProgress,
  COMPOSITION_FORMS,
  STYLES,
  INSTRUMENTATIONS,
  formatMoney
} from '@/lib/gameTypes';
import { generateWorkTitle } from '@/lib/compositionEngine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Music, 
  Clock, 
  Lock, 
  Check, 
  Pen, 
  Layers, 
  Users, 
  RefreshCw,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

interface ComposeTabProps {
  gameState: GameState;
  onStartComposition: (work: WorkInProgress) => void;
  onWorkWeek: (phases: WorkInProgress['phases']) => void;
  onFinishComposition: () => void;
}

export function ComposeTab({ 
  gameState, 
  onStartComposition, 
  onWorkWeek,
  onFinishComposition
}: ComposeTabProps) {
  const [selectedForm, setSelectedForm] = useState<CompositionForm | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CompositionStyle>('early_romantic');
  const [selectedInstrumentation, setSelectedInstrumentation] = useState<Instrumentation>('solo_piano');
  
  const { stats, workInProgress, completedWorks } = gameState;

  if (workInProgress) {
    return (
      <WorkInProgressView 
        work={workInProgress}
        stats={stats}
        skills={gameState.skills}
        onWorkWeek={onWorkWeek}
        onFinishComposition={onFinishComposition}
      />
    );
  }

  const handleStartComposition = () => {
    if (!selectedForm) return;
    
    const formData = COMPOSITION_FORMS[selectedForm];
    const title = generateWorkTitle(selectedForm, completedWorks.length);
    
    const newWork: WorkInProgress = {
      form: selectedForm,
      style: selectedStyle,
      instrumentation: selectedInstrumentation,
      phases: {
        sketching: 0,
        orchestration: 0,
        rehearsalPrep: 0,
        revision: 0
      },
      weeksSpent: 0,
      title
    };
    
    onStartComposition(newWork);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2">Begin a New Work</h2>
        <p className="text-muted-foreground">
          Choose the form, style, and instrumentation for your next composition.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Select Form
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(COMPOSITION_FORMS).map(([key, form]) => {
            const formKey = key as CompositionForm;
            const isUnlocked = stats.reputation >= form.requiredReputation;
            const isSelected = selectedForm === formKey;
            
            return (
              <Card
                key={key}
                className={`
                  cursor-pointer transition-all
                  ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
                  ${!isUnlocked ? 'opacity-50' : 'hover-elevate'}
                `}
                onClick={() => isUnlocked && setSelectedForm(formKey)}
                data-testid={`card-form-${key}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-serif">{form.name}</CardTitle>
                    {!isUnlocked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : isSelected ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pb-3 space-y-2">
                  <p className="text-xs text-muted-foreground">{form.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {form.baseWeeks} weeks
                    </Badge>
                    <DifficultyBadge difficulty={form.difficulty} />
                  </div>
                  {!isUnlocked && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Requires {form.requiredReputation} reputation
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {selectedForm && (
        <>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Choose Style
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(STYLES).map(([key, style]) => {
                const styleKey = key as CompositionStyle;
                const isSelected = selectedStyle === styleKey;
                
                return (
                  <Card
                    key={key}
                    className={`
                      cursor-pointer transition-all hover-elevate
                      ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
                    `}
                    onClick={() => setSelectedStyle(styleKey)}
                    data-testid={`card-style-${key}`}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="font-serif font-medium">{style.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{style.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Instrumentation
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(INSTRUMENTATIONS).map(([key, inst]) => {
                const instKey = key as Instrumentation;
                const isSelected = selectedInstrumentation === instKey;
                const formBest = COMPOSITION_FORMS[selectedForm].bestInstrumentation.includes(instKey);
                
                return (
                  <Card
                    key={key}
                    className={`
                      cursor-pointer transition-all hover-elevate
                      ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
                      ${formBest ? 'border-green-500/50' : ''}
                    `}
                    onClick={() => setSelectedInstrumentation(instKey)}
                    data-testid={`card-instrumentation-${key}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{inst.name}</h4>
                        {formBest && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">
                            Ideal
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {inst.cost > 0 ? formatMoney(inst.cost) : 'No extra cost'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <div>
              <p className="font-serif font-medium">Ready to begin?</p>
              <p className="text-sm text-muted-foreground">
                Estimated time: {COMPOSITION_FORMS[selectedForm].baseWeeks} weeks
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={handleStartComposition}
              data-testid="button-start-composition"
            >
              <Music className="mr-2 h-5 w-5" />
              Begin Composing
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

interface WorkInProgressViewProps {
  work: WorkInProgress;
  stats: GameState['stats'];
  skills: GameState['skills'];
  onWorkWeek: (phases: WorkInProgress['phases']) => void;
  onFinishComposition: () => void;
}

function WorkInProgressView({ 
  work, 
  stats, 
  skills,
  onWorkWeek,
  onFinishComposition
}: WorkInProgressViewProps) {
  const formData = COMPOSITION_FORMS[work.form];
  const totalPhasePoints = work.phases.sketching + work.phases.orchestration + 
                          work.phases.rehearsalPrep + work.phases.revision;
  const progress = Math.min(100, (work.weeksSpent / formData.baseWeeks) * 100);
  
  const [weekAllocation, setWeekAllocation] = useState({
    sketching: 25,
    orchestration: 25,
    rehearsalPrep: 25,
    revision: 25
  });
  
  const handleSliderChange = (phase: keyof typeof weekAllocation, value: number) => {
    const remaining = 100 - value;
    const otherPhases = Object.keys(weekAllocation).filter(k => k !== phase) as (keyof typeof weekAllocation)[];
    const otherTotal = otherPhases.reduce((sum, k) => sum + weekAllocation[k], 0);
    
    const newAllocation = { ...weekAllocation, [phase]: value };
    
    if (otherTotal > 0) {
      const scale = remaining / otherTotal;
      otherPhases.forEach(k => {
        newAllocation[k] = Math.round(weekAllocation[k] * scale);
      });
    } else {
      const perOther = Math.floor(remaining / otherPhases.length);
      otherPhases.forEach(k => {
        newAllocation[k] = perOther;
      });
    }
    
    setWeekAllocation(newAllocation);
  };
  
  const handleWorkWeek = () => {
    const availableEnergy = stats.inspiration;
    const productivity = skills.productivity / 10;
    
    // Calculate points earned this week based on inspiration and productivity
    const pointsThisWeek = Math.max(2, Math.floor((availableEnergy / 10) * productivity));
    
    const newPhases = {
      sketching: work.phases.sketching + Math.floor(pointsThisWeek * weekAllocation.sketching / 100),
      orchestration: work.phases.orchestration + Math.floor(pointsThisWeek * weekAllocation.orchestration / 100),
      rehearsalPrep: work.phases.rehearsalPrep + Math.floor(pointsThisWeek * weekAllocation.rehearsalPrep / 100),
      revision: work.phases.revision + Math.floor(pointsThisWeek * weekAllocation.revision / 100)
    };
    
    onWorkWeek(newPhases);
  };
  
  const canFinish = work.weeksSpent >= Math.ceil(formData.baseWeeks * 0.6);
  const isRecommendedComplete = work.weeksSpent >= formData.baseWeeks;

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">{work.title}</CardTitle>
              <CardDescription className="text-base mt-1">
                {formData.name} in the {STYLES[work.style].name} style
              </CardDescription>
            </div>
            <Badge variant="secondary">
              Week {work.weeksSpent + 1} / {formData.baseWeeks}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">This Week's Focus</CardTitle>
          <CardDescription>
            Allocate your energy across composition phases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PhaseSlider
            label="Sketching"
            icon={<Pen className="h-4 w-4" />}
            value={weekAllocation.sketching}
            current={work.phases.sketching}
            onChange={(v) => handleSliderChange('sketching', v)}
            tooltip="Initial melodic and thematic ideas"
          />
          <PhaseSlider
            label="Orchestration"
            icon={<Layers className="h-4 w-4" />}
            value={weekAllocation.orchestration}
            current={work.phases.orchestration}
            onChange={(v) => handleSliderChange('orchestration', v)}
            tooltip="Arranging for instruments and voices"
          />
          <PhaseSlider
            label="Rehearsal Prep"
            icon={<Users className="h-4 w-4" />}
            value={weekAllocation.rehearsalPrep}
            current={work.phases.rehearsalPrep}
            onChange={(v) => handleSliderChange('rehearsalPrep', v)}
            tooltip="Preparing performance materials"
          />
          <PhaseSlider
            label="Revision"
            icon={<RefreshCw className="h-4 w-4" />}
            value={weekAllocation.revision}
            current={work.phases.revision}
            onChange={(v) => handleSliderChange('revision', v)}
            tooltip="Refining and polishing the work"
          />
          
          <div className="flex items-center gap-4 pt-4">
            <Button 
              className="flex-1" 
              onClick={handleWorkWeek}
              data-testid="button-work-week"
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              Work This Week
            </Button>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isRecommendedComplete ? "default" : "secondary"}
                  onClick={onFinishComposition}
                  disabled={!canFinish}
                  data-testid="button-finish-composition"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Finish Work
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!canFinish 
                  ? `Work for at least ${Math.ceil(formData.baseWeeks * 0.6)} weeks first`
                  : isRecommendedComplete 
                    ? 'Work is ready for premiere'
                    : 'Finishing early may reduce quality'
                }
              </TooltipContent>
            </Tooltip>
          </div>
          
          {!isRecommendedComplete && canFinish && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>Finishing early may affect the quality of your work.</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-mono font-bold">{work.phases.sketching}</p>
              <p className="text-xs text-muted-foreground">Sketching</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{work.phases.orchestration}</p>
              <p className="text-xs text-muted-foreground">Orchestration</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{work.phases.rehearsalPrep}</p>
              <p className="text-xs text-muted-foreground">Rehearsal</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{work.phases.revision}</p>
              <p className="text-xs text-muted-foreground">Revision</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PhaseSliderProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  current: number;
  onChange: (value: number) => void;
  tooltip: string;
}

function PhaseSlider({ label, icon, value, current, onChange, tooltip }: PhaseSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Current: {current}</span>
          <Badge variant="outline" className="font-mono w-12 justify-center">
            {value}%
          </Badge>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        max={100}
        step={5}
        className="w-full"
      />
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: number }) {
  const labels = ['', 'Easy', 'Simple', 'Moderate', 'Challenging', 'Difficult', 'Masterwork'];
  const colors = [
    '',
    'bg-green-500/10 text-green-700 dark:text-green-400',
    'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    'bg-red-500/10 text-red-700 dark:text-red-400',
    'bg-purple-500/10 text-purple-700 dark:text-purple-400'
  ];
  
  return (
    <Badge variant="outline" className={`text-xs ${colors[difficulty]}`}>
      {labels[difficulty]}
    </Badge>
  );
}
