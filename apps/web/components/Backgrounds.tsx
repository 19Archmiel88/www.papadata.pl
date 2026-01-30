import React, { useRef, useEffect } from 'react';

// --- AURORA BACKGROUND UTILS ---

const NOISE_SVG_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-light-bg dark:bg-dark-bg transition-colors duration-700">
      <div
        className="aurora-blob absolute w-[700px] h-[700px] top-[-10%] left-[-10%] bg-[#4E26E2] dark:bg-[#4E26E2] opacity-20 dark:opacity-20 animate-float will-change-transform blur-3xl rounded-full"
        style={{ animationDuration: '25s' }}
      />
      <div
        className="aurora-blob absolute w-[600px] h-[600px] bottom-[-20%] right-[-10%] bg-[#4285F4] dark:bg-[#4285F4] opacity-20 dark:opacity-15 animate-float will-change-transform blur-3xl rounded-full"
        style={{ animationDuration: '30s', animationDelay: '2s' }}
      />
      <div
        className="aurora-blob absolute w-[500px] h-[500px] top-[40%] left-[20%] bg-[#6366f1] dark:bg-[#6366f1] opacity-15 dark:opacity-10 animate-float will-change-transform blur-3xl rounded-full"
        style={{ animationDuration: '35s', animationDelay: '5s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{ backgroundImage: NOISE_SVG_DATA_URI }}
      />
    </div>
  );
};

// --- NEURAL BACKGROUND UTILS & TYPES ---

interface ColorConfig {
  dot: string;
  connect: string;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  density: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 2 + 0.5;
    this.density = Math.random() * 30 + 1;
  }

  update(width: number, height: number, mouseX: number, mouseY: number) {
    this.x += this.vx;
    this.y += this.vy;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distSq = dx * dx + dy * dy;
    const maxDist = 200;

    if (distSq < maxDist * maxDist) {
      const distance = Math.sqrt(distSq);
      if (distance > 0.0001) {
        const force = (maxDist - distance) / maxDist;
        const directionX = (dx / distance) * force * this.density;
        const directionY = (dy / distance) * force * this.density;
        this.x -= directionX * 0.03;
        this.y -= directionY * 0.03;
      }
    }

    // wrap-around
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  // draw(ctx: CanvasRenderingContext2D, color: string) {
  //   ctx.fillStyle = color;
  //   ctx.beginPath();
  //   ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  //   ctx.fill();
  // }
}

export const NeuralBackground: React.FC<{ theme: string }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Kolory w refie, aby pętla animacji nie zależała od re-renderów
  const colorsRef = useRef<ColorConfig>({ dot: '', connect: '' });

  // Aktualizacja kolorów (reaguje na zmianę theme)
  useEffect(() => {
    const isDark = theme === 'dark';
    colorsRef.current = {
      dot: isDark ? 'rgba(78, 38, 226, 0.4)' : 'rgba(78, 38, 226, 0.15)',
      connect: isDark ? 'rgba(66, 133, 244, 0.12)' : 'rgba(66, 133, 244, 0.06)',
    };
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Enterprise: szanuj reduced-motion
    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let reduceMotion = Boolean(reduceMotionQuery?.matches);

    const handleReduceMotionChange = () => {
      reduceMotion = Boolean(reduceMotionQuery?.matches);
    };

    reduceMotionQuery?.addEventListener?.('change', handleReduceMotionChange);

    // Enterprise: pauza gdy karta niewidoczna
    let isVisible = typeof document !== 'undefined' ? !document.hidden : true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      // szybki refresh "defaults" po powrocie
      if (isVisible) {
        mouse.current.x = width / 2;
        mouse.current.y = height / 2;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const clampDpr = (v: number) => Math.max(1, Math.min(2, v || 1));

    const ensureMouseDefaults = () => {
      if (mouse.current.x === 0 && mouse.current.y === 0) {
        mouse.current.x = width / 2;
        mouse.current.y = height / 2;
      }
    };

    const initParticles = () => {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 40 : 90;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const performResize = () => {
      dpr = clampDpr(window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // po resize ustawiamy sensowny "mouse center"
      mouse.current.x = width / 2;
      mouse.current.y = height / 2;

      initParticles();
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(performResize, 200);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handlePointerLeave = () => {
      mouse.current.x = width / 2;
      mouse.current.y = height / 2;
    };

    const animate = () => {
      // Pauza bez renderu: hidden tab / reduced-motion
      if (!isVisible || reduceMotion) {
        animationId = window.requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const currentColors = colorsRef.current;
      const connectDistSq = 120 * 120;

      ensureMouseDefaults();

      // 1. Update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height, mouse.current.x, mouse.current.y);
      }

      // 2. Batch Draw Lines (⚡ Bolt optimization: batch stroke calls)
      ctx.beginPath();
      ctx.strokeStyle = currentColors.connect;
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectDistSq) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
          }
        }
      }
      ctx.stroke();

      // 3. Batch Draw Dots (⚡ Bolt optimization: batch fill calls)
      ctx.beginPath();
      ctx.fillStyle = currentColors.dot;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();

      animationId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    performResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reduceMotionQuery?.removeEventListener?.('change', handleReduceMotionChange);

      window.cancelAnimationFrame(animationId);
      particles = [];
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
  );
};
