import React, { useRef, useState } from 'react';

/**
 * TiltedCard - ReactBits component
 * Smooth 3D tilt interaction with mouse movement and subtle specular shine
 */
export default function TiltedCard({
  children,
  maxTilt = 14,
  scale = 1.02,
  perspective = 900,
  glare = true,
  className = '',
  style = {}
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);

    if (glare) {
      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.18
      });
    }
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilted-card-wrapper ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform,
        transition: 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)',
        position: 'relative',
        borderRadius: '24px',
        ...style
      }}
    >
      {children}

      {glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glarePosition.opacity}), transparent 60%)`,
            transition: 'opacity 0.2s ease',
            zIndex: 10
          }}
        />
      )}
    </div>
  );
}
