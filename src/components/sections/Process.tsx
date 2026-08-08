"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, useReducedMotion } from "@/lib/animation-utils";
import { HudTag } from "@/components/ui/Hud";
import SectionHead from "@/components/ui/SectionHead";
import styles from "./Process.module.css";

/** Ordered because the order is real — each step depends on the one above it. */
const steps = [
  {
    title: "Find the boring failure",
    body: "Before any modelling, I go looking for where the current process actually breaks — usually a person re-typing something a machine already knows. That is the thing worth automating, not the part that demos well.",
  },
  {
    title: "Build the checking step first",
    body: "A generator without a critic is a confident liar. I write the reviewer before the writer, so there is something to fail against from the first run rather than a rubric bolted on later.",
  },
  {
    title: "Make it run unattended",
    body: "Anything that needs a human to kick it off is a prototype. Scheduling, retries and the failure path are part of the build, not a follow-up ticket.",
  },
  {
    title: "Measure what a person felt",
    body: "Accuracy is table stakes. What I check is whether the output changed someone's behaviour — did they open it, read it, act on it. If not, the pipeline works and the product does not.",
  },
];

function useProcessAnimation(reducedMotion: boolean) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const rows = root.querySelectorAll<HTMLElement>("[data-step]");

      rows.forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: reducedMotion ? 0 : 28,
          duration: reducedMotion ? duration.ui : duration.scene,
          ease: ease.snap,
          scrollTrigger: { trigger: row, start: "top 86%" },
        });
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return rootRef;
}

export default function Process() {
  const reducedMotion = useReducedMotion();
  const rootRef = useProcessAnimation(reducedMotion);

  return (
    <section className={styles.process} ref={rootRef} id="process">
      <SectionHead
        index={3}
        label="process"
        title="How the work actually goes"
        note="Four steps, in this order, because each one only makes sense once the one before it holds."
      />

      <div className={styles.steps}>
        {steps.map((step, i) => (
          <article key={step.title} className={styles.step} data-step>
            <div className={styles.stepLeft}>
              <HudTag index={i + 1} accent brackets={false}>
                step
              </HudTag>
              <h3 className={styles.stepTitle}>{step.title}</h3>
            </div>
            <p className={styles.stepBody}>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
