import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type AnimatedHeroProps = {
  children: React.ReactNode;
};

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({ children }) => {
  const reduce = useReducedMotion();
  const base = {
    initial: { opacity: 0, y: reduce ? 0 : 32, scale: reduce ? 1 : 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: reduce ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <motion.div
      initial={base.initial}
      animate={base.animate}
      transition={base.transition}
      className="relative"
    >
      {children}
    </motion.div>
  );
};
