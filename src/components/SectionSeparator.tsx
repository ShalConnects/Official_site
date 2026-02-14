const THEME_GRADIENT = 'linear-gradient(to right, transparent, #17664180, #da651e80, transparent)';

interface SectionSeparatorProps {
  color?: string;
  variant?: 'subtle' | 'strong';
}

export function SectionSeparator({ color, variant = 'subtle' }: SectionSeparatorProps) {
  const isStrong = variant === 'strong';
  const background = color ? `linear-gradient(to right, transparent, ${color}50, transparent)` : THEME_GRADIENT;
  return (
    <div className={isStrong ? 'py-6 sm:py-8' : 'py-3 sm:py-4'} role="separator">
      <div
        className={isStrong ? 'h-0.5 sm:h-1 rounded-full' : 'h-0.5 rounded-full'}
        style={{ background, opacity: isStrong ? 0.6 : 0.7 }}
      />
    </div>
  );
}
