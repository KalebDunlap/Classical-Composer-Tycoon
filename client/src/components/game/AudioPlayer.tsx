import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Volume2, VolumeX, Music } from 'lucide-react';
import summerOverture from '@assets/Summer_Overture_1768970874997.mp3';
import allegrettoRomantico from '@assets/Allegretto_Romantico_1768970876674.mp3';

export function AudioPlayer() {
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => Math.floor(Math.random() * 2));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = [
    { title: "Summer Overture", src: summerOverture },
    { title: "Allegretto Romantico", src: allegrettoRomantico }
  ];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(tracks[currentTrackIndex].src);
      audioRef.current.loop = false;
      audioRef.current.volume = volume;
      
      audioRef.current.onended = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
      };

      // Try to autoplay on mount
      audioRef.current.play().catch(e => {
        console.log("Autoplay blocked or failed:", e);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrackIndex].src;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed:", e));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Volume</h4>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(val) => {
                setVolume(val[0] / 100);
                if (val[0] > 0) setIsMuted(false);
              }}
            />
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Music className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium truncate">
                  {tracks[currentTrackIndex].title}
                </span>
              </div>
              <Button 
                variant={isPlaying ? "outline" : "default"} 
                size="sm" 
                className="w-full h-8 text-xs"
                onClick={togglePlay}
              >
                {isPlaying ? "Pause Music" : "Play Music"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
