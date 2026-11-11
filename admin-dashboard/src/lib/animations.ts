import { Variants } from 'framer-motion';

/**
 * Reusable motion animation variants for Sunrise School Web Landing Page
 */

// Stagger container for text and lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05 * i,
    },
  }),
};

// Word-by-word fade & slide-up variant
export const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 220,
    },
  },
};

// Subtitle & smooth fade-up variant
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Spring pill entrance
export const springPillVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
};

// Left scroll reveal for Parent Portal Card
export const cardRevealLeft: Variants = {
  hidden: { opacity: 0, x: -45, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 22,
      mass: 0.8,
    },
  },
};

// Right scroll reveal for Admin & Staff Portal Card
export const cardRevealRight: Variants = {
  hidden: { opacity: 0, x: 45, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 22,
      mass: 0.8,
    },
  },
};

// Staggered feature list item variant
export const featureItemVariant: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};
