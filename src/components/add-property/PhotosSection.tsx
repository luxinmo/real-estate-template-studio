import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Star, Eye, EyeOff, Trash2, GripVertical, ImageIcon } from "lucide-react";

const photoLabels = [
  "Facade", "Living room", "Kitchen", "Bedroom", "Bathroom",
  "Terrace", "Pool", "Garden", "Parking", "Other",
];

export interface PhotoItem {
  id: string;
  url: string;
  label: string;
  isMain: boolean;
  active: boolean;
}

interface PhotosSectionProps {
  data: PhotoItem[];
  onChange: (data: PhotoItem[]) => void;
  title?: string;
  showLabels?: boolean;
  maxPhotos?: number;
}

const PhotosSection = ({
  data,
  onChange,
  title = "Photos",
  showLabels = true,
  maxPhotos = 50,
}: PhotosSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = maxPhotos - data.length;
    const newPhotos: PhotoItem[] = Array.from(files)
      .slice(0, remaining)
      .map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url: URL.createObjectURL(file),
        label: "Other",
        isMain: data.length === 0,
        active: true,
      }));
    onChange([...data, ...newPhotos]);
  };

  const setMain = (id: string) => {
    const updated = data.map((p) => ({ ...p, isMain: p.id === id }));
    // Move main to position 0
    const main = updated.find((p) => p.isMain);
    const rest = updated.filter((p) => !p.isMain);
    onChange(main ? [main, ...rest] : updated);
  };

  const toggleActive = (id: string) => {
    onChange(data.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const remove = (id: string) => {
    onChange(data.filter((p) => p.id !== id));
  };

  const updateLabel = (id: string, label: string) => {
    onChange(data.map((p) => (p.id === id ? { ...p, label } : p)));
  };

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground">{data.length}/{maxPhotos}</span>
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-lg border-2 border-dashed transition-colors p-8 text-center cursor-pointer mb-5 ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/40"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP · Max {maxPhotos} files</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Thumbnails grid */}
      {data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {data.map((photo, idx) => (
            <div
              key={photo.id}
              className={`group relative rounded-lg border overflow-hidden ${
                photo.isMain ? "border-primary ring-2 ring-primary/20" : "border-border"
              } ${!photo.active ? "opacity-50" : ""}`}
            >
              <div className="aspect-square bg-muted relative">
                <img
                  src={photo.url}
                  alt={photo.label}
                  className="w-full h-full object-cover"
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-card/90 hover:bg-card text-foreground"
                    onClick={() => setMain(photo.id)}
                    title="Set as main"
                  >
                    <Star className={`h-4 w-4 ${photo.isMain ? "fill-amber-500 text-amber-500" : ""}`} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-card/90 hover:bg-card text-foreground"
                    onClick={() => toggleActive(photo.id)}
                    title={photo.active ? "Deactivate" : "Activate"}
                  >
                    {photo.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-card/90 hover:bg-destructive hover:text-destructive-foreground text-foreground"
                    onClick={() => remove(photo.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Main badge */}
                {photo.isMain && (
                  <span className="absolute top-1.5 left-1.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded px-1.5 py-0.5">
                    MAIN
                  </span>
                )}

                {/* Index */}
                <span className="absolute bottom-1.5 right-1.5 text-[10px] font-mono bg-foreground/70 text-primary-foreground rounded px-1.5 py-0.5">
                  {idx + 1}
                </span>
              </div>

              {/* Label selector */}
              {showLabels && (
                <div className="p-2">
                  <Select value={photo.label} onValueChange={(v) => updateLabel(photo.id, v)}>
                    <SelectTrigger className="h-7 text-xs border-0 bg-transparent px-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {photoLabels.map((l) => (
                        <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PhotosSection;
