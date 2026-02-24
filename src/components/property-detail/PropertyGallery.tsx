import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
}

const PropertyGallery = ({ images }: PropertyGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const totalPhotos = images.length;
  const mainImage = images[0];
  const thumbs = images.slice(1, 5);
  const extraCount = totalPhotos - 5;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const navigate = (dir: number) => {
    setLightboxIndex((prev) => (prev + dir + totalPhotos) % totalPhotos);
  };

  return (
    <>
      <div className="rounded-xl overflow-hidden flex" style={{ maxHeight: 420 }}>
        {/* Main image - 60% */}
        <div
          className="w-[60%] cursor-pointer relative"
          onClick={() => openLightbox(0)}
        >
          <img
            src={mainImage}
            alt="Foto principal"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails grid - 40% */}
        <div className="w-[40%] grid grid-cols-2 grid-rows-2 gap-0.5 ml-0.5">
          {thumbs.map((img, i) => {
            const imageIndex = i + 1;
            const isLast = i === 3 && extraCount > 0;
            return (
              <div
                key={i}
                className="relative cursor-pointer overflow-hidden"
                onClick={() => openLightbox(imageIndex)}
              >
                <img
                  src={img}
                  alt={`Foto ${imageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Photo counter badge */}
                <span className="absolute bottom-0 right-0 rounded-tl-md bg-foreground/60 px-1.5 py-0.5 text-xs text-card">
                  {imageIndex + 1}/{totalPhotos}
                </span>
                {/* "+ X fotos más" overlay on last thumb */}
                {isLast && (
                  <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                    <span className="text-sm font-medium text-card">
                      + {extraCount} fotos más
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-card/10 hover:bg-card/20 text-card transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 p-2 rounded-full bg-card/10 hover:bg-card/20 text-card transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-4 p-2 rounded-full bg-card/10 hover:bg-card/20 text-card transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`Foto ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-card text-sm font-medium bg-foreground/50 rounded-full px-4 py-1.5">
            {lightboxIndex + 1} / {totalPhotos}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;
