"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/animation-utils";
import styles from "./RetrievalField.module.css";

const TERMS = [
  "langgraph", "chromadb", "retrieval", "planner", "reviewer", "embeddings",
  "resnet50", "yolov3", "rerank", "chunking", "grounding", "tool-use",
  "fine-tune", "eval", "trace", "guardrail", "context", "vector", "rag",
  "prompt", "agent", "critic", "recall", "latency", "citation", "schema",
];

const NEIGHBOURS = 6;
const POINT_COUNT = 84;

type Point = { x: number; y: number; vx: number; vy: number; term: string };

/**
 * The thing the rest of the site talks about, made touchable: a 2-D stand-in
 * for an embedding space where the pointer is the query vector. Move it and
 * the nearest neighbours light up and connect — which is all retrieval is.
 *
 * Canvas rather than DOM: 84 nodes plus link lines redrawn per frame would be
 * 84 style recalculations a frame in the DOM, and this sits inside a pinned
 * ScrollTrigger that cannot afford them.
 */
export default function RetrievalField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitsRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let points: Point[] = [];

    // Deterministic scatter: the layout should be the same every visit, so it
    // reads as a fixed dataset rather than random noise.
    let seed = 20260809;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    // Cached so neither the pointer handler nor the frame loop reads layout.
    let box = wrap.getBoundingClientRect();
    const measure = () => {
      box = wrap.getBoundingClientRect();
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      measure();
      const rect = box;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seed = 20260809;
      points = Array.from({ length: POINT_COUNT }, (_, i) => ({
        x: random() * width,
        y: random() * height,
        vx: (random() - 0.5) * 0.16,
        vy: (random() - 0.5) * 0.16,
        term: TERMS[i % TERMS.length],
      }));
    };

    build();

    // Query starts centre-stage and drifts on its own until a pointer takes
    // over — on touch, the demo has to run itself.
    const query = { x: width * 0.5, y: height * 0.5, driven: false };
    let t = 0;

    const onMove = (event: PointerEvent) => {
      query.x = event.clientX - box.left;
      query.y = event.clientY - box.top;
      query.driven = true;
    };
    const onLeave = () => {
      query.driven = false;
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", measure, { passive: true });

    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(wrap);

    const draw = () => {
      t += 0.005;

      if (!query.driven) {
        query.x = width * (0.5 + Math.cos(t) * 0.26);
        query.y = height * (0.5 + Math.sin(t * 1.37) * 0.24);
      }

      if (!reducedMotion) {
        for (const p of points) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      const ranked = points
        .map((p) => ({ p, d: Math.hypot(p.x - query.x, p.y - query.y) }))
        .sort((a, b) => a.d - b.d);
      const hits = ranked.slice(0, NEIGHBOURS);
      const cutoff = hits[hits.length - 1]?.d ?? 1;

      ctx.clearRect(0, 0, width, height);

      for (const { p, d } of ranked) {
        const near = d <= cutoff;
        const fade = Math.max(0, 1 - d / (cutoff * 3.2));
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? 3.1 : 1.6, 0, Math.PI * 2);
        ctx.fillStyle = near
          ? "rgba(61,124,255,0.95)"
          : `rgba(242,242,240,${0.1 + fade * 0.22})`;
        ctx.fill();
      }

      hits.forEach(({ p, d }, i) => {
        const strength = 1 - d / (cutoff || 1);
        ctx.beginPath();
        ctx.moveTo(query.x, query.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(61,124,255,${0.13 + strength * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Only the closest few get labelled — six labels in a tight cluster
        // overlap into an unreadable smear.
        if (i < 3) {
          ctx.font =
            "500 10px ui-monospace, 'IBM Plex Mono', SFMono-Regular, monospace";
          ctx.fillStyle = `rgba(242,242,240,${0.4 + strength * 0.5})`;
          ctx.fillText(p.term, p.x + 8, p.y - 7);
        }
      });

      // Query marker
      ctx.beginPath();
      ctx.arc(query.x, query.y, 5.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(180,92,255,0.85)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(query.x, query.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(180,92,255,1)";
      ctx.fill();

      if (hitsRef.current) {
        hitsRef.current.textContent = hits[0]?.p.term ?? "";
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", measure);
    };
  }, [reducedMotion]);

  return (
    <div className={styles.field} ref={wrapRef}>
      <canvas className={styles.canvas} ref={canvasRef} />
      <div className={styles.legend}>
        <span>query · {NEIGHBOURS} nearest</span>
        <span className={styles.legendHit} ref={hitsRef} />
      </div>
      <div className={styles.caption}>
        <span className={styles.hint}>Move your cursor — this is retrieval</span>
      </div>
    </div>
  );
}
