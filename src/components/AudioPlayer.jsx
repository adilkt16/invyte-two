import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function AudioPlayer({ startPlaying, audioUrl = "https://assets.mixkit.co/music/preview/mixkit-serene-forest-12502.mp3" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    // Listen to custom play trigger event
    const handlePlayTrigger = () => {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Autoplay blocked or audio failed:", err));
    };

    window.addEventListener('play-invitation-audio', handlePlayTrigger);

    return () => {
      window.removeEventListener('play-invitation-audio', handlePlayTrigger);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  // Watch for startPlaying prop changes (e.g. when envelope opens)
  useEffect(() => {
    if (startPlaying && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Autoplay blocked by browser:", err));
    }
  }, [startPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Error playing audio:", err));
    }
  };

  return (
    <>
      {/* Top Right Sound Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#f5e6d0]/80 backdrop-blur-sm border border-[#c9a060]/30 shadow-md flex items-center justify-center text-[#8b4513] hover:bg-[#f5e6d0] transition-all cursor-pointer"
          title={isPlaying ? "Mute Music" : "Play Music"}
        >
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-3.5">
              <span className="w-[3px] bg-[#8b4513] animate-bounce" style={{ height: '100%', animationDelay: '0.1s' }} />
              <span className="w-[3px] bg-[#8b4513] animate-bounce" style={{ height: '70%', animationDelay: '0.3s' }} />
              <span className="w-[3px] bg-[#8b4513] animate-bounce" style={{ height: '90%', animationDelay: '0.5s' }} />
              <span className="w-[3px] bg-[#8b4513] animate-bounce" style={{ height: '50%', animationDelay: '0.2s' }} />
            </div>
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Bottom Right Floating Play/Pause Action */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a060] to-[#b5865a] text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[#8b4513]/25"
          title={isPlaying ? "Pause Background Music" : "Play Background Music"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </>
  );
}
