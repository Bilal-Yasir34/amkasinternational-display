import { useEffect, useState } from 'react';
import { responsiveSrcSet } from '@/lib/image';

type SmartImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  ratio?: string;
};

export default function SmartImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes,
  ratio,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => setLoaded(false), [src]);

  const srcSet = responsiveSrcSet(src ?? '');

  return (
    <div
      className={`relative overflow-hidden bg-ink-100 ${ratio ? '' : ''}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {!loaded && !errored && <div className="absolute inset-0 skeleton" aria-hidden />}
      {src && !errored ? (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes ?? '100vw'}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-ink-100 text-ink-300">
          {errored ? (
            <span className="text-xs">Image unavailable</span>
          ) : (
            <span className="h-6 w-6 animate-pulse rounded-full bg-ink-200" />
          )}
        </div>
      )}
    </div>
  );
}
