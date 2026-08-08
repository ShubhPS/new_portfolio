import { HudFrame, HudRule, HudTag } from "@/components/ui/Hud";
import styles from "./page.module.css";

const colors = [
  { name: "bg", token: "--color-bg", value: "#0a0a0a" },
  { name: "surface", token: "--color-surface", value: "#121213" },
  { name: "surface raised", token: "--color-surface-raised", value: "#17171a" },
  { name: "text", token: "--color-text", value: "#f2f2f0" },
  { name: "text dim", token: "--color-text-dim", value: "#9b9b96" },
  { name: "text faint", token: "--color-text-faint", value: "#5c5c58" },
  { name: "accent", token: "--color-accent", value: "#3d7cff" },
  { name: "line", token: "--color-line", value: "10% text" },
];

const spacing = [8, 16, 24, 32, 48, 64, 96, 128, 192];

export default function TokenSpecimen() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <HudRule label={<HudTag accent>design system</HudTag>} />
        <h1 className={styles.headerTitle}>Tokens</h1>
        <p className={styles.headerNote}>
          Every section built after this pulls from these values. Nothing
          downstream declares a raw hex, pixel, or easing curve of its own.
        </p>
      </header>

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <HudRule label={<HudTag index={1}>color</HudTag>} />
        </div>
        <div className={styles.swatches}>
          {colors.map((color) => (
            <div key={color.token} className={styles.swatch}>
              <div
                className={styles.swatchChip}
                style={{ background: `var(${color.token})` }}
              />
              <div className={styles.swatchMeta}>
                <span>{color.name}</span>
                <span className={styles.swatchValue}>{color.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <HudRule label={<HudTag index={2}>type</HudTag>} />
        </div>

        <div className={styles.typeRow}>
          <span className={styles.hudCellLabel}>hero — clash display 600</span>
          <span className={`${styles.typeSpecimen} ${styles.typeHero}`}>
            Alive
          </span>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.hudCellLabel}>display — section headline</span>
          <span className={`${styles.typeSpecimen} ${styles.typeDisplay}`}>
            Selected work
          </span>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.hudCellLabel}>title</span>
          <span className={`${styles.typeSpecimen} ${styles.typeTitle}`}>
            How I work
          </span>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.hudCellLabel}>lead — inter</span>
          <p className={styles.typeLead}>
            Motion is not decoration here. It is the argument the page makes.
          </p>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.hudCellLabel}>body — inter</span>
          <p className={styles.typeBody}>
            Body copy sits at a comfortable measure with generous leading, so
            that long-form writing in the process and experience sections stays
            readable against a near-black field. The dimmed tone keeps it a step
            below headline contrast without dropping under legibility.
          </p>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <HudRule label={<HudTag index={3}>spacing — 8px grid</HudTag>} />
        </div>
        <div>
          {spacing.map((value, i) => (
            <div key={value} className={styles.spaceRow}>
              <span className={styles.spaceLabel}>
                --space-{i + 1} / {value}
              </span>
              <span className={styles.spaceBar} style={{ width: value }} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <HudRule label={<HudTag index={4}>hud marks</HudTag>} />
        </div>
        <div className={styles.hudGrid}>
          <HudFrame className={styles.hudCell}>
            <span className={styles.hudCellLabel}>frame</span>
            <HudTag index={7}>project</HudTag>
          </HudFrame>
          <HudFrame active className={styles.hudCell}>
            <span className={styles.hudCellLabel}>frame — active</span>
            <HudTag accent>in view</HudTag>
          </HudFrame>
          <div className={styles.hudCell}>
            <span className={styles.hudCellLabel}>tag variants</span>
            <HudTag>plain</HudTag>
            <HudTag accent>accent</HudTag>
            <HudTag brackets={false}>no brackets</HudTag>
          </div>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <HudRule label={<HudTag index={5}>motion — hover to compare</HudTag>} />
        </div>
        <div className={styles.motionRow}>
          <span className={`${styles.motionChip} ${styles.motionSnap}`}>
            snap 280ms
          </span>
          <span className={`${styles.motionChip} ${styles.motionQuad}`}>
            ui 400ms
          </span>
          <span className={`${styles.motionChip} ${styles.motionScene}`}>
            scene 900ms
          </span>
        </div>
      </section>
    </main>
  );
}
