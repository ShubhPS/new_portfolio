"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/animation-utils";
import styles from "./Scene3D.module.css";

const NODE_COUNT = 132;
const NEIGHBOUR_LINKS = 3;

type Vec3 = { x: number; y: number; z: number };

/**
 * A rotating node graph in real 3D — points distributed on a sphere, linked to
 * their nearest neighbours, projected by hand each frame.
 *
 * Hand-rolled rather than Three.js on purpose: this is ~130 points and ~390
 * edges, which canvas 2-D draws comfortably, and pulling in a WebGL engine
 * would cost more transfer than the entire rest of the page against the
 * Lighthouse budget in §8.
 */
export default function Scene3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fibonacci sphere: even coverage without the clustering at the poles that
    // naive spherical random sampling produces.
    const nodes: Vec3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      nodes.push({
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius,
      });
    }

    // Edges computed once — the graph is rigid, only the camera moves.
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 }))
        .filter((entry) => entry.j !== i)
        .sort((p, q) => p.d - q.d)
        .slice(0, NEIGHBOUR_LINKS);
      for (const { j } of near) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, j]);
        }
      }
    });

    let size = 0;
    let raf = 0;
    let yaw = 0.6;
    let pitch = -0.25;
    let targetYaw = yaw;
    let targetPitch = pitch;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      size = Math.min(rect.width, rect.height);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      targetYaw = 0.6 + nx * 1.6;
      targetPitch = -0.25 + ny * 1.1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const projected = nodes.map(() => ({ x: 0, y: 0, z: 0, scale: 1 }));

    const render = () => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const radius = size * 0.36;

      if (!reducedMotion) targetYaw += 0.0022;
      // Ease toward the pointer instead of snapping to it.
      yaw += (targetYaw - yaw) * 0.06;
      pitch += (targetPitch - pitch) * 0.06;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const x1 = n.x * cosY - n.z * sinY;
        const z1 = n.x * sinY + n.z * cosY;
        const y2 = n.y * cosP - z1 * sinP;
        const z2 = n.y * sinP + z1 * cosP;
        const perspective = 2.6 / (2.6 + z2);
        projected[i].x = cx + x1 * radius * perspective;
        projected[i].y = cy + y2 * radius * perspective;
        projected[i].z = z2;
        projected[i].scale = perspective;
      }

      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const [i, j] of edges) {
        const a = projected[i];
        const b = projected[j];
        const depth = (a.z + b.z) / 2;
        const alpha = 0.05 + Math.max(0, (1 - depth) / 2) * 0.16;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(140,170,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Painter's algorithm — far points first so near ones sit on top.
      const order = projected
        .map((p, i) => ({ p, i }))
        .sort((a, b) => b.p.z - a.p.z);

      for (const { p, i } of order) {
        const near = (1 - p.z) / 2;
        const r = (1.1 + near * 2.4) * p.scale;
        // Violet in the far field, electric blue as points come forward.
        const mix = Math.max(0, Math.min(1, near));
        const red = Math.round(180 - mix * 119);
        const green = Math.round(92 + mix * 32);
        const blue = 255;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.4, r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${red},${green},${blue},${0.25 + near * 0.7})`;
        ctx.fill();

        if (i % 17 === 0 && near > 0.55) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 4.5 * p.scale, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(61,124,255,${0.12 + near * 0.2})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reducedMotion]);

  return (
    <div className={styles.scene} ref={wrapRef}>
      <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
      <span className={styles.tag}>Move to steer</span>
    </div>
  );
}
