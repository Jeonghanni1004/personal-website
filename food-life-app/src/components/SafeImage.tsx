import { useState } from 'react';
import { cn } from '../utils/meal';

interface Props {
  src?: string;
  alt?: string;
  className?: string;
  fallbackEmoji?: string;
}

export default function SafeImage({
  src,
  alt = '',
  className,
  fallbackEmoji = '🍽️',
}: Props) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div className={cn('img-fallback', className)} aria-label={alt}>
        <span>{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
