// src/components/Canvas.tsx
import { Component, createSignal, onMount, createEffect } from 'solid-js';
import { useProjectStore } from '../store/store';
import { render } from '../render/render';

const Canvas: Component = () => {
  const store = useProjectStore();
  let canvasRef: HTMLCanvasElement | undefined;
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D | null>(null);

  // Initialize canvases
  onMount(() => {
    if (!canvasRef) return;

    const context = canvasRef.getContext('2d');
    setCtx(context);

    // Get the cleanup function from render
    const renderCleanup = render({
      projectStore: store,
      canvasRef,
      ctx,
    });

    const resizeCanvas = () => {
      if (!canvasRef) return;
      const container = canvasRef.parentElement;
      if (!container) return;

      // const {width, height} = store.project.canvas;
      canvasRef.width = container.clientWidth;
      canvasRef.height = container.clientHeight;

      store.setCanvasDimension({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Return a cleanup function that calls both cleanups
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      renderCleanup(); // Call the cleanup returned from render
    };
  });

  return (
    <div class="w-full h-full bg-gray-100 overflow-hidden relative">
      {/* Main canvas for layers */}
      <canvas ref={canvasRef} class="absolute top-0 left-0" />
    </div>
  );
};

export default Canvas;
