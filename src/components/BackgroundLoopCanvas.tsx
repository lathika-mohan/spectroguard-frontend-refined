import React, { useEffect, useRef, useState } from 'react';

const totalFrames = 240;
const framesDirectory = '/DASH CONTENT'; // Serves through Vite middleware mapping to DASH CONTENT
const crossfadeFrames = 15;
const playbackFps = 30;
const frameDurationMs = 1000 / playbackFps;

export function BackgroundLoopCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Helper to generate the correct frame path
  function getFramePath(index: number) {
    const paddedIndex = index.toString().padStart(3, '0');
    return `${framesDirectory}/ezgif-frame-${paddedIndex}.jpg`;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper to draw a single frame to the canvas
    function drawSingleFrame(img: HTMLImageElement, w: number, h: number) {
      if (!img || !img.complete || img.naturalWidth === 0) return;

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

    // Draw the image onto the canvas with a smooth crossfade at the loop boundary
    function drawFrame(frameIndex: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx!.clearRect(0, 0, w, h);

      const crossfadeZoneStart = totalFrames - crossfadeFrames;
      const images = imagesRef.current;

      if (frameIndex >= crossfadeZoneStart) {
        const progress = (frameIndex - crossfadeZoneStart) / crossfadeFrames;
        const nextFrameIndex = frameIndex - crossfadeZoneStart;

        const imgCurrent = images[frameIndex];
        const imgNext = images[nextFrameIndex];

        ctx!.globalAlpha = 1 - progress;
        drawSingleFrame(imgCurrent, w, h);

        ctx!.globalAlpha = progress;
        drawSingleFrame(imgNext, w, h);

        ctx!.globalAlpha = 1.0;
      } else {
        ctx!.globalAlpha = 1.0;
        const imgCurrent = images[frameIndex];
        drawSingleFrame(imgCurrent, w, h);
      }
    }

    // Adjust canvas resolution for high-DPI screens
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      
      ctx!.resetTransform();
      ctx!.scale(dpr, dpr);

      // Re-draw current frame immediately on resize
      if (startTimeRef.current !== null) {
        const elapsed = performance.now() - startTimeRef.current;
        const currentFrameIndex = Math.floor(elapsed / frameDurationMs) % totalFrames;
        drawFrame(currentFrameIndex);
      } else {
        drawFrame(0);
      }
    }

    // Animation tick loop using high precision timestamps
    function tick(timestamp: number) {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const currentFrameIndex = Math.floor(elapsed / frameDurationMs) % totalFrames;

      drawFrame(currentFrameIndex);

      animationFrameIdRef.current = requestAnimationFrame(tick);
    }

    // Start preloading all 240 frames
    let loaded = 0;
    const preloadedImages: HTMLImageElement[] = [];

    // Safety Timeout: Force reveal dashboard after 2.5 seconds regardless of frame preload status
    const safetyTimeout = setTimeout(() => {
      setIsLoaded((currentIsLoaded) => {
        if (!currentIsLoaded) {
          console.warn("Preloader safety timeout triggered. Forcing page reveal.");
          imagesRef.current = preloadedImages;
          resizeCanvas();
          animationFrameIdRef.current = requestAnimationFrame(tick);
          return true;
        }
        return currentIsLoaded;
      });
    }, 2500);

    function handleImageLoad() {
      loaded++;
      setLoadedCount(loaded);
      if (loaded === totalFrames) {
        imagesRef.current = preloadedImages;
        setTimeout(() => {
          setIsLoaded(true);
          resizeCanvas();
          animationFrameIdRef.current = requestAnimationFrame(tick);
        }, 400);
      }
    }

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = () => {
        console.error(`Failed to load frame ${i}`);
        handleImageLoad();
      };
      img.src = getFramePath(i);
      preloadedImages.push(img);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      clearTimeout(safetyTimeout);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  const progressPercent = (loadedCount / totalFrames) * 100;

  return (
    <>
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
          backgroundColor: '#030712',
        }}
      />

      {/* Preloader Screen */}
      {!isLoaded && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(3, 7, 18, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            transition: 'opacity 0.8s ease',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '320px' }}>
            {/* Spinner */}
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '3px solid rgba(255, 255, 255, 0.05)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                marginBottom: '24px',
              }}
            />
            {/* Text */}
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Caching Command Center...
            </div>
            {/* Progress Bar Background */}
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '99px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  borderRadius: '99px',
                  width: `${progressPercent}%`,
                  transition: 'width 0.15s cubic-bezier(0.1, 0.8, 0.1, 1)',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                }}
              />
            </div>
          </div>

          {/* Inject keyframes dynamically for the spinner */}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
