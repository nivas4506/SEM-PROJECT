import React, { useRef, useState } from 'react';

/**
 * Dock - ReactBits component
 * Floating interactive dock navigation with mouse proximity magnification
 */
export default function Dock({
  items = [],
  activeId = '',
  onSelect,
  className = '',
  style = {}
}) {
  const dockRef = useRef(null);
  const [mouseX, setMouseX] = useState(null);

  const handleMouseMove = (e) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <div
      ref={dockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`reactbits-dock ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: '24px',
        background: 'rgba(18, 18, 24, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        zIndex: 50,
        ...style
      }}
    >
      {items.map((item, index) => {
        const isActive = item.id === activeId;
        
        // Calculate magnification scale based on mouse distance
        let scale = 1;
        if (mouseX !== null) {
          const itemCenter = index * (48 + 12) + 24; // approximate center of icon
          const dist = Math.abs(mouseX - itemCenter);
          const maxDist = 120;
          if (dist < maxDist) {
            const proximity = 1 - dist / maxDist;
            scale = 1 + proximity * 0.38; // Max 1.38x scale
          }
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            title={item.label}
            className={`dock-item ${isActive ? 'active' : ''}`}
            style={{
              position: 'relative',
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(34, 211, 238, 0.25))' : 'rgba(255, 255, 255, 0.05)',
              border: isActive ? '1px solid rgba(34, 211, 238, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: isActive ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              transform: `scale(${scale})`,
              transformOrigin: 'bottom center',
              transition: mouseX === null ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease' : 'none'
            }}
          >
            {item.icon}

            {/* Active dot indicator */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#38bdf8',
                  boxShadow: '0 0 6px #38bdf8'
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
