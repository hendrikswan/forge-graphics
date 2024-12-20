import { createEffect, Signal } from 'solid-js';
import { Dimension, Project, ProjectStore } from '../store/store';
import { renderTextLayer } from './layers/text';
import { loadImage, renderImageLayer } from './layers/image';
import {
  MouseState,
  setupMouseHandlers,
} from './interactivity/setup_mouse_handlers';
import { calculateViewportTransform } from './calculate_viewport_transform';

function setupCanvasTransform({
  ctx,
  projectDimension,
  canvasDimension,
}: {
  ctx: CanvasRenderingContext2D;
  projectDimension: Dimension;
  canvasDimension: Dimension;
}) {
  // Reset transform first
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const { scale, translateX, translateY } = calculateViewportTransform(
    projectDimension,
    canvasDimension
  );

  ctx.translate(translateX, translateY);
  ctx.scale(scale, scale);
}

// Modified drawing function
function drawBackground(
  ctx: CanvasRenderingContext2D,
  projectDimension: Dimension
) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, projectDimension.width, projectDimension.height);
}

function loadImages({ projectStore }: { projectStore: ProjectStore }) {
  for (const layer of projectStore.project.layers) {
    if (layer.type === 'image') {
      loadImage(layer.imageSrc, projectStore);
    }
  }
}

function renderLayers({
  projectStore,
  context,
}: {
  projectStore: ProjectStore;
  context: CanvasRenderingContext2D;
}) {
  for (const layer of projectStore.project.layers) {
    if (layer.type === 'text') {
      renderTextLayer(context, layer);
    } else if (layer.type === 'image') {
      const image = projectStore.assets[layer.imageSrc]?.image;
      if (image) {
        renderImageLayer(context, layer, image);
      }
    }

    // Draw selection border if layer is selected
    if (layer.id === projectStore.selectedLayerId) {
      console.log('found selected layer', layer.id);
      context.save();
      context.strokeStyle = '#0066ff';
      context.lineWidth = 2;
      context.setLineDash([5, 5]);
      context.strokeRect(
        layer.position.left,
        layer.position.top,
        layer.dimension.width,
        layer.dimension.height
      );
      context.restore();
    }
  }
}

export function renderImpl({
  projectStore,
  context,
  canvasDimension,
}: {
  projectStore: ProjectStore;
  context: CanvasRenderingContext2D;
  canvasDimension: Dimension;
}) {
  console.log('in requestAnimationFrame');
  console.log('rendering layers');

  loadImages({ projectStore });

  // Clear canvas
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvasDimension.width, canvasDimension.height);

  // context.translate(projectStore.canvas.width / 2, projectStore.canvas.height / 2);

  setupCanvasTransform({
    ctx: context,
    projectDimension: projectStore.project.dimension,
    canvasDimension,
  });

  drawBackground(context, projectStore.project.dimension);

  renderLayers({
    projectStore,
    context,
  });
}

export function render({
  projectStore,
  canvasRef,
  ctx,
}: {
  projectStore: ProjectStore;
  canvasRef: HTMLCanvasElement;
  ctx: () => CanvasRenderingContext2D | null;
}) {
  let animationFrameId: number;
  let initializedTranslation = false;

  // Create mouse state
  const mouseState: MouseState = {
    isDragging: false,
    dragStart: null,
  };

  // Set up mouse handlers
  const mouseCleanup = setupMouseHandlers({
    canvasRef,
    projectStore,
    mouseState,
  });

  createEffect(() => {
    // Access the store to create dependency
    const currentState = projectStore.project;
    const canvasDimension = projectStore.canvas;
    // Deep clone to prevent mutation of snapshot
    // const snapshot = JSON.parse(JSON.stringify(currentState));

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    const context = ctx();
    if (!context) return;

    if (!initializedTranslation) {
      context.translate(
        projectStore.project.dimension.width / 2,
        projectStore.project.dimension.height / 4
      );
      initializedTranslation = true;
    }

    renderImpl({ projectStore, context, canvasDimension });

    animationFrameId = requestAnimationFrame(async () => {
      renderImpl({ projectStore, context, canvasDimension });
    });
  });

  // Return combined cleanup
  return () => {
    mouseCleanup();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
