import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

// ─── Easing curves ────────────────────────────────────────────────────────────
const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;   // fast-in, soft-out
const EASE_SMOOTH    = [0.4, 0, 0.2, 1] as const;    // material standard

// ─── Variant definitions ──────────────────────────────────────────────────────
export type AnimVariant =
  | 'fadeUp'
  | 'fadeIn'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'revealUp';

const VARIANTS: Record<
  AnimVariant,
  { initial: object; animate: object; duration: number }
> = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    duration: 0.75,
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    duration: 0.7,
  },
  slideLeft: {
    initial: { opacity: 0, x: -32 },
    animate: { opacity: 1, x: 0 },
    duration: 0.8,
  },
  slideRight: {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
    duration: 0.8,
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    duration: 0.7,
  },
  revealUp: {
    initial: { opacity: 0, y: 48, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    duration: 0.9,
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: AnimVariant;
  delay?: number;
  duration?: number;
  className?: string;
  inView?: boolean;           // pass from useScrollReveal when used externally
  triggerOnce?: boolean;      // ignored when inView is passed externally
  easing?: 'cinematic' | 'smooth';
}

// ─── Component ────────────────────────────────────────────────────────────────
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration,
  className,
  inView,
  easing = 'cinematic',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const v = VARIANTS[variant];
  const easeCurve = easing === 'smooth' ? EASE_SMOOTH : EASE_CINEMATIC;

  // When reduced motion is preferred, skip transforms — only fade
  const initial = prefersReducedMotion ? { opacity: 0 } : v.initial;
  const animate = prefersReducedMotion
    ? { opacity: inView ? 1 : 0 }
    : inView
    ? v.animate
    : v.initial;

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={{
        duration: duration ?? v.duration,
        delay,
        ease: easeCurve,
      }}
    >
      {children}
    </motion.div>
  );
};

// ─── Stagger container for groups of children ─────────────────────────────────
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;      // seconds between each child
  baseDelay?: number;
  inView?: boolean;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  staggerDelay = 0.1,
  baseDelay = 0,
  inView = true,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
            delayChildren: baseDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// ─── Individual stagger item ──────────────────────────────────────────────────
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  variant?: AnimVariant;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className,
  variant = 'fadeUp',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const v = VARIANTS[variant];

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : v.initial,
    visible: {
      ...(prefersReducedMotion ? { opacity: 1 } : v.animate),
      transition: {
        duration: v.duration,
        ease: EASE_CINEMATIC,
      },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
};
