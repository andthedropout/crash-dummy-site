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
      {/* Background and border */}
      <div className="absolute inset-0 bg-black/80 border border-lime-500/80 z-10"></div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-lime-500 z-20"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-lime-500 z-20"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-lime-500 z-20"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-lime-500 z-20"></div>

      {/* Glitch effect container */}
      <div className="glitch-square-container absolute inset-0 z-30">
        <div className="relative w-full h-full flex items-center justify-center text-2xl font-bold glitch-square-text" data-text={text}>
          {text}
        </div>
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden z-40 pointer-events-none">
        <div className="scan-line-horizontal"></div>
      </div>

      {/* Data text */}
      <div className="absolute -bottom-4 right-0 text-[8px] text-lime-500/80 font-mono z-50">NAV.0{text === '<' ? '1' : '2'}</div>

      {/* Hover glow overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-30 bg-lime-500/20 transition-opacity duration-300 z-15"></div>
    </button>
  );
};

export default CyberSquareButton; 