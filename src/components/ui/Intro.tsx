"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  ease,
  markIntroPlayed,
  shouldPlayIntro,
  useReducedMotion,
} from "@/lib/animation-utils";
import styles from "./Intro.module.css";

/**
 * Landing sequence. Short by design — it is a handoff, not a title card.
 * Plays once per browser session so returning to the page is not a toll gate.
 */
export default function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // The decision to play depends on sessionStorage, which does not exist
      // during SSR. Deciding at render time would make the server and client
      // trees disagree, so the overlay is always rendered and torn down here.
      if (!shouldPlayIntro() || reducedMotion) {
        markIntroPlayed();
        setDone(true);
        return;
      }

      document.body.style.overflow = "hidden";

      const finish = () => {
        document.body.style.overflow = "";
        markIntroPlayed();
        setDone(true);
        // The hero measures its pin against a page that was scroll-locked.
        ScrollTrigger.refresh();
      };

      gsap
        .timeline({ onComplete: finish })
        .from(`.${styles.node}`, {
          scale: 0,
          opacity: 0,
          duration: 0.42,
          ease: ease.snap,
          stagger: 0.07,
        })
        .from(
          `.${styles.edge}`,
          { strokeDashoffset: 60, duration: 0.34, ease: "none" },
          0.2
        )
        .from(`.${styles.name}`, { opacity: 0, y: 8, duration: 0.3 }, 0.25)
        .to(`.${styles.fill}`, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 0.3)
        .to(root, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.62,
          ease: "power3.inOut",
        });

      return () => {
        document.body.style.overflow = "";
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  if (done) return null;

  return (
    <div className={styles.intro} ref={rootRef} aria-hidden="true">
      <div className={styles.mark}>
        <svg className={styles.glyph} viewBox="0 0 64 64">
          <path className={styles.edge} d="M20 19 L45 32 L20 45" />
          <circle className={styles.node} cx="20" cy="19" r="6.5" fill="#3D7CFF" />
          <circle className={styles.node} cx="45" cy="32" r="6.5" fill="#B45CFF" />
          <circle className={styles.node} cx="20" cy="45" r="6.5" fill="#3D7CFF" />
        </svg>
        <span className={styles.name}>Shubh Pratap Singh</span>
        <span className={styles.track}>
          <span className={styles.fill} />
        </span>
      </div>
    </div>
  );
}
