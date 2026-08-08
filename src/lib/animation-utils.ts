"use client";

import { useSyncExternalStore } from "react";

/**
 * GSAP-side mirror of the motion tokens in globals.css.
 * Both lists must stay in sync — same names, same curves.
 */
export const ease = {
  snap: "expo.out",
  quad: "quad.out",
  scene: "power2.inOut",
  sceneDeep: "power3.inOut",
} as const;

/** Seconds, because GSAP works in seconds and CSS works in ms. */
export const duration = {
  micro: 0.18,
  snap: 0.28,
  ui: 0.4,
  scene: 0.9,
  sceneLong: 1.4,
} as const;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Live preference, not a one-time read — a user toggling the OS setting
 * mid-session tears down scrubbing immediately. Server snapshot is `false`
 * so markup matches the common case and only corrects on hydration.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

/**
 * True only for devices that can actually hover a pointer. Cursor-follow,
 * magnetic pull and tilt are gated on this so touch devices never inherit
 * effects that have no input to drive them.
 */
export function usePointerFine(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(hover: hover) and (pointer: fine)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false
  );
}

/** Frame-rate independent smoothing toward a target. */
export function damp(current: number, target: number, factor: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-factor * dt));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
