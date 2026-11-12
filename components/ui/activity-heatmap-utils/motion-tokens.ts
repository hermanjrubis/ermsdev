/**
 * Motion tokens for the activity heatmap. The component imports these by name;
 * values match the easing and timing used elsewhere on the site.
 */
export const motionTokens = {
  ease: {
    /** Things arriving: fast out, long settle. */
    enter: [0.16, 1, 0.3, 1],
    /** Things moving or leaving. */
    standard: [0.22, 1, 0.36, 1],
  },
  /** Blur radius in px for text that rolls in or out. */
  blur: {
    soft: 4,
    subtle: 2,
  },
  spring: {
    /** Tooltip following the pointer between cells. */
    snappy: { type: "spring", stiffness: 520, damping: 42, mass: 0.7 },
    /** Widths that grow or shrink with their content. */
    morph: { type: "spring", stiffness: 380, damping: 36, mass: 0.8 },
  },
  /** Seconds. */
  duration: {
    fast: 0.16,
  },
} as const;
