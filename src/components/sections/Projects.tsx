"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  clamp,
  duration,
  ease,
  usePointerFine,
  useReducedMotion,
} from "@/lib/animation-utils";
import { HudFrame, HudTag } from "@/components/ui/Hud";
import SectionHead from "@/components/ui/SectionHead";
import styles from "./Projects.module.css";

type Project = {
  title: string;
  year: string;
  body: React.ReactNode;
  stack: string[];
};

const projects: Project[] = [
  {
    title: "Autonomous Market Intelligence Analyst",
    year: "2026",
    body: (
      <>
        Three agents in a LangGraph pipeline. A scraper watches SEC filings,
        press releases and news; an analyst pulls metrics, sentiment and risk
        flags through RAG retrieval over ChromaDB; an editor writes the report
        and mails it out. Validated end-to-end against{" "}
        <span className={styles.metric}>10+ public companies</span>.
      </>
    ),
    stack: ["LangGraph", "GPT-4", "ChromaDB", "RAG", "Python"],
  },
  {
    title: "AlzDx",
    year: "2024",
    body: (
      <>
        A ResNet50 transfer-learning model served behind a Flask API,
        classifying early-stage Alzheimer&rsquo;s from MRI scans at{" "}
        <span className={styles.metric}>~89% accuracy</span> — 15 points above
        the baseline it replaced.
      </>
    ),
    stack: ["TensorFlow", "ResNet50", "Flask", "Firebase"],
  },
  {
    title: "YOLOv3 for Small Objects",
    year: "2024",
    body: (
      <>
        Entropy-based metrics folded into the YOLOv3 detection head, lifting
        small-object precision by{" "}
        <span className={styles.metric}>~15%</span> across a 10,000-image set.
        Co-authored the supporting paper.
      </>
    ),
    stack: ["PyTorch", "OpenCV"],
  },
];

const OPEN_SLOTS = 6;

/**
 * Cursor-proximity tilt (CLAUDE.md §5, signature moment 2).
 *
 * One delegated pointermove on the grid drives every card, and each card owns
 * a quickTo per axis so the tilt is interpolated rather than snapped.
 */
function useCardTilt(enabled: boolean) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!enabled || !grid) return;

      const cards = Array.from(
        grid.querySelectorAll<HTMLElement>(`.${styles.card}`)
      );

      const setters = cards.map((card) => ({
        card,
        rotX: gsap.quickTo(card, "rotationX", {
          duration: duration.ui,
          ease: ease.snap,
        }),
        rotY: gsap.quickTo(card, "rotationY", {
          duration: duration.ui,
          ease: ease.snap,
        }),
        lift: gsap.quickTo(card, "z", {
          duration: duration.ui,
          ease: ease.snap,
        }),
      }));

      const MAX_TILT = 7;

      const onMove = (event: PointerEvent) => {
        for (const { card, rotX, rotY, lift } of setters) {
          const rect = card.getBoundingClientRect();
          const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
          const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
          // Proximity, not just hover: cards near the pointer lean toward it,
          // and the effect falls off past roughly one card's distance.
          const proximity = clamp(1 - Math.hypot(dx, dy) / 1.6, 0, 1);
          rotY(clamp(dx, -1, 1) * MAX_TILT * proximity);
          rotX(clamp(-dy, -1, 1) * MAX_TILT * proximity);
          lift(28 * proximity);
        }
      };

      const onLeave = () => {
        for (const { rotX, rotY, lift } of setters) {
          rotX(0);
          rotY(0);
          lift(0);
        }
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      grid.addEventListener("pointerleave", onLeave);
      document.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        grid.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [enabled] }
  );

  return gridRef;
}

function useProjectsReveal(reducedMotion: boolean) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const cards = root.querySelectorAll<HTMLElement>("[data-card]");

      gsap.from(cards, {
        opacity: 0,
        y: reducedMotion ? 0 : 34,
        duration: reducedMotion ? duration.ui : duration.scene,
        ease: ease.snap,
        stagger: 0.06,
        scrollTrigger: { trigger: root, start: "top 74%" },
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return rootRef;
}

export default function Projects() {
  const reducedMotion = useReducedMotion();
  const pointerFine = usePointerFine();
  const rootRef = useProjectsReveal(reducedMotion);
  const gridRef = useCardTilt(pointerFine && !reducedMotion);

  return (
    <section className={styles.projects} ref={rootRef} id="work">
      <SectionHead
        index={2}
        label="projects"
        title="Things I built to see if they'd hold"
        note="Nine slots. Three are filled with work that shipped; the rest are waiting on write-ups rather than on the work itself."
      />

      <div className={styles.grid} ref={gridRef}>
        {projects.map((project, i) => (
          <HudFrame
            key={project.title}
            className={styles.card}
            data-card
            data-cursor="view"
            data-cursor-label="Read"
          >
            <div className={styles.cardTop}>
              <HudTag index={i + 1} accent brackets={false}>
                project
              </HudTag>
              <HudTag brackets={false}>{project.year}</HudTag>
            </div>
            <h3 className={styles.cardTitle}>{project.title}</h3>
            <p className={styles.cardBody}>{project.body}</p>
            <div className={styles.stack}>
              {project.stack.map((tech) => (
                <span key={tech} className={styles.chip}>
                  {tech}
                </span>
              ))}
            </div>
          </HudFrame>
        ))}

        {Array.from({ length: OPEN_SLOTS }, (_, i) => (
          <div
            key={`open-${i}`}
            className={`${styles.card} ${styles.cardOpen}`}
            data-card
          >
            <HudTag index={projects.length + i + 1} brackets={false}>
              slot open
            </HudTag>
            <h3 className={styles.cardTitle}>Next</h3>
            <p className={styles.openNote}>
              Reserved for work in progress. Write-up lands here.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
