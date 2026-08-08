"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, useReducedMotion } from "@/lib/animation-utils";
import { HudTag } from "@/components/ui/Hud";
import SectionHead from "@/components/ui/SectionHead";
import styles from "./Experience.module.css";

const entries = [
  {
    org: "Angel One",
    role: "Data Science Intern",
    period: "Jun 2026 — Present",
    place: "Mumbai",
    bullets: [
      <>
        Architected a three-agent LLM pipeline — planner, reviewer, writer — on
        LangGraph and Claude, replacing one static weekly portfolio report with
        one written per persona.
      </>,
      <>
        Shipped it to production, where it lifted click-through{" "}
        <span className={styles.metric}>120%</span> and email opens{" "}
        <span className={styles.metric}>60%</span>.
      </>,
      <>
        Automated recurring CleverTap messaging workflows across user segments.
      </>,
    ],
  },
  {
    org: "National Stock Exchange",
    role: "Data Science Intern",
    period: "Apr — Jun 2025",
    place: "Mumbai",
    bullets: [
      <>
        Built an end-to-end RAG pipeline on Llama 3.2-1B for ITSM ticketing
        inside ServiceNow, cutting resolution time roughly{" "}
        <span className={styles.metric}>30%</span> for a 500-person department.
      </>,
      <>
        Designed fine-tuning protocols for domain-specific models that took
        training from <span className={styles.metric}>10 hours to 5.5</span>.
      </>,
      <>
        Put real-time retrieval over the technical documentation, dropping
        manual search time about <span className={styles.metric}>60%</span>.
      </>,
    ],
  },
  {
    org: "VIT Bhopal University",
    role: "B.Tech, Computer Science and Engineering",
    period: "Sep 2023 — Present",
    place: "Bhopal",
    bullets: [
      <>
        GPA <span className={styles.metric}>8.93</span>. Finalist in
        GeeksForGeeks Bug-a-thon and Meta&rsquo;s AI for Impact hackathon.
      </>,
      <>
        Machine Learning and Deep Learning Specializations; Oracle Generative AI
        Professional certification.
      </>,
    ],
  },
];

function useExperienceAnimation(reducedMotion: boolean) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const rows = root.querySelectorAll<HTMLElement>("[data-entry]");

      rows.forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: reducedMotion ? 0 : 30,
          duration: reducedMotion ? duration.ui : duration.scene,
          ease: ease.snap,
          scrollTrigger: { trigger: row, start: "top 85%" },
        });
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return rootRef;
}

export default function Experience() {
  const reducedMotion = useReducedMotion();
  const rootRef = useExperienceAnimation(reducedMotion);

  return (
    <section className={styles.experience} ref={rootRef} id="experience">
      <SectionHead
        index={4}
        label="experience"
        title="Where the systems went live"
        note="Two internships where the work reached real users, and the degree running underneath both."
      />

      <div className={styles.timeline}>
        {entries.map((entry) => (
          <article key={entry.org} className={styles.entry} data-entry>
            <div className={styles.meta}>
              <HudTag accent brackets={false}>
                {entry.period}
              </HudTag>
              <h3 className={styles.org}>{entry.org}</h3>
              <p className={styles.role}>
                {entry.role} · {entry.place}
              </p>
            </div>
            <div className={styles.detail}>
              {entry.bullets.map((bullet, i) => (
                <p key={i} className={styles.bullet}>
                  <span className={styles.bulletMark} aria-hidden="true">
                    →
                  </span>
                  <span>{bullet}</span>
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
