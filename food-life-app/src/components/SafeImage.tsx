import { useEffect, useState } from 'react';
import { cn } from '../utils/meal';
import { FOOD_PHOTOS } from '../data/mockImages';

interface Props {
  src?: string;
  alt?: string;
  className?: string;
  /** @deprecated kept for call-site compat; unused — fail over to real food photo */
  fallbackEmoji?: string;
}

const FALLBACK_SRC = FOOD_PHOTOS.bowl;

export default function SafeImage({ src, alt = '', className }: Props) {
  const [current, setCurrent] = useState(src || FALLBACK_SRC);

  useEffect(() => {
    setCurrent(src || FALLBACK_SRC);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      className={cn('object-cover bg-cream-dark', className)}
      loading="lazy"
      onError={() => {
        if (current !== FALLBACK_SRC) setCurrent(FALLBACK_SRC);
      }}
    />
  );
}
