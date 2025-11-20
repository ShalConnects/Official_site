import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <img
      src="/SC Logo.png"
      alt="ShalConnects Logo"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'contain',
      }}
    />
  );
};

export default Logo;

