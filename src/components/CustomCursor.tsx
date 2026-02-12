import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  life: number;
}

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailIdRef = useRef(0);
  const rafIdRef = useRef<number>();
  const lastUpdateRef = useRef(0);
  const mousePosRef = useRef({ x: -100, y: -100 });
  
  // Much smoother spring configuration
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Softer spring for smoother following
  const springConfig = { 
    damping: 30,  // Increased for less bounce
    stiffness: 400, // Reduced for smoother movement
    mass: 0.8,    // Added mass for inertia
    restDelta: 0.001 // Precise rest state
  };
  
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Use RAF for smooth updates
  const updateTrail = useCallback(() => {
    const now = performance.now();
    
    // Update trail at 60fps max
    if (now - lastUpdateRef.current >= 16) {
      setTrail(prev => {
        // Add new point if mouse moved
        if (mousePosRef.current.x > 0) {
          const newPoint: TrailPoint = { 
            x: mousePosRef.current.x, 
            y: mousePosRef.current.y, 
            id: trailIdRef.current++,
            life: 1.0
          };
          return [...prev.slice(-12), newPoint];
        }
        return prev;
      });
      lastUpdateRef.current = now;
    }
    
    rafIdRef.current = requestAnimationFrame(updateTrail);
  }, []);

  useEffect(() => {
    // Start RAF loop
    rafIdRef.current = requestAnimationFrame(updateTrail);
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateTrail]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      setIsVisible(false);
      mousePosRef.current = { x: -100, y: -100 };
    };
    const handleMouseEnter = () => setIsVisible(true);

    // Passive listener for better performance
    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  // Fade out trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => 
        prev
          .map(point => ({ ...point, life: point.life - 0.08 }))
          .filter(point => point.life > 0)
      );
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  // Hide custom cursor on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Trail particles - optimized rendering */}
      {trail.map((point, index) => {
        const scale = point.life * (0.5 + (index / trail.length) * 0.5);
        const opacity = point.life * 0.6;
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: point.x - 6,
              top: point.y - 6,
              width: 12,
              height: 12,
              opacity: opacity,
              transform: `scale(${scale})`,
              background: `radial-gradient(circle, rgba(56,189,248,${point.life}) 0%, rgba(147,51,234,${point.life * 0.6}) 50%, transparent 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${15 * point.life}px ${8 * point.life}px rgba(56,189,248,${point.life * 0.4})`,
              mixBlendMode: 'screen',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
      
      {/* Main cursor dot with glow */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            scale: isClicking ? 0.7 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 25,
            mass: 0.5
          }}
          style={{
            width: 14,
            height: 14,
            background: 'radial-gradient(circle at 30% 30%, #60a5fa, #3b82f6, #7c3aed)',
            boxShadow: `
              0 0 10px 2px rgba(59, 130, 246, 0.8),
              0 0 20px 5px rgba(59, 130, 246, 0.5),
              0 0 40px 10px rgba(124, 58, 237, 0.3),
              inset 0 0 6px rgba(255, 255, 255, 0.5)
            `,
            willChange: 'transform',
          }}
        />
      </motion.div>
      
      {/* Outer ring - follows with delay */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            scale: isClicking ? 1.3 : [1, 1.1, 1],
            opacity: isVisible ? [0.4, 0.6, 0.4] : 0,
            rotate: [0, 180, 360],
          }}
          transition={{ 
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 20
            },
            opacity: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          style={{
            width: 45,
            height: 45,
            border: '2px solid rgba(56, 189, 248, 0.4)',
            boxShadow: `
              inset 0 0 15px rgba(56, 189, 248, 0.2),
              0 0 20px rgba(56, 189, 248, 0.2)
            `,
            willChange: 'transform, opacity',
          }}
        />
      </motion.div>

      {/* Additional glow ring */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            scale: isClicking ? 1.5 : [1.2, 1.4, 1.2],
            opacity: isVisible ? [0.2, 0.3, 0.2] : 0,
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: 80,
            height: 80,
            border: '1px solid rgba(147, 51, 237, 0.2)',
            willChange: 'transform, opacity',
          }}
        />
      </motion.div>
    </>
  );
}
