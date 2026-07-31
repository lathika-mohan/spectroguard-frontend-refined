import { useEffect, useRef, useState } from 'react';

export function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalFrames = 300;
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const isAnimatingRef = useRef(false);
  const ease = 0.07; // Easing value (lower = smoother, higher = faster)

  // Path generator for public/frames/ezgif-frame-001.jpg
  function getFramePath(index: number) {
    return `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Search for nearest loaded frame to prevent blank frames during progressive load
    function getClosestLoadedImage(index: number) {
      const images = imagesRef.current;
      if (images[index] && images[index].complete && images[index].naturalWidth !== 0) {
        return images[index];
      }

      let left = index - 1;
      let right = index + 1;
      while (left >= 1 || right <= totalFrames) {
        if (left >= 1 && images[left] && images[left].complete && images[left].naturalWidth !== 0) {
          return images[left];
        }
        if (right <= totalFrames && images[right] && images[right].complete && images[right].naturalWidth !== 0) {
          return images[right];
        }
        left--;
        right++;
      }
      return null;
    }

    // Draw image maintaining cover aspect ratio
    function drawFrame(index: number) {
      const img = getClosestLoadedImage(index);
      if (!img) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx!.clearRect(0, 0, w, h);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;

      let drawWidth, drawHeight, x, y;

      if (canvasRatio > imgRatio) {
        drawWidth = w;
        drawHeight = w / imgRatio;
        x = 0;
        y = (h - drawHeight) / 2;
      } else {
        drawWidth = h * imgRatio;
        drawHeight = h;
        x = (w - drawWidth) / 2;
        y = 0;
      }

      ctx!.drawImage(img, x, y, drawWidth, drawHeight);
    }

    // Resize canvas adapting to screen pixel ratio
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.resetTransform();
      ctx!.scale(dpr, dpr);

      drawFrame(Math.round(currentFrameRef.current));
    }

    // Render loop
    function tick() {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * ease;
        drawFrame(Math.round(currentFrameRef.current));
        requestAnimationFrame(tick);
      } else {
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(Math.round(currentFrameRef.current));
        isAnimatingRef.current = false;
      }
    }

    function startAnimationLoop() {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        requestAnimationFrame(tick);
      }
    }

    // Scroll listener mapping scroll progress to frame indexes
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = maxScroll <= 0 ? 0 : scrollTop / maxScroll;

      targetFrameRef.current = 1 + scrollFraction * (totalFrames - 1);
      startAnimationLoop();
    };

    // Load first frame immediately to draw something on screen right away
    const firstImg = new Image();
    firstImg.onload = () => {
      imagesRef.current[1] = firstImg;
      setLoadedCount(1);
      drawFrame(1);

      // Preload remaining frames in background
      for (let i = 2; i <= totalFrames; i++) {
        const img = new Image();
        img.onload = () => {
          imagesRef.current[i] = img;
          setLoadedCount(prev => prev + 1);
          if (Math.round(currentFrameRef.current) === i) {
            drawFrame(i);
          }
        };
        img.onerror = () => {
          console.warn(`Failed to load frame ${i}`);
          setLoadedCount(prev => prev + 1);
        };
        img.src = getFramePath(i);
      }
    };
    firstImg.src = getFramePath(1);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const progress = (loadedCount / totalFrames) * 100;
  const isLoaded = loadedCount === totalFrames;

  return (
    <>
      {/* Top thin loading progress bar that fades out once fully cached */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #0066FF, #8b5cf6)',
          width: `${progress}%`,
          zIndex: 9999,
          transition: 'width 0.1s ease, opacity 0.5s ease',
          opacity: isLoaded ? 0 : 0.85,
          pointerEvents: 'none',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'block',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

