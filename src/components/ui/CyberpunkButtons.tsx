import React from 'react';
import { CyberpunkButton } from './CyberpunkButton'; // Use named import

interface ButtonData {
  text: string;
  margin: string;
  href?: string;
}

const buttonData: ButtonData[] = [
  { text: 'PRODUCERS', margin: 'mr-0', href: '/producers' },
  { text: 'MUSIC', margin: 'mr-8', href: '/music' },
  { text: 'SHOP', margin: 'mr-24', href: '/shop' },
  { text: 'SETTINGS', margin: 'mr-52', href: '/settings' },
];

export const CyberpunkButtons: React.FC = () => {
  return (
    <div 
      className="relative z-20 flex w-full flex-col items-end justify-center space-y-14 p-4 pt-32"
      // Add back perspective and transform-style needed for child translateZ effects
      style={{ 
        perspective: '1000px', 
        transformStyle: 'preserve-3d'
      }}
    >
      {buttonData.map((button, index) => (
        <CyberpunkButton 
          key={button.text} // Key should be on the mapped element
          text={button.text}
          margin={button.margin}
          index={index}
          href={button.href}
        />
      ))}
    </div>
  );
};

export default CyberpunkButtons; // Default export for the container 