import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../utils/meal';

interface Props {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  className?: string;
  light?: boolean;
}

export default function PageHeader({ title, onBack, right, className, light }: Props) {
  const navigate = useNavigate();
  return (
    <header
      className={cn(
        'flex items-center justify-between mb-4 sticky top-0 z-20 -mx-5 px-5 py-3',
        light ? 'bg-transparent' : 'bg-cream/90 backdrop-blur-md',
        className,
      )}
    >
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          light ? 'bg-black/20 text-white' : 'bg-cream-dark text-ink',
        )}
        aria-label="返回"
      >
        <ChevronLeft size={22} />
      </button>
      {title ? (
        <h1 className={cn('font-display text-lg font-semibold', light && 'text-white')}>
          {title}
        </h1>
      ) : (
        <span />
      )}
      <div className="min-w-10 flex justify-end">{right}</div>
    </header>
  );
}
