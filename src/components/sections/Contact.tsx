"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, useReducedMotion } from "@/lib/animation-utils";
import { HudFrame, HudTag } from "@/components/ui/Hud";
import SectionHead from "@/components/ui/SectionHead";
import styles from "./Contact.module.css";

const links = [
  {
    label: "shubhpsingh2616@gmail.com",
    href: "mailto:shubhpsingh2616@gmail.com",
    meta: "Email",
  },
  {
    label: "linkedin.com/in/shubhpsingh",
    href: "https://linkedin.com/in/shubhpsingh",
    meta: "LinkedIn",
  },
  {
    label: "github.com/ShubhPS",
    href: "https://github.com/ShubhPS",
    meta: "GitHub",
  },
];

export default function Contact() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Only the pitch moves. The links themselves are never animated in —
      // a contact link that fades on scroll is a contact link you can miss.
      gsap.from(root.querySelector("[data-pitch]"), {
        opacity: 0,
        y: reducedMotion ? 0 : 30,
        duration: reducedMotion ? duration.ui : duration.scene,
        ease: ease.snap,
        scrollTrigger: { trigger: root, start: "top 78%" },
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return (
    <footer className={styles.contact} ref={rootRef} id="contact">
      <div className={styles.inner}>
        <SectionHead
          index={5}
          label="contact"
          title={<span data-pitch>Bring me a process nobody wants to run</span>}
          note="Open to internships and collaboration on agentic systems, retrieval and applied ML."
        />

        <div className={styles.body}>
          <div>
            <HudFrame className={styles.portrait}>
              <Image
                className={styles.portraitImage}
                src="/images/professionalpic.jpg"
                alt="Shubh Pratap Singh"
                fill
                sizes="(max-width: 780px) 260px, 320px"
              />
              <span className={styles.portraitTint} aria-hidden="true" />
            </HudFrame>
            <div className={styles.portraitCaption}>
              <HudTag accent brackets={false}>
                Shubh Pratap Singh
              </HudTag>
              <HudTag brackets={false}>2026</HudTag>
            </div>
          </div>

          <div className={styles.links}>
            {links.map((link) => (
              <a
                key={link.href}
                className={styles.link}
                href={link.href}
                data-cursor="link"
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
              >
                <span className={styles.linkLabel}>{link.label}</span>
                <span className={styles.linkMeta}>{link.meta}</span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.foot}>
          <HudTag brackets={false}>Navi Mumbai, India</HudTag>
          <span>Built with Next.js and GSAP.</span>
        </div>
      </div>
    </footer>
  );
}
