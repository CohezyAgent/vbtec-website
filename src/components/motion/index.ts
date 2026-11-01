// Motion primitives (04 §4, 05 §8.3). RevealText = WordReveal.
export { default as Reveal, type RevealMode } from "./Reveal";
export { default as WordReveal, default as RevealText } from "./WordReveal";
export { default as CountUp } from "./CountUp";
export { default as ScrollProgress } from "./ScrollProgress";
export { useInView, observeOnce, prefersReducedMotion } from "./useInView";
export { useScrollProgress } from "./useScrollProgress";
