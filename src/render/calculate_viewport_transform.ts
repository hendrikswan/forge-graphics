import { Dimension } from '../store/store';

export function calculateViewportTransform(
  projectDimension: Dimension,
  canvasDimension: Dimension
) {
  const PADDING = 10; // 5px padding

  // Adjust canvas dimensions to account for padding
  const availableWidth = canvasDimension.width - PADDING * 2;
  const availableHeight = canvasDimension.height - PADDING * 2;

  // Calculate scale with padding-adjusted dimensions
  const scaleX = availableWidth / projectDimension.width;
  const scaleY = availableHeight / projectDimension.height;

  const scale = Math.min(scaleX, scaleY, 1); // Never scale up

  // Center with padding included
  const translateX =
    (canvasDimension.width - projectDimension.width * scale) / 2;
  const translateY =
    (canvasDimension.height - projectDimension.height * scale) / 2;

  return {
    scale,
    translateX,
    translateY,
  };
}
