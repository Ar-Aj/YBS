/**
 * Motion tokens for NON-HERO content.
 *
 * These mirror the CSS custom properties declared in `motion.css`. If you
 * change a number here, change it there. The hero and brand loader do not
 * read any of these values.
 */
export const MOTION = {
  /** Fraction of the viewport height at which an element's top edge triggers. */
  trigger: 0.76,
  /** Milliseconds. */
  duration: {
    standard: 1000,
    signature: 1400,
  },
  /** Milliseconds between siblings in a stagger. */
  stagger: 120,
  /** Highest sibling index that still gets its own delay (0-based). */
  staggerCap: 5,
  ease: {
    settle: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
    draw: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
} as const;

export type MotionDuration = keyof typeof MOTION.duration;

/**
 * How long, after a reveal starts, until the element is released to its
 * natural styles (removes compositor hints and any animation overrides so
 * hover transitions on cards work normally).
 */
export function settleTime(opts: {
  delay?: number;
  duration?: MotionDuration;
  staggered?: boolean;
  extra?: number;
}): number {
  const { delay = 0, duration = 'standard', staggered = false, extra = 0 } = opts;
  const steps = staggered ? MOTION.staggerCap * MOTION.stagger : 0;
  return delay + MOTION.duration[duration] + steps + extra + 150;
}
