import type { ReactNode } from "react";
import styles from "./Hud.module.css";

/**
 * Technical HUD marks (CLAUDE.md §4). Scatter these deliberately on
 * section labels and project cards — the motif dies if it goes everywhere.
 */

type HudTagProps = {
  children: ReactNode;
  /** Only pass where the ordering is real information, not decoration. */
  index?: number;
  accent?: boolean;
  brackets?: boolean;
  className?: string;
};

export function HudTag({
  children,
  index,
  accent = false,
  brackets = true,
  className,
}: HudTagProps) {
  return (
    <span
      className={[styles.tag, accent ? styles.tagAccent : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {brackets && (
        <span className={styles.tagBracket} aria-hidden="true">
          [
        </span>
      )}
      {index !== undefined && (
        <span className={styles.tagIndex}>
          {String(index).padStart(2, "0")}
        </span>
      )}
      {children}
      {brackets && (
        <span className={styles.tagBracket} aria-hidden="true">
          ]
        </span>
      )}
    </span>
  );
}

type HudRuleProps = {
  label?: ReactNode;
  reverse?: boolean;
  className?: string;
};

export function HudRule({ label, reverse = false, className }: HudRuleProps) {
  return (
    <div
      className={[styles.rule, reverse ? styles.ruleReverse : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
      <span className={styles.ruleLine} aria-hidden="true" />
    </div>
  );
}

type HudFrameProps = {
  children: ReactNode;
  /** Push the brackets outside the element's own box. */
  inset?: boolean;
  active?: boolean;
  className?: string;
};

export function HudFrame({
  children,
  inset = false,
  active = false,
  className,
}: HudFrameProps) {
  return (
    <div
      className={[
        styles.frame,
        inset ? styles.frameInset : "",
        active ? styles.frameActive : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
