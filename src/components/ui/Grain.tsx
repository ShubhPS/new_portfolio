import styles from "./Grain.module.css";

/** Ambient film-grain layer (CLAUDE.md §4). Rendered once in the root layout. */
export default function Grain() {
  return <div className={styles.grain} aria-hidden="true" />;
}
