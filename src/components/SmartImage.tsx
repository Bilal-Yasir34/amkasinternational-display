import { useEffect, useRef, useState } from 'react';
import { responsiveSrcSet } from '@/lib/image';

type SmartImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  ratio?: string;
  fit?: 'cover' | 'contain';
};

export default function SmartImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes,
  ratio,
  fit = 'cover',
}: SmartImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);

    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setErrored(true);
      }
    }
  }, [src]);

  const srcSet = responsiveSrcSet(src ?? '');
  const fitClass = fit === 'contain' ? 'object-contain max-h-full max-w-full m-auto' : 'object-cover';

  return (
    <div
      className={`relative overflow-hidden bg-ink-100/40 flex items-center justify-center ${ratio ? '' : ''}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {!loaded && !errored && <div className="absolute inset-0 skeleton" aria-hidden />}
      {src && !errored ? (
        <img
          ref={(node) => {
            imgRef.current = node;
            if (node?.complete && node.naturalWidth > 0 && !loaded) {
              setLoaded(true);
            }
          }}
          src={src}
          srcSet={srcSet}
          sizes={sizes ?? '100vw'}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`h-full w-full ${fitClass} transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-ink-100 text-ink-300">
          {errored ? (
            <span className="text-xs text-ink-400">Image unavailable</span>
          ) : (
            <span className="h-6 w-6 animate-pulse rounded-full bg-ink-200" />
          )}
        </div>
      )}
    </div>
  );
}
