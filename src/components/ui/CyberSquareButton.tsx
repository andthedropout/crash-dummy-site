import React from 'react';

interface CyberSquareButtonProps {
  text: string;
  onClick?: () => void;
  size?: string;
  className?: string;
}

export const CyberSquareButton: React.FC<CyberSquareButtonProps> = ({ 
  text, 
  onClick, 
  size = '60px',
  className = ''
}) => {
  return (
    <button
      className={`cyber-square-button relative ${className}`}
      onClick={onClick}
      style={{ 
        width: size, 
        height: size 
      }}
    >
      {/* Background and border - Use primary color for border */}
      <div className="absolute inset-0 bg-black/80 border border-[var(--csb-primary)]/80 z-10"></div>

      {/* Corner brackets - Use primary color */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--csb-primary)] z-20"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--csb-primary)] z-20"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--csb-primary)] z-20"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--csb-primary)] z-20"></div>

      {/* Glitch effect container */}
      <div className="glitch-square-container absolute inset-0 z-30">
        {/* Text uses primary color, shadow uses secondary color */}
        <div 
          className="relative w-full h-full flex items-center justify-center text-2xl font-bold glitch-square-text"
          style={{
            color: 'var(--csb-primary)',
            textShadow: `0 0 5px var(--csb-secondary)` 
          }}
          data-text={text}
        >
          {text}
        </div>
      </div>

      {/* Scan line - Uses primary color */}
      <div className="absolute inset-0 overflow-hidden z-40 pointer-events-none">
        <div className="scan-line-horizontal" style={{ backgroundColor: `var(--csb-primary)` }}></div>
      </div>

      {/* Data text - Uses primary color */}
      <div className="absolute -bottom-4 right-0 text-[8px] text-[var(--csb-primary)]/80 font-mono z-50">NAV.0{text === '<' ? '1' : '2'}</div>

      {/* Hover glow overlay - Uses secondary color */}
      <div className="absolute inset-0 opacity-0 hover:opacity-30 bg-[var(--csb-secondary)]/20 transition-opacity duration-300 z-15"></div>
    </button>
  );
};

export default CyberSquareButton; 