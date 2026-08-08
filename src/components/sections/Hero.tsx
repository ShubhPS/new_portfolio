"use client";

import { Fragment, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { duration, ease, useReducedMotion } from "@/lib/animation-utils";
import { HudFrame, HudTag } from "@/components/ui/Hud";
import styles from "./Hero.module.css";

const agents = [
  { role: "Planner", desc: "Decides what the run needs, and in what order." },
  { role: "Reviewer", desc: "Argues with the draft until it survives its own sources." },
  { role: "Writer", desc: "Ships the thing a person actually reads." },
];

/**
 * Hero pin-and-transform (CLAUDE.md §5, signature moment 3).
 *
 * Two beats. On load the statement resolves line by line. On scroll the
 * section pins and the statement recedes while the pipeline underneath it
 * wipes in — the claim replaced by the machine that makes it true.
 */
function useHeroAnimation(reducedMotion: boolean) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const lines = root.querySelectorAll<HTMLElement>("[data-line]");
      const headline = root.querySelector<HTMLElement>("[data-headline]");
      const headlineWrap = root.querySelector<HTMLElement>("[data-headline-wrap]");
      const pipeline = root.querySelector<HTMLElement>("[data-pipeline]");
      const nodes = root.querySelectorAll<HTMLElement>(`.${styles.node}`);
      const cue = root.querySelector<HTMLElement>("[data-cue]");
      const bar = root.querySelector<HTMLElement>("[data-topbar]");
      const progressFill = root.querySelector<HTMLElement>("[data-progress-fill]");
      const progressValue = root.querySelector<HTMLElement>("[data-progress-value]");

      if (reducedMotion) {
        gsap.set([lines, pipeline, nodes, cue, bar], { clearProps: "all" });
        gsap.from(root, { opacity: 0, duration: duration.ui });
        return;
      }

      gsap.set(pipeline, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(nodes, { yPercent: 18, opacity: 0 });

      gsap
        .timeline({ defaults: { ease: ease.snap } })
        .from(bar, { opacity: 0, y: -12, duration: duration.ui })
        .from(
          lines,
          {
            yPercent: 108,
            duration: duration.scene,
            ease: "power3.out",
            stagger: 0.075,
          },
          0.05
        )
        .from(cue, { opacity: 0, duration: duration.ui }, "-=0.35");

      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=140%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          // Written straight to the DOM rather than through state — this
          // fires on every scroll frame and must not re-render React.
          onUpdate: (self) => {
            if (progressFill) {
              progressFill.style.transform = `scaleX(${self.progress})`;
            }
            if (progressValue) {
              progressValue.textContent = `${String(
                Math.round(self.progress * 100)
              ).padStart(2, "0")}%`;
            }
          },
        },
      });

      // The headline is centred in its wrapper at rest and has to end up
      // flush against the top of it. That distance is a layout fact, not a
      // fraction of the headline's own height — yPercent would drift badly
      // between a 52px mobile headline and a 144px desktop one. offsetHeight
      // is used because it ignores the scale transform being applied here.
      const liftToTop = () =>
        headlineWrap && headline
          ? -(headlineWrap.offsetHeight - headline.offsetHeight) / 2
          : 0;

      scrub
        .to(headline, { scale: 0.42, y: liftToTop, opacity: 0.9, ease: "none" }, 0)
        // fromTo, not to: on a reload that restores scroll mid-pin this tween
        // would otherwise capture the intro's opacity-0 as its start value and
        // strand the cue invisible.
        .fromTo(cue, { opacity: 1 }, { opacity: 0, ease: "none" }, 0)
        .to(pipeline, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0.05)
        .to(nodes, { yPercent: 0, opacity: 1, ease: "none", stagger: 0.08 }, 0.15);

      // next/font swaps after first paint; without this the pin is measured
      // against fallback-font metrics and lands a few pixels off.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return rootRef;
}

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const rootRef = useHeroAnimation(reducedMotion);

  return (
    <section
      className={`${styles.hero} ${reducedMotion ? styles.isStatic : ""}`}
      ref={rootRef}
      id="top"
    >
      <div className={styles.stage}>
        <div className={styles.topBar} data-topbar>
          <HudTag accent>Shubh Pratap Singh</HudTag>
          <div className={styles.readout}>
            <HudTag brackets={false}>pin</HudTag>
            <span className={styles.readoutTrack} aria-hidden="true">
              <span className={styles.readoutFill} data-progress-fill />
            </span>
            <span className={styles.readoutValue} data-progress-value>
              00%
            </span>
          </div>
        </div>

        <div className={styles.headlineWrap} data-headline-wrap>
          <h1 className={styles.headline} data-headline>
            <span className={styles.line}>
              <span className={styles.lineInner} data-line>
                Systems
              </span>
            </span>
            <span className={styles.line}>
              <span className={styles.lineInner} data-line>
                that run
              </span>
            </span>
            <span className={styles.line}>
              <span className={styles.lineInner} data-line>
                themselves
              </span>
            </span>
          </h1>
        </div>

        <div className={styles.pipeline} data-pipeline>
          <div className={styles.pipelineNodes}>
            {agents.map((agent, i) => (
              <Fragment key={agent.role}>
                {i > 0 && (
                  <span className={styles.connector} aria-hidden="true" />
                )}
                <HudFrame className={styles.node}>
                  <span className={styles.nodeRole}>{agent.role}</span>
                  <span className={styles.nodeDesc}>{agent.desc}</span>
                </HudFrame>
              </Fragment>
            ))}
          </div>
          <div className={styles.pipelineFoot}>
            <p className={styles.lead}>
              I build agentic AI pipelines — systems that plan their own work,
              argue with it, and{" "}
              <span className={styles.leadStrong}>
                finish it while I&rsquo;m asleep.
              </span>
            </p>
            <HudTag index={1}>hero</HudTag>
          </div>
        </div>

        <a className={styles.cue} href="#work" data-cue data-cursor="link">
          <span className={styles.cueTrack} aria-hidden="true" />
          <HudTag brackets={false} className={styles.cueLabel}>
            Scroll to work
          </HudTag>
        </a>
      </div>
    </section>
  );
}
