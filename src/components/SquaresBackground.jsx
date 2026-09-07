import React, { useRef, useEffect } from 'react';

/**
 * Squares - ReactBits animated background component
 * Draws an infinite dynamic grid of squares with responsive cursor hover illumination
 */
export default function SquaresBackground({
  direction = 'right',
  speed = 0.5,
  borderColor = 'rgba(255, 255, 255, 0.05)',
  squareSize = 48,
  hoverFillColor = 'rgba(99, 102, 241, 0.15)',
  className = '',
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const gridOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Mouse smoothing (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      // Drift motion
      if (direction === 'right') {
        gridOffset.current.x = (gridOffset.current.x - speed + squareSize) % squareSize;
      } else if (direction === 'left') {
        gridOffset.current.x = (gridOffset.current.x + speed + squareSize) % squareSize;
      } else if (direction === 'up') {
        gridOffset.current.y = (gridOffset.current.y + speed + squareSize) % squareSize;
      } else if (direction === 'down') {
        gridOffset.current.y = (gridOffset.current.y - speed + squareSize) % squareSize;
      } else if (direction === 'diagonal') {
        gridOffset.current.x = (gridOffset.current.x - speed + squareSize) % squareSize;
        gridOffset.current.y = (gridOffset.current.y - speed + squareSize) % squareSize;
      }

      ctx.clearRect(0, 0, width, height);

      // Deep dark background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Ambient radial glow in center/mouse
      const ambientGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      ambientGrad.addColorStop(0, 'rgba(18, 18, 26, 0.95)');
      ambientGrad.addColorStop(0.6, 'rgba(10, 10, 14, 0.98)');
      ambientGrad.addColorStop(1, '#070709');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      // Cursor spotlight ambient glow
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const spotGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          260
        );
        spotGrad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
        spotGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, width, height);
      }

      const numCols = Math.ceil(width / squareSize) + 2;
      const numRows = Math.ceil(height / squareSize) + 2;

      const startX = (gridOffset.current.x % squareSize) - squareSize;
      const startY = (gridOffset.current.y % squareSize) - squareSize;

      // Draw squares
      for (let c = 0; c < numCols; c++) {
        for (let r = 0; r < numRows; r++) {
          const sqX = startX + c * squareSize;
          const sqY = startY + r * squareSize;

          const centerX = sqX + squareSize / 2;
          const centerY = sqY + squareSize / 2;

          const dist = Math.hypot(centerX - mouseRef.current.x, centerY - mouseRef.current.y);
          const maxDist = squareSize * 3.5;

          // If close to cursor, highlight the square
          if (dist < maxDist) {
            const intensity = Math.pow(1 - dist / maxDist, 1.8);
            ctx.fillStyle = hoverFillColor.replace(/[\d.]+\)$/g, `${(intensity * 0.35).toFixed(3)})`);
            ctx.fillRect(sqX, sqY, squareSize, squareSize);

            // Subtle glowing border for nearby squares
            ctx.strokeStyle = `rgba(165, 180, 252, ${(intensity * 0.45).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(sqX, sqY, squareSize, squareSize);
          } else {
            // Standard grid line
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(sqX, sqY, squareSize, squareSize);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    />
  );
}
