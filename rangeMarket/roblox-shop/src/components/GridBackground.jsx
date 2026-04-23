import { useEffect, useRef, useState } from 'react';

export default function GridBackground() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * 3 * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight * 3 + 'px';
      ctx.scale(dpr, dpr);
    };

    const particles = [];
    const particleCount = isMobile ? 20 : 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 3,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = (currentTime) => {
      animationId = requestAnimationFrame(draw);
      
      const delta = currentTime - lastTime;
      if (delta < frameInterval) return;
      lastTime = currentTime - (delta % frameInterval);

      const width = window.innerWidth;
      const height = window.innerHeight * 3;
      
      ctx.clearRect(0, 0, width, height);
      
      const gridSize = isMobile ? 60 : 80;
      const cols = Math.ceil(width / gridSize) + 1;
      const rows = Math.ceil(height / gridSize) + 1;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= cols; i++) {
        const x = i * gridSize;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let j = 0; j <= rows; j++) {
        const y = j * gridSize;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const dotStep = isMobile ? 2 : 1;
      for (let i = 0; i <= cols; i += dotStep) {
        for (let j = 0; j <= rows; j += dotStep) {
          const x = i * gridSize;
          const y = j * gridSize;
          
          const pulse = Math.sin(time * 0.02 + i * 0.5 + j * 0.3) * 0.5 + 0.5;
          const opacity = 0.02 + pulse * 0.06;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, isMobile ? 1.5 : 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      particles.forEach(p => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        
        const flicker = Math.sin(time * 0.05 + p.x) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * flicker})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!isMobile) {
        const scanLineY = (time * 0.5) % height;
        const gradient = ctx.createLinearGradient(0, scanLineY - 100, 0, scanLineY + 100);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanLineY - 100, width, 200);
      }

      time++;
    };

    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
