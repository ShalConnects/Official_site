import React from 'react';

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  showBorder?: boolean;
  style?: React.CSSProperties;
}

export default function PageSection({
  children,
  className = '',
  id,
  showBorder = false,
  style,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={`py-12 sm:py-16 md:py-20 ${showBorder ? 'border-t border-gray-800' : ''} ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}
