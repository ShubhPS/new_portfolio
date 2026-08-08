"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, useReducedMotion } from "@/lib/animation-utils";
import { HudTag } from "@/components/ui/Hud";
import styles from "./Manifesto.module.css";

const statement = [
  { text: "A system", dim: false },
  { text: "you have to", dim: true },
  { text: "babysit", dim: false },
  { text: "isn't", dim: true },
  { text: "finished.", dim: false },
];

const support = [
  {
    label: "Autonomy",
    text: "The interesting problems start after the demo works once. Anything that needs me watching it is still a prototype.",
  },
  {
    label: "Judgement",
    text: "A model that is confidently wrong is worse than one that admits it does not know. I build the checking step first.",
  },
  {
    label: "Craft",
    text: "The output is read by a person. If it is accurate but unreadable, the pipeline has not done its job.",
  },
];

function useManifestoAnimation(reducedMotion: boolean) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const words = root.querySelectorAll<HTMLElement>("[data-word]");
      const items = root.querySelectorAll<HTMLElement>("[data-support]");

      if (reducedMotion) {
        gsap.from([words, items], {
          opacity: 0,
          duration: duration.ui,
          scrollTrigger: { trigger: root, start: "top 80%" },
        });
        return;
      }

      // Scrubbed rather than played: the sentence assembles at whatever pace
      // the reader scrolls, which is the point of putting it on a scroll.
      gsap.from(words, {
        yPercent: 105,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          end: "center center",
          scrub: 0.5,
        },
      });

      gsap.from(items, {
        opacity: 0,
        y: 26,
        duration: duration.ui,
        ease: ease.snap,
        stagger: 0.09,
        scrollTrigger: { trigger: items[0], start: "top 88%" },
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return rootRef;
}

export default function Manifesto() {
  const reducedMotion = useReducedMotion();
  const rootRef = useManifestoAnimation(reducedMotion);

  return (
    <section className={styles.manifesto} ref={rootRef} id="manifesto">
      <div className={styles.inner}>
        <p className={styles.statement}>
          {statement.map((chunk) => (
            <span key={chunk.text} className={styles.word}>
              <span
                className={`${styles.wordInner} ${chunk.dim ? styles.dim : ""}`}
                data-word
              >
                {chunk.text}
              </span>{" "}
            </span>
          ))}
        </p>

        <div className={styles.support}>
          {support.map((item) => (
            <div key={item.label} className={styles.supportItem} data-support>
              <HudTag accent brackets={false}>
                {item.label}
              </HudTag>
              <p className={styles.supportText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
