"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  attachMagnetic,
  usePointerFine,
  useReducedMotion,
} from "@/lib/animation-utils";
import styles from "./Nav.module.css";

const sections = [
  { id: "top", label: "Top" },
  { id: "manifesto", label: "Belief" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("top");
  const navRef = useRef<HTMLElement>(null);
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav || !pointerFine || reducedMotion) return;
      // Small radius: the pull should be felt on approach, not across the page.
      return attachMagnetic(nav, gsap, 70, 0.28);
    },
    { dependencies: [pointerFine, reducedMotion] }
  );

  useEffect(() => {
    // IntersectionObserver rather than a scroll handler: no work on the main
    // thread while the hero's pinned timeline is scrubbing.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.nav} aria-label="Sections" ref={navRef}>
      {sections.map((section) => (
        <a
          key={section.id}
          className={`${styles.link} ${
            active === section.id ? styles.isActive : ""
          }`}
          href={`#${section.id}`}
          data-cursor="link"
          data-magnetic
          aria-current={active === section.id ? "true" : undefined}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
