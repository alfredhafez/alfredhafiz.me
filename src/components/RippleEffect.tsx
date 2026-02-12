import { useEffect, useRef, useCallback } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

export default function RippleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  const colors = [
    'rgba(56, 189, 248, ',   // cyan
    'rgba(147, 51, 234, ',   // purple
    'rgba(236, 72, 153, ',   // pink
    'rgba(59, 130, 246, ',   // blue
  ];

  const createRipple = useCallback((x: number, y: number) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 100 + Math.random() * 150,
      opacity: 0.6,
      color,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastRippleTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastRippleTime > 50) { // Create ripple every 50ms
        createRipple(e.clientX, e.clientY);
        lastRippleTime = now;
      }
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      // Create multiple ripples on click
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createRipple(e.clientX, e.clientY);
        }, i * 100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 2;
        ripple.opacity -= 0.005;

        if (ripple.opacity <= 0) return false;

        // Draw gradient ripple
        const gradient = ctx.createRadialGradient(
          ripple.x, ripple.y, 0,
          ripple.x, ripple.y, ripple.radius
        );
        gradient.addColorStop(0, ripple.color + '0)');
        gradient.addColorStop(0.5, ripple.color + ripple.opacity * 0.5 + ')');
        gradient.addColorStop(1, ripple.color + '0)');

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw outer ring
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color + ripple.opacity + ')';
        ctx.lineWidth = 2;
        ctx.stroke();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createRipple]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
}
