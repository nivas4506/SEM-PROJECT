import React, { useRef, useState } from 'react';

/**
 * SpotlightCard - ReactBits component
 * Renders an interactive card with cursor-following radial spotlight highlight
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(34, 211, 238, 0.18)',
  borderColor = 'rgba(34, 211, 238, 0.45)',
  style = {},
  onClick
}) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleFocus = () => setOpacity(1);
  const handleBlur = () => setOpacity(0);
  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#131317',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s ease, transform 0.15s ease',
        ...style
      }}
    >
      {/* Radial highlight layer */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: -1,
          opacity: opacity,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
          zIndex: 1
        }}
      />

      {/* Border glow layer */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity: opacity,
          transition: 'opacity 0.25s ease',
          borderRadius: 'inherit',
          padding: '1px',
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, ${borderColor}, transparent 60%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: 2
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
