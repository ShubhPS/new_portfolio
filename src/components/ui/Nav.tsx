"use client";

import { useEffect, useState } from "react";
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
    <nav className={styles.nav} aria-label="Sections">
      {sections.map((section) => (
        <a
          key={section.id}
          className={`${styles.link} ${
            active === section.id ? styles.isActive : ""
          }`}
          href={`#${section.id}`}
          data-cursor="link"
          aria-current={active === section.id ? "true" : undefined}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
