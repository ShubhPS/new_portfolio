"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, usePointerFine, useReducedMotion } from "@/lib/animation-utils";
import styles from "./Cursor.module.css";

type CursorMode = "default" | "view" | "link";

/**
 * Context-morphing custom cursor (CLAUDE.md §5, signature moment 1).
 *
 * Elements opt in declaratively rather than registering themselves:
 *   <a data-cursor="link">              → ring tightens
 *   <article data-cursor="view" data-cursor-label="Case study">
 *
 * One delegated listener covers the whole page, so sections never import
 * this file and nothing has to be torn down when they unmount.
 */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const [pressed, setPressed] = useState(false);

  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const enabled = pointerFine && !reducedMotion;

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!enabled || !el) return;

      document.documentElement.dataset.customCursor = "true";
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

      // quickTo reuses one tween per axis instead of allocating on every
      // pointermove — the difference is visible on a 120Hz trackpad.
      const moveX = gsap.quickTo(el, "x", {
        duration: duration.snap,
        ease: ease.snap,
      });
      const moveY = gsap.quickTo(el, "y", {
        duration: duration.snap,
        ease: ease.snap,
      });

      let revealed = false;
      const onMove = (event: PointerEvent) => {
        moveX(event.clientX);
        moveY(event.clientY);
        if (!revealed) {
          revealed = true;
          gsap.to(el, { opacity: 1, duration: duration.ui });
        }
      };

      const onOver = (event: PointerEvent) => {
        const target = event.target as Element | null;
        const match = target?.closest?.("[data-cursor]") as HTMLElement | null;
        if (!match) {
          setMode("default");
          setLabel("");
          return;
        }
        setMode((match.dataset.cursor as CursorMode) ?? "default");
        setLabel(match.dataset.cursorLabel ?? "");
      };

      const onLeave = () => gsap.to(el, { opacity: 0, duration: duration.ui });
      const onDown = () => setPressed(true);
      const onUp = () => setPressed(false);

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      document.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointerleave", onLeave);
        delete document.documentElement.dataset.customCursor;
      };
    },
    { dependencies: [enabled] }
  );

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className={[
        styles.cursor,
        mode === "view" ? styles.isView : "",
        mode === "link" ? styles.isLink : "",
        pressed ? styles.isPressed : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <span className={styles.ring} />
      <span className={styles.dot} />
      {mode === "view" && label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
