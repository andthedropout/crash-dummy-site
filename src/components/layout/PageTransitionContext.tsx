'use client';

import React, { createContext, useContext, useState } from 'react';

type TransitionState = 'idle' | 'exiting' | 'entering';

interface PageTransitionContextType {
  transitionState: TransitionState;
  nextRoute: string | null;
  startTransition: (route: string) => void;
  completeTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState>('idle');
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const startTransition = (route: string) => {
    setTransitionState('exiting');
    setNextRoute(route);
  };

  const completeTransition = () => {
    setTransitionState('idle');
    setNextRoute(null);
  };

  return (
    <PageTransitionContext.Provider
      value={{
        transitionState,
        nextRoute,
        startTransition,
        completeTransition
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
} 