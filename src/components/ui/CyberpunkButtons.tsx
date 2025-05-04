import React from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import { CyberpunkButton } from './CyberpunkButton'; // Use named import

interface ButtonData {
  text: string;
  margin: string;
  href?: string;
}

const buttonData: ButtonData[] = [
  { text: 'PRODUCERS', margin: 'mr-0', href: '/producers' },
  { text: 'MUSIC', margin: 'mr-8', href: '/music' },
  { text: 'SHOP', margin: 'mr-24', href: 'https://store.taylorgang.com/collections/tm88' },
  { text: 'SETTINGS', margin: 'mr-52', href: '/settings' },
];

// Animation configuration for staggered button animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, x: 50 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    } 
  }
};

export const CyberpunkButtons: React.FC = () => {
  return (
    <motion.div 
      className="relative z-20 flex w-full flex-col items-end justify-center space-y-14 p-4 pt-32"
      style={{ 
        perspective: '1000px', 
        transformStyle: 'preserve-3d'
      }}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {buttonData.map((button, index) => (
        <motion.div key={button.text} variants={item} className={button.margin} style={{ width: "100%" }}>
          <CyberpunkButton 
            text={button.text}
            margin=""
            index={index}
            href={button.href}
            width="100%"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CyberpunkButtons; 