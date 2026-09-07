import React, { useRef, useEffect } from 'react';
import oceanGradientImg from '../assets/ocean-gradient.jpg';

/**
 * SilkGradientBackground - Recreates the exact deep cyan and midnight blue
 * silk wave gradient from the user's screenshot with interactive lighting & grain.
 */
export default function SilkGradientBackground() {
  const lightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!lightRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      lightRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(34, 211, 238, 0.14) 0%, rgba(6, 182, 212, 0.04) 40%, transparent 70%)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      {/* High-fidelity silk gradient image */}
      <img
        src={oceanGradientImg || "/ocean-gradient.jpg"}
        alt="Background Gradient"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'brightness(0.96) contrast(1.06)',
          transform: 'scale(1.02)'
        }}
      />

      {/* Atmospheric depth vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3, 7, 18, 0.5) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Interactive mouse light sheen */}
      <div
        ref={lightRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 60% 40%, rgba(34, 211, 238, 0.1) 0%, transparent 65%)',
          transition: 'background 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none'
        }}
      />

      {/* Subtle organic noise/grain texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
