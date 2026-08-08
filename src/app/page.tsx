import Hero from "@/components/sections/Hero";
import { HudRule, HudTag } from "@/components/ui/Hud";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Hero />
      <section className={styles.next} id="work">
        <HudRule label={<HudTag index={2}>projects</HudTag>} />
        <h2 className={styles.nextTitle}>Selected work</h2>
        <p className={styles.nextNote}>
          Placeholder landing zone for the hero&rsquo;s pin release. The real
          Projects section replaces this next.
        </p>
      </section>
    </>
  );
}
