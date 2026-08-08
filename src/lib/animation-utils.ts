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
  ui: 0.32,
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

const INTRO_KEY = "intro-played";

/** Once per session — a landing animation on every navigation is a toll gate. */
export function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== "1";
  } catch {
    return true;
  }
}

export function markIntroPlayed() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    // Private mode — the intro simply plays again next time.
  }
}

/**
 * Magnetic pull toward the pointer for elements marked [data-magnetic]
 * inside `root`. One delegated listener drives the whole group.
 * Returns a cleanup function.
 */
export function attachMagnetic(
  root: HTMLElement,
  gsapInstance: typeof import("gsap").gsap,
  radius = 90,
  strength = 0.32
) {
  const items = Array.from(
    root.querySelectorAll<HTMLElement>("[data-magnetic]")
  ).map((el) => ({
    el,
    x: gsapInstance.quickTo(el, "x", { duration: 0.4, ease: "expo.out" }),
    y: gsapInstance.quickTo(el, "y", { duration: 0.4, ease: "expo.out" }),
  }));

  const onMove = (event: PointerEvent) => {
    for (const item of items) {
      const rect = item.el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const pull = distance < radius ? 1 - distance / radius : 0;
      item.x(dx * strength * pull);
      item.y(dy * strength * pull);
    }
  };

  const reset = () => {
    for (const item of items) {
      item.x(0);
      item.y(0);
    }
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", reset);

  return () => {
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", reset);
    reset();
  };
}
