// mouseHandlers.ts
import { ProjectStore, Layer, Position, Dimension } from '../../store/store';
import { calculateViewportTransform } from '../calculate_viewport_transform';

export type MouseState = {
  isDragging: boolean;
  dragStart: Position | null;
};

function transformCoordinates(
  x: number,
  y: number,
  projectDimension: Dimension,
  canvasDimension: Dimension
) {
  const { scale, translateX, translateY } = calculateViewportTransform(
    projectDimension,
    canvasDimension
  );

  // Transform from screen coordinates to canvas coordinates
  const transformedX = (x - translateX) / scale;
  const transformedY = (y - translateY) / scale;

  return { x: transformedX, y: transformedY };
}

export function setupMouseHandlers({
  canvasRef,
  projectStore,
  mouseState,
}: {
  canvasRef: HTMLCanvasElement;
  projectStore: ProjectStore;
  mouseState: MouseState;
}) {
  const getLayerAtPosition = (
    screenX: number,
    screenY: number
  ): Layer | null => {
    // Transform the coordinates
    const { x, y } = transformCoordinates(
      screenX,
      screenY,
      projectStore.project.dimension,
      projectStore.canvas
    );

    console.log('transformed coordinates', {
      x,
      y,
      screenX,
      screenY,
      projectStoreProjectDimension: projectStore.project.dimension,
      projectStoreCanvas: projectStore.canvas,
    });

    // Use transformed coordinates to check layers
    for (let i = projectStore.project.layers.length - 1; i >= 0; i--) {
      const layer = projectStore.project.layers[i];
      if (
        x >= layer.position.left &&
        x <= layer.position.left + layer.dimension.width &&
        y >= layer.position.top &&
        y <= layer.position.top + layer.dimension.height
      ) {
        return layer;
      }
    }
    return null;
  };

  const handleMouseDown = (e: MouseEvent) => {
    console.log('handle mouse down');

    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedLayer = getLayerAtPosition(x, y);

    if (clickedLayer) {
      projectStore.selectLayer(clickedLayer.id);
      mouseState.isDragging = true;
      mouseState.dragStart = { left: x, top: y };
    } else {
      projectStore.selectLayer(null);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (
      !mouseState.isDragging ||
      !mouseState.dragStart ||
      !projectStore.selectedLayer
    )
      return;

    const rect = canvasRef.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Transform both current and start positions
    const { scale } = calculateViewportTransform(
      projectStore.project.dimension,
      {
        width: canvasRef.width,
        height: canvasRef.height,
      }
    );

    // Scale the delta by the current transform scale
    const deltaX = (currentX - mouseState.dragStart.left) / scale;
    const deltaY = (currentY - mouseState.dragStart.top) / scale;

    const newPosition = {
      left: projectStore.selectedLayer.position.left + deltaX,
      top: projectStore.selectedLayer.position.top + deltaY,
    };

    projectStore.updateLayerPosition(
      projectStore.selectedLayer.id,
      newPosition
    );
    mouseState.dragStart = { left: currentX, top: currentY };
  };

  const handleMouseUp = () => {
    mouseState.isDragging = false;
    mouseState.dragStart = null;
  };

  console.log('setting up mouse handlers ', canvasRef);

  // Set up event listeners
  canvasRef.addEventListener('mousedown', handleMouseDown);
  canvasRef.addEventListener('mousemove', handleMouseMove);
  canvasRef.addEventListener('mouseup', handleMouseUp);
  canvasRef.addEventListener('mouseleave', handleMouseUp);

  // Return cleanup function
  return () => {
    console.log('cleaning up mouse handlers');
    canvasRef.removeEventListener('mousedown', handleMouseDown);
    canvasRef.removeEventListener('mousemove', handleMouseMove);
    canvasRef.removeEventListener('mouseup', handleMouseUp);
    canvasRef.removeEventListener('mouseleave', handleMouseUp);
  };
}
