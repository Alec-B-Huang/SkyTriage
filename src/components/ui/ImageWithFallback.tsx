import { useEffect, useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  label: string;
  hint: string;
  variant?: 'before' | 'after' | 'context';
  className?: string;
}

const variantTone: Record<NonNullable<ImageWithFallbackProps['variant']>, string> = {
  before: 'from-sky-300/18 via-transparent to-emerald-300/10',
  after: 'from-orange-300/18 via-transparent to-red-300/12',
  context: 'from-slate-300/12 via-transparent to-sky-300/10',
};

export function ImageWithFallback({
  src,
  alt,
  label,
  hint,
  variant = 'context',
  className = '',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`image-fallback relative flex h-full min-h-[220px] overflow-hidden rounded-[24px] border border-white/8 ${className}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${variantTone[variant]}`} />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 py-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.24em] text-sky-100/70">{label}</div>
          <div className="mt-2 text-sm font-medium text-slate-100">Mock imagery placeholder</div>
          <div className="mt-2 max-w-[280px] text-sm leading-6 text-slate-300">{hint}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full min-h-[220px] overflow-hidden rounded-[24px] border border-white/8 bg-black/20 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${variantTone[variant]} opacity-90`} />
    </div>
  );
}
