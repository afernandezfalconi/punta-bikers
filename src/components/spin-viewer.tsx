import { useEffect, useRef, useState } from "react";

const wsModules = import.meta.glob<{ url: string }>("@/assets/ws150-360/*.asset.json", { eager: true, import: "default" });
export const ws150Frames = Object.keys(wsModules).sort().map(k => wsModules[k]!.url);

const d125Modules = import.meta.glob<{ url: string }>("@/assets/d125-360/*.asset.json", { eager: true, import: "default" });
export const d125Frames = Object.keys(d125Modules).sort().map(k => d125Modules[k]!.url);

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
