import { useEffect, useRef } from "react";

const CELL = 22;
const PULSE_COUNT = 14;

type Pulse = { col: number; row: number; life: number; span: number };

/** Grid of hairline cells with cells lighting up and fading. Pure canvas, no library. */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let pulses: Pulse[] = [];
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
    };

    const seed = (): Pulse => ({
      col: Math.floor(Math.random() * cols),
      row: Math.floor(Math.random() * rows),
      life: Math.random(),
      span: 1 + Math.floor(Math.random() * 3),
    });

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255,255,255,0.055)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        ctx.moveTo(c * CELL + 0.5, 0);
        ctx.lineTo(c * CELL + 0.5, height);
      }
      for (let r = 0; r <= rows; r++) {
        ctx.moveTo(0, r * CELL + 0.5);
        ctx.lineTo(width, r * CELL + 0.5);
      }
      ctx.stroke();

      for (const p of pulses) {
        const alpha = Math.sin(p.life * Math.PI) * 0.5;
        if (alpha <= 0) continue;
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fillRect(p.col * CELL + 1, p.row * CELL + 1, CELL * p.span - 1, CELL - 1);
      }
    };

    const tick = () => {
      for (const p of pulses) {
        p.life += 0.004;
        if (p.life >= 1) Object.assign(p, seed(), { life: 0 });
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    pulses = Array.from({ length: PULSE_COUNT }, seed);

    if (reduced) {
      for (const p of pulses) p.life = 0.35;
      draw();
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => {
      resize();
      pulses = Array.from({ length: PULSE_COUNT }, seed);
      if (reduced) draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="h-full w-full"
    />
  );
}
