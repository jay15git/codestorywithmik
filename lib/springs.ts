/** Framer Motion spring tiers aligned to transitions.dev motion tokens. */
export const spring = {
  /** Dropdown/modal open — --duration-fast (250ms), close --duration-quick (150ms) */
  fast: {
    type: "spring" as const,
    duration: 0.25,
    bounce: 0,
    exit: { duration: 0.15 },
  },
  // Critically damped: proximity overlays, merged selection backgrounds.
  moderate: {
    type: "spring" as const,
    duration: 0.25,
    bounce: 0,
    exit: { duration: 0.15 },
  },
  /** Panel open — --duration-slow (400ms), close --duration-medium (350ms) */
  slow: {
    type: "spring" as const,
    duration: 0.4,
    bounce: 0,
    exit: { duration: 0.35 },
  },
} as const;

// Fallback delay (ms) for deferred-unmount timers that guard an exit tween:
// popups keep their portal mounted until onAnimationComplete fires, but a
// throttled/background tab can stall the animation, so a timer force-unmounts
// after the tier's exit duration plus a safety buffer. Deriving it here keeps
// the timers in step with the tokens above.
export const exitFallbackMs = (tier: { exit: { duration: number } }) =>
  Math.round(tier.exit.duration * 1000) + 100;
