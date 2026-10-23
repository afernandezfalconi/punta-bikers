"use client";

import { useEffect, useRef, useState } from "react";

export const ws150Frames = [
  "/landing/ws150-360/ws150-azul-360-00.webp",
  "/landing/ws150-360/ws150-azul-360-01.webp",
  "/landing/ws150-360/ws150-azul-360-02.webp",
  "/landing/ws150-360/ws150-azul-360-03.webp",
  "/landing/ws150-360/ws150-azul-360-04.webp",
  "/landing/ws150-360/ws150-azul-360-05.webp",
  "/landing/ws150-360/ws150-azul-360-06.webp",
  "/landing/ws150-360/ws150-azul-360-07.webp",
  "/landing/ws150-360/ws150-azul-360-08.webp",
  "/landing/ws150-360/ws150-azul-360-09.webp",
  "/landing/ws150-360/ws150-azul-360-10.webp",
  "/landing/ws150-360/ws150-azul-360-11.webp",
  "/landing/ws150-360/ws150-azul-360-12.webp",
  "/landing/ws150-360/ws150-azul-360-13.webp",
  "/landing/ws150-360/ws150-azul-360-14.webp",
  "/landing/ws150-360/ws150-azul-360-15.webp",
  "/landing/ws150-360/ws150-azul-360-16.webp",
  "/landing/ws150-360/ws150-azul-360-17.webp",
  "/landing/ws150-360/ws150-azul-360-18.webp",
  "/landing/ws150-360/ws150-azul-360-19.webp",
  "/landing/ws150-360/ws150-azul-360-20.webp",
  "/landing/ws150-360/ws150-azul-360-21.webp",
  "/landing/ws150-360/ws150-azul-360-22.webp",
  "/landing/ws150-360/ws150-azul-360-23.webp",
];

export const d125Frames = [
  "/landing/d125-360/d125-360-00.webp",
  "/landing/d125-360/d125-360-01.webp",
  "/landing/d125-360/d125-360-02.webp",
  "/landing/d125-360/d125-360-03.webp",
  "/landing/d125-360/d125-360-04.webp",
  "/landing/d125-360/d125-360-05.webp",
  "/landing/d125-360/d125-360-06.webp",
  "/landing/d125-360/d125-360-07.webp",
  "/landing/d125-360/d125-360-08.webp",
  "/landing/d125-360/d125-360-09.webp",
  "/landing/d125-360/d125-360-10.webp",
  "/landing/d125-360/d125-360-11.webp",
  "/landing/d125-360/d125-360-12.webp",
  "/landing/d125-360/d125-360-13.webp",
  "/landing/d125-360/d125-360-14.webp",
  "/landing/d125-360/d125-360-15.webp",
  "/landing/d125-360/d125-360-16.webp",
  "/landing/d125-360/d125-360-17.webp",
  "/landing/d125-360/d125-360-18.webp",
  "/landing/d125-360/d125-360-19.webp",
  "/landing/d125-360/d125-360-20.webp",
  "/landing/d125-360/d125-360-21.webp",
  "/landing/d125-360/d125-360-22.webp",
  "/landing/d125-360/d125-360-23.webp",
];

export function SpinViewer({ frames = ws150Frames, alt, hint }: { frames?: string[]; alt: string; hint: string }) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const [hovering, setHovering] = useState(false);
  const drag = useRef<{ x: number; i: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const n = frames.length;
  const go = (i: number) => setIndex(((Math.round(i) % n) + n) % n);

  useEffect(() => {
    frames.forEach(src => { const im = new Image(); im.src = src; });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(true);
  }, [frames]);
  useEffect(() => {
    if (!auto || hovering) return;
    const id = window.setInterval(() => { if (!drag.current) setIndex(i => (i + 1) % n); }, 700);
    return () => window.clearInterval(id);
  }, [auto, hovering, n]);

  function followPointer(clientX: number) {
    const rect = stage.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 0.999);
    go(ratio * n);
  }

  return <div ref={stage} className="spin-viewer" role="slider" tabIndex={0} aria-label={alt} aria-valuemin={0} aria-valuemax={345} aria-valuenow={index * 15} aria-valuetext={`${index * 15}°`}
    onPointerEnter={() => setHovering(true)}
    onPointerLeave={() => { setHovering(false); drag.current = null; }}
    onPointerDown={e => { if (e.button !== 0) return; setAuto(false); drag.current = { x: e.clientX, i: index }; e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={e => { if (drag.current) go(drag.current.i - (e.clientX - drag.current.x) / 14); else if (e.pointerType === "mouse") followPointer(e.clientX); }}
    onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
    onKeyDown={e => { if (e.key === "ArrowRight") { setAuto(false); go(index + 1); } if (e.key === "ArrowLeft") { setAuto(false); go(index - 1); } }}>
    <img src={frames[index]} alt="" width={1200} height={800} draggable={false} />
    <span className="spin-badge">360° · {hint}</span>
  </div>;
}
