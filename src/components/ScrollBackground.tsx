import React, { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 300;

const getFrameUrl = (index: number): string => {
  const frameNumber = String(index + 1).padStart(3, '0');
  return `/frames/ezgif-frame-${frameNumber}.jpg`;
};

export const ScrollBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Helper to draw an image with object-fit: cover logic
  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;
    
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Find the exact image or nearest loaded fallback image
  const getLoadedImage = (index: number): HTMLImageElement | null => {
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
    if (loadedRef.current[clampedIndex] && imagesRef.current[clampedIndex]) {
      return imagesRef.current[clampedIndex];
    }

    // Search outwards for closest loaded frame to prevent gaps
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = clampedIndex - offset;
      if (prev >= 0 && loadedRef.current[prev] && imagesRef.current[prev]) {
        return imagesRef.current[prev];
      }
      const next = clampedIndex + offset;
      if (next < TOTAL_FRAMES && loadedRef.current[next] && imagesRef.current[next]) {
        return imagesRef.current[next];
      }
    }

    return null;
  };

  // Render a specific frame index to canvas
  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getLoadedImage(frameIndex);
    if (img) {
      drawImageCover(ctx, img, canvas.width, canvas.height);
    }
  };

  // Resize canvas according to viewport & DPR
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    renderFrame(Math.round(currentFrameRef.current));
  };

  // Synchronize scroll position with frame target index
  const updateTargetFrameFromScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
    targetFrameRef.current = targetIndex;
  };

  useEffect(() => {
    // 1. Initial Canvas sizing
    handleResize();
    window.addEventListener('resize', handleResize);

    // 2. Load frame image helper
    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve(imagesRef.current[index]!);
          return;
        }

        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          imagesRef.current[index] = img;
          loadedRef.current[index] = true;
          // Re-render if this loaded frame is current or close to current
          if (Math.abs(Math.round(currentFrameRef.current) - index) <= 2) {
            renderFrame(Math.round(currentFrameRef.current));
          }
          resolve(img);
        };
        img.onerror = () => {
          // If error, mark loaded so fallback search moves on
          loadedRef.current[index] = false;
          resolve(img);
        };
      });
    };

    // 3. Intelligent Preloading Strategy
    // Phase A: Preload frame 0 immediately and render hero scene
    loadFrame(0).then(() => {
      renderFrame(0);
    });

    // Phase B: Preload initial burst (0-29) & keyframes across sequence
    const priorityIndices: number[] = [];
    for (let i = 0; i < 30; i++) priorityIndices.push(i);
    for (let i = 30; i < TOTAL_FRAMES; i += 5) priorityIndices.push(i);

    priorityIndices.forEach((idx) => {
      loadFrame(idx);
    });

    // Phase C: Background queue all remaining frames in chunks
    let remainingIndex = 0;
    const loadNextBatch = () => {
      const batchSize = 10;
      let count = 0;
      while (remainingIndex < TOTAL_FRAMES && count < batchSize) {
        if (!imagesRef.current[remainingIndex]) {
          loadFrame(remainingIndex);
        }
        remainingIndex++;
        count++;
      }
      if (remainingIndex < TOTAL_FRAMES) {
        setTimeout(loadNextBatch, 50);
      }
    };
    setTimeout(loadNextBatch, 100);

    // 4. Scroll Listener
    updateTargetFrameFromScroll();
    const onScroll = () => {
      updateTargetFrameFromScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // 5. Smooth Interpolation Animation Loop (Lerp)
    const animate = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        currentFrameRef.current += diff * 0.15; // Smooth camera lerp
        renderFrame(Math.round(currentFrameRef.current));
      }
      rafIdRef.current = requestAnimationFrame(animate);
    };
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Scroll-driven canvas background — no overlay, frames render at original brightness */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ width: '100vw', height: '100vh' }}
      />
    </>
  );
};

export default ScrollBackground;
