import { useEffect, useRef } from 'react';

type SwarmParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const SwarmBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: SwarmParticle[] = [];
    let animationFrame = 0;
    let colors = { dot: 'rgba(0,0,0,0.4)', line: 'rgba(0,0,0,0.2)' };

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const dot = styles.getPropertyValue('--swarm-dot').trim();
      const line = styles.getPropertyValue('--swarm-line').trim();
      colors = {
        dot: dot || colors.dot,
        line: line || colors.line,
      };
    };

    const getParticleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      const isMobile = window.innerWidth < 768;
      const base = Math.round(area / (isMobile ? 18000 : 14000));
      return clamp(base, isMobile ? 24 : 40, isMobile ? 60 : 110);
    };

    const createParticles = () => {
      const count = getParticleCount();
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1 + Math.random() * 1.6,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
      drawFrame();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      const isMobile = window.innerWidth < 768;
      const maxDistance = isMobile ? 90 : 140;
      const maxDistanceSq = maxDistance * maxDistance;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > maxDistanceSq) continue;
          const alpha = 1 - distSq / maxDistanceSq;
          ctx.strokeStyle = colors.line;
          ctx.globalAlpha = 0.45 * alpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.dot;
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const step = () => {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;
      });
      drawFrame();
      animationFrame = window.requestAnimationFrame(step);
    };

    const handleResize = () => {
      resize();
    };

    const themeObserver = new MutationObserver(() => {
      readColors();
      drawFrame();
    });

    readColors();
    resize();

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    if (!prefersReduced) {
      animationFrame = window.requestAnimationFrame(step);
    }

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      themeObserver.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="swarm-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default SwarmBackground;
