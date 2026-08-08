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
    text: "The interesting problems start after the demo works once. A pipeline that needs me watching it is a prototype wearing a costume.",
    detail: "Scheduling, retries and the failure path ship with v1 — not after.",
  },
  {
    label: "Judgement",
    text: "A model that is confidently wrong does more damage than one that admits it does not know. So I write the critic before the generator.",
    detail: "Every run has something whose only job is to disagree with it.",
  },
  {
    label: "Craft",
    text: "The last mile is a person reading the output. Accurate and unreadable is still a failure, just a well-documented one.",
    detail: "If nobody opens it, the model was never the bottleneck.",
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

        <div className={styles.personal} data-support>
          <p className={styles.personalLead}>
            I did not come to this through a job description. I came to it
            because a system that behaves — that decides something, gets it
            wrong, and corrects itself — is the closest I have got to making
            something that feels alive.
          </p>
          <p className={styles.personalBody}>
            The stack will keep moving. Two years ago it was CNNs on MRI scans;
            now it is agents arguing with their own drafts. What has not moved
            is the part I actually want: to spend a career making things rather
            than maintaining them, and to still be surprised by what I build.
            Everything below is me checking whether that holds up under load.
          </p>
        </div>

        <div className={styles.support}>
          {support.map((item, i) => (
            <div key={item.label} className={styles.supportItem} data-support>
              <HudTag accent={i % 2 === 0} brackets={false}>
                {item.label}
              </HudTag>
              <p className={styles.supportText}>{item.text}</p>
              <p className={styles.supportDetail}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
