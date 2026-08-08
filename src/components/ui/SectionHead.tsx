import type { ReactNode } from "react";
import { HudRule, HudTag } from "./Hud";
import styles from "./SectionHead.module.css";

type SectionHeadProps = {
  /** Position in the scroll narrative — the order is real, so it is labelled. */
  index: number;
  label: string;
  title: ReactNode;
  note?: ReactNode;
};

export default function SectionHead({
  index,
  label,
  title,
  note,
}: SectionHeadProps) {
  return (
    <div className={styles.head}>
      <HudRule label={<HudTag index={index}>{label}</HudTag>} />
      <h2 className={styles.title}>{title}</h2>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
