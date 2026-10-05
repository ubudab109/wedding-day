import { useState } from 'react';

// Responsive optimized photo with a blur-up placeholder.
// `photo` comes from `virtual:photos`; `sizes` should describe the rendered width.
export default function Photo({ photo, alt, sizes = '100vw', className = '', imgClassName = '', position = '50% 35%', eager = false, onLoad }) {
  const [loaded, setLoaded] = useState(false);
  if (!photo) return null;

  return (
    <div
      className={`relative overflow-hidden bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${photo.placeholder})`, backgroundPosition: position }}
    >
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        draggable={false}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        style={{ objectPosition: position }}
        className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
}
