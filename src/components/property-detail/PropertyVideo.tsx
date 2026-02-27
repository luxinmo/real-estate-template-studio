import { useState } from "react";
import { Play, X } from "lucide-react";

const PropertyVideo = () => {
  const [playing, setPlaying] = useState(false);

  // Mock video URL — replace with real property video
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  return (
    <div className="rounded-xl border border-border bg-card shadow-card p-6">
      <h3 className="text-base font-semibold text-foreground mb-4">Vídeo de la propiedad</h3>

      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="relative w-full rounded-lg overflow-hidden bg-muted group cursor-pointer"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Thumbnail placeholder */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-foreground/10 group-hover:from-foreground/50 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="h-7 w-7 text-foreground ml-1" fill="currentColor" />
            </div>
          </div>
          <p className="absolute bottom-4 left-4 text-sm font-medium text-card">
            Tour virtual · 2:45
          </p>
        </button>
      ) : (
        <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <button
            onClick={() => setPlaying(false)}
            className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/80 transition-colors"
          >
            <X className="h-4 w-4 text-card" />
          </button>
          <iframe
            src={`${videoUrl}?autoplay=1`}
            title="Property video"
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default PropertyVideo;
