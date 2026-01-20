import { LogEntry, formatDate } from '@/lib/gameTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Calendar, ShoppingBag, Zap, Settings } from 'lucide-react';

interface LogPanelProps {
  entries: LogEntry[];
}

const typeIcons: Record<LogEntry['type'], React.ReactNode> = {
  event: <Zap className="h-3 w-3" />,
  premiere: <Music className="h-3 w-3" />,
  composition: <Calendar className="h-3 w-3" />,
  upgrade: <ShoppingBag className="h-3 w-3" />,
  system: <Settings className="h-3 w-3" />
};

const typeColors: Record<LogEntry['type'], string> = {
  event: 'text-amber-600 dark:text-amber-400',
  premiere: 'text-purple-600 dark:text-purple-400',
  composition: 'text-blue-600 dark:text-blue-400',
  upgrade: 'text-green-600 dark:text-green-400',
  system: 'text-muted-foreground'
};

export function LogPanel({ entries }: LogPanelProps) {
  return (
    <div className="w-80 flex-shrink-0 border-l bg-sidebar/50 flex flex-col">
      <div className="p-3 border-b">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Chronicle
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {entries.slice(0, 50).map((entry, index) => (
            <LogEntryCard 
              key={entry.id} 
              entry={entry} 
              isRecent={index < 3}
            />
          ))}
          
          {entries.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-8">
              Your journey begins...
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface LogEntryCardProps {
  entry: LogEntry;
  isRecent: boolean;
}

function LogEntryCard({ entry, isRecent }: LogEntryCardProps) {
  return (
    <div 
      className={`
        p-2 rounded-md text-sm
        ${isRecent ? 'bg-card border' : 'bg-transparent'}
      `}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 ${typeColors[entry.type]}`}>
          {typeIcons[entry.type]}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-serif leading-relaxed">{entry.text}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(entry.date)}
          </p>
        </div>
      </div>
    </div>
  );
}
