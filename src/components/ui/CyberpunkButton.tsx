import React from 'react';
import { usePageTransition } from '@/components/layout/PageTransitionContext';

interface CyberpunkButtonProps {
  text: string;
  margin: string;
  index: number;
  href?: string;
  onClick?: () => void;
  width?: string;
  height?: string;
}

export const CyberpunkButton: React.FC<CyberpunkButtonProps> = ({ text, margin, index, href, onClick, width, height }) => {
  const { startTransition } = usePageTransition();
  
  const effectiveOnClick = onClick ? onClick : () => {
    if (href) {
      startTransition(href);
    }
  };
  
  const baseStyle: React.CSSProperties = {
    transformStyle: 'preserve-3d',
    transform: 'translateZ(0)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2), 0 0 5px rgba(57,255,20,0.2)',
    cursor: 'pointer'
  };
  
  if (width) {
    baseStyle.width = width;
  }
  if (height) {
    baseStyle.height = height;
  }
  
  return (
    <div
      key={text}
      className={`sci-fi-button tracer-button-${index} group relative ${margin} hover:z-depth-pop`}
      style={baseStyle}
      onClick={effectiveOnClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateZ(35px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4), 0 0 15px rgba(57,255,20,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateZ(0)';
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2), 0 0 5px rgba(57,255,20,0.2)';
      }}
    >
      <div className="absolute -inset-4 rounded-lg overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-lg"></div>
        <div 
          className="absolute inset-0 border border-lime-500/20 rounded-lg outer-glow"
        ></div>
        <svg className="absolute inset-0 w-full h-full opacity-70">
          <rect 
            x="0" y="0" 
            width="100%" height="100%" 
            fill="none" 
            stroke="#39FF14" 
            strokeOpacity="0.15"
            strokeWidth="1" 
            strokeDasharray="10,15"
          />
          
          <path
            d="M0,25 Q50,18 100,25"
            className="tracer-line"
            style={{ 
              strokeOpacity: 0.1,
              strokeWidth: 0.5
            }}
          />
          
          {index === 0 && (
            <>
              <line x1="10%" y1="0" x2="20%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="3,10" className="tracer-line" style={{animationDelay: "-1.3s"}} />
              <line x1="30%" y1="0" x2="40%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="5,8" className="tracer-line" style={{animationDelay: "-4.7s"}} />
              <line x1="60%" y1="0" x2="70%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="7,12" className="tracer-line" style={{animationDelay: "-2.2s"}} />
              <line x1="80%" y1="0" x2="90%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="4,15" className="tracer-line" style={{animationDelay: "-5.9s"}} />
            </>
          )}
          
          {index === 1 && (
            <>
              <line x1="15%" y1="0" x2="25%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="6,12" className="tracer-line" style={{animationDelay: "-3.8s"}} />
              <line x1="35%" y1="0" x2="45%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="4,9" className="tracer-line" style={{animationDelay: "-6.1s"}} />
              <line x1="55%" y1="0" x2="65%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="8,10" className="tracer-line" style={{animationDelay: "-1.5s"}} />
              <line x1="75%" y1="0" x2="85%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="5,14" className="tracer-line" style={{animationDelay: "-8.3s"}} />
            </>
          )}
          
          {index === 2 && (
            <>
              <line x1="5%" y1="0" x2="15%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="7,13" className="tracer-line" style={{animationDelay: "-5.2s"}} />
              <line x1="25%" y1="0" x2="35%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="3,11" className="tracer-line" style={{animationDelay: "-9.7s"}} />
              <line x1="50%" y1="0" x2="60%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="9,8" className="tracer-line" style={{animationDelay: "-2.9s"}} />
              <line x1="85%" y1="0" x2="95%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="6,15" className="tracer-line" style={{animationDelay: "-7.1s"}} />
            </>
          )}
          
          {index === 3 && (
            <>
              <line x1="20%" y1="0" x2="10%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="4,14" className="tracer-line" style={{animationDelay: "-12.3s"}} />
              <line x1="40%" y1="0" x2="30%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="8,7" className="tracer-line" style={{animationDelay: "-6.8s"}} />
              <line x1="65%" y1="0" x2="55%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="5,9" className="tracer-line" style={{animationDelay: "-3.4s"}} />
              <line x1="90%" y1="0" x2="80%" y2="100%" stroke="#39FF14" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="7,11" className="tracer-line" style={{animationDelay: "-8.9s"}} />
            </>
          )}
          
          {index === 0 && (
            <path 
              className="tracer-line"
              d="M5,5 C40,20 60,15 90,5 L95,30 C80,60 20,50 5,35 Z"
              style={{
                animation: "trace 11.3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                animationDelay: "-2.3s"
              }}
            />
          )}
          
          {index === 1 && (
            <path 
              className="tracer-line"
              d="M15,8 C30,40 70,30 85,12 L78,50 C65,45 25,55 12,20 Z"
              style={{
                animation: "trace 8.7s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
                animationDelay: "-7.1s"
              }}
            />
          )}
          
          {index === 2 && (
            <path 
              className="tracer-line"
              d="M30,15 Q50,5 70,25 T50,40 T30,15"
              style={{
                animation: "trace 15.5s ease-in-out infinite",
                animationDelay: "-3.8s"
              }}
            />
          )}
          
          {index === 3 && (
            <polyline 
              className="tracer-line"
              points="20,10 35,25 50,15 65,30 80,20"
              fill="none"
              style={{
                animation: "trace 9.3s cubic-bezier(0.76, 0, 0.24, 1) infinite",
                animationDelay: "-5.6s"
              }}
            />
          )}
          
          {index === 0 && (
            <>
              <circle className="data-point" cx="10" cy="10" />
              <circle className="data-point" cx="90" cy="25" />
              <circle className="data-point" cx="50" cy="60" />
            </>
          )}
          
          {index === 1 && (
            <>
              <circle className="data-point" cx="25" cy="15" />
              <circle className="data-point" cx="70" cy="35" />
              <circle className="data-point" cx="40" cy="50" />
            </>
          )}
          
          {index === 2 && (
            <>
              <circle className="data-point" cx="35" cy="20" />
              <circle className="data-point" cx="65" cy="45" />
              <circle className="data-point" cx="20" cy="55" />
            </>
          )}
          
          {index === 3 && (
            <>
              <circle className="data-point" cx="45" cy="10" />
              <circle className="data-point" cx="75" cy="40" />
              <circle className="data-point" cx="30" cy="60" />
            </>
          )}
          
          <rect
            className="flicker"
            x="0" y="0"
            width="100%" height="100%"
          />
        </svg>
      </div>
      
      <div className="absolute inset-0 opacity-0 blur-md bg-lime-500/30 transition-opacity duration-500 ease-in-out group-hover:opacity-100 rounded-md" />
      
      <svg 
        className="absolute inset-0 h-full w-full" 
        viewBox="0 0 380 70" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M380 14v42c0 7.732-6.268 14-14 14h-70l-8-8h-190l-8 8h-70c-7.732 0-14-6.268-14-14v-42c0-7.732 6.268-14 14-14h70l8 8h190l8-8h70c7.732 0 14 6.268 14 14z" 
          className="fill-black/50 transition-all duration-500 ease-in-out group-hover:fill-black/90 group-hover:shadow-[inset_0_0_20px_rgba(57,255,20,0.5)]"
        />
        
        <path 
          d="M380 14v42c0 7.732-6.268 14-14 14h-70l-8-8h-190l-8 8h-70c-7.732 0-14-6.268-14-14v-42c0-7.732 6.268-14 14-14h70l8 8h190l8-8h70c7.732 0 14 6.268 14 14z" 
          className="fill-lime-500/0 transition-all duration-500 ease-in-out group-hover:fill-lime-500/20"
        />
        
        <path 
          d="M380 14v42c0 7.732-6.268 14-14 14h-70l-8-8h-190l-8 8h-70c-7.732 0-14-6.268-14-14v-42c0-7.732 6.268-14 14-14h70l8 8h190l8-8h70c7.732 0 14 6.268 14 14z" 
          className="border-glow fill-none stroke-lime-500/80 stroke-[2] transition-all duration-300 group-hover:stroke-lime-400"
          strokeDasharray="30,15,8,15"
          style={{
            animation: index === 0 ? "dashoffset 7.2s linear infinite" :
                      index === 1 ? "dashoffset 12.3s linear infinite reverse" :
                      index === 2 ? "dashoffset 9.5s linear infinite" :
                      "dashoffset 15.1s linear infinite reverse",
            animationDelay: index === 0 ? "-2.1s" :
                            index === 1 ? "-5.7s" :
                            index === 2 ? "-3.5s" :
                            "-8.9s"
          }}
        />
        
        <path 
          d="M385 10v50c0 8-6.268 15-14 15h-75l-10-10h-185l-10 10h-75c-8 0-15-7-15-15v-50c0-8 7-15 15-15h75l10 10h185l10-10h75c8 0 14 7 14 15z" 
          className="tracer-path"
          style={{
            animation: index === 0 ? "tracer 15.5s linear infinite alternate" :
                      index === 1 ? "tracer 11.9s linear infinite alternate-reverse" :
                      index === 2 ? "tracer 9.3s linear infinite alternate" :
                      "tracer 13.7s linear infinite alternate-reverse",
            animationDelay: index === 0 ? "-3.3s" :
                            index === 1 ? "-6.7s" :
                            index === 2 ? "-1.9s" :
                            "-4.5s"
          }}
        />
        
        <rect 
          x="5" y="5" 
          width="370" height="60" 
          rx="12" 
          className="pulse-glow fill-none stroke-lime-500/10 stroke-[1]"
        />
        
        <path 
          d="M14 0L0 14M366 0L380 14M14 70L0 56M366 70L380 56" 
          className="corner-glow stroke-lime-500/80 stroke-3 transition-all duration-300 group-hover:stroke-lime-400 group-hover:stroke-[4]"
        />
        
        <path 
          d={`M${60 + index*30} 0v10 M${320 - index*30} 0v10 M${60 + index*30} 70v-10 M${320 - index*30} 70v-10`}
          className="tech-detail stroke-lime-500/80 stroke-2 transition-all duration-300 group-hover:stroke-lime-400/90 group-hover:stroke-[3]"
          strokeDasharray="0"
          strokeDashoffset="0"
        />
        
        <path 
          d={`M30 35h${35 + index*20} M350 35h-${35 + index*20}`}
          className="circuit-pattern stroke-lime-500/80 stroke-2 transition-all duration-300 group-hover:stroke-lime-400/90 group-hover:stroke-[3]"
          strokeDasharray="6,6"
        />
      </svg>
      
      <div className="relative flex h-16 w-full items-center justify-center bg-transparent text-center text-2xl font-semibold text-lime-500 transition-all duration-500 group-hover:text-lime-300 z-10 px-12">
        <span className="text-glow relative tracking-widest transition-all duration-500">
          {text}
        </span>
        
        <span className="bracket-glow absolute left-8 text-3xl font-light opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:text-lime-300">
          &#10214;
        </span>
        
        <span className="bracket-glow absolute right-8 text-3xl font-light opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:text-lime-300">
          &#10215;
        </span>
      </div>
    </div>
  );
};

export default CyberpunkButton; 