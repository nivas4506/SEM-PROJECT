import React from 'react';

/**
 * ShinyText - ReactBits text animation component
 * Shimmering metallic reflective gradient traversing across text
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = '',
  style = {}
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 70%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        display: 'inline-block',
        animation: disabled ? 'none' : `shine ${animationDuration} linear infinite`,
        color: '#ffffff',
        ...style
      }}
    >
      {text}
    </span>
  );
}
