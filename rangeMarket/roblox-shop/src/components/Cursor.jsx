import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    const dot = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf;

    const move = (e) => { mx = e.clientX; my = e.clientY; };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.14);
      ry = lerp(ry, my, 0.14);
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    document.addEventListener('mousemove', move);

    // Hover effects
    const onEnter = () => {
      dot.style.width = '12px';
      dot.style.height = '12px';
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(200,255,0,0.6)';
    };
    const onLeave = () => {
      dot.style.width = '8px';
      dot.style.height = '8px';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(245,245,240,0.4)';
    };

    const clickables = document.querySelectorAll('a,button,[role="button"],label,.game-card,.pass-row,.faq-q');
    clickables.forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', move);
      clickables.forEach(el => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); });
    };
  }, []);

  return (
    <>
      <div id="cursor" />
      <div id="cursor-ring" />
    </>
  );
}
