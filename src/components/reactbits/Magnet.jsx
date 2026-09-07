import React, { useState, useEffect, useRef } from 'react';

/**
 * Magnet - ReactBits component
 * Attracts elements towards the mouse cursor within proximity
 */
export default function Magnet({
  children,
  padding = 60,
  magnetStrength = 0.35,
  active = true,
  className = '',
  style = {}
}) {
  const magnetRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e) => {
      if (!magnetRef.current) return;
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const threshold = Math.max(width, height) / 2 + padding;

      if (dist < threshold) {
        const dx = (e.clientX - centerX) * magnetStrength;
        const dy = (e.clientY - centerY) * magnetStrength;
        setPosition({ x: dx, y: dy });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [active, padding, magnetStrength]);

  return (
    <div
      ref={magnetRef}
      className={`magnet-wrapper ${className}`}
      style={{
        transform: `translate3d(${position.x.toFixed(1)}px, ${position.y.toFixed(1)}px, 0)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out',
        display: 'inline-block',
        ...style
      }}
    >
      {children}
    </div>
  );
}
