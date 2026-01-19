import { createContext, useContext } from 'react';

interface AnimationContextValue {
  isCalculated: boolean;
  shouldDelayForHeader: boolean;
  initialBatchCount: number;
}

export const AnimationContext = createContext<AnimationContextValue | null>(null);

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    // This error should not be thrown in practice because the consumer (AnimatedSection)
    // will always be rendered inside the provider (AnimatedSectionContainer).
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
};
