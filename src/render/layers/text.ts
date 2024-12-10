import { TextLayer } from '../../store/store';

export function renderTextLayer(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer
) {
  ctx.save();

  // Apply transformations
  ctx.translate(
    layer.position.left + layer.dimension.width / 2,
    layer.position.top + layer.dimension.height / 2
  );
  ctx.rotate((layer.rotation * Math.PI) / 180);

  // Set text properties
  ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
  ctx.fillStyle = layer.fontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw text
  ctx.fillText(layer.text, 0, 0);

  ctx.restore();
}
