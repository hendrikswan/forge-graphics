// src/components/Canvas.tsx
import { Component, createSignal, onMount, createEffect } from 'solid-js';
import {Layer, TextLayer, ImageLayer, useProjectStore, Position} from '../store/store';

const Canvas: Component = () => {
    const store = useProjectStore();
    let canvasRef: HTMLCanvasElement | undefined;
    let backgroundCanvasRef: HTMLCanvasElement | undefined;
    const [isDrawing, setIsDrawing] = createSignal(false);
    const [ctx, setCtx] = createSignal<CanvasRenderingContext2D | null>(null);
    const [bgCtx, setBgCtx] = createSignal<CanvasRenderingContext2D | null>(null);
    const [isDragging, setIsDragging] = createSignal(false);
    const [dragStart, setDragStart] = createSignal<Position | null>(null);

    // Initialize canvases
    onMount(() => {
        if (!canvasRef || !backgroundCanvasRef) return;

        const context = canvasRef.getContext('2d');
        const bgContext = backgroundCanvasRef.getContext('2d');
        setCtx(context);
        setBgCtx(bgContext);

        const resizeCanvas = () => {
            if (!canvasRef || !backgroundCanvasRef) return;
            const container = canvasRef.parentElement;
            if (!container) return;

            const { width, height } = store.project.canvas;
            canvasRef.width = width;
            canvasRef.height = height;
            backgroundCanvasRef.width = width;
            backgroundCanvasRef.height = height;

            renderLayers(); // Re-render layers after resize
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    });

    // Render functions for different layer types
    const renderTextLayer = (ctx: CanvasRenderingContext2D, layer: TextLayer) => {
        ctx.save();

        // Apply transformations
        ctx.translate(layer.position.left + layer.dimension.width / 2,
            layer.position.top + layer.dimension.height / 2);
        ctx.rotate((layer.rotation * Math.PI) / 180);

        // Set text properties
        ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw text
        ctx.fillText(layer.text, 0, 0);

        ctx.restore();
    };

    const renderImageLayer = async (ctx: CanvasRenderingContext2D, layer: ImageLayer) => {
        const image = new Image();
        image.src = layer.imageSrc;

        await new Promise((resolve) => {
            image.onload = resolve;
        });

        ctx.save();

        // Apply transformations
        ctx.translate(layer.position.left + layer.dimension.width / 2,
            layer.position.top + layer.dimension.height / 2);
        ctx.rotate((layer.rotation * Math.PI) / 180);

        // Draw image
        ctx.drawImage(image,
            -layer.dimension.width / 2,
            -layer.dimension.height / 2,
            layer.dimension.width,
            layer.dimension.height
        );

        ctx.restore();
    };

    const renderLayers = async () => {
        console.log('rendering layers')
        const context = ctx();
        if (!context) return;

        // Clear canvas
        context.clearRect(0, 0, canvasRef!.width, canvasRef!.height);

        // Render each layer
        for (const layer of store.project.layers) {
            if (layer.type === 'text') {
                renderTextLayer(context, layer);
            } else if (layer.type === 'image') {
                await renderImageLayer(context, layer);
            }

            // Draw selection border if layer is selected
            if (layer.id === store.selectedLayerId) {
                console.log('found selected layer' , layer.id);
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
    };

    // Re-render when layers change
    createEffect(() => {
        console.log('layers changed');
        const layers = store.project.layers;
        const selectedId = store.selectedLayerId;
        renderLayers();
    });

    // Handle drawing operations
    const getCanvasCoordinates = (e: MouseEvent) => {
        const rect = canvasRef!.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = (e: MouseEvent) => {
        if (!canvasRef) return;
        setIsDrawing(true);
        const context = bgCtx();
        if (!context) return;

        const { x, y } = getCanvasCoordinates(e);
        context.beginPath();
        context.moveTo(x, y);
    };

    const draw = (e: MouseEvent) => {
        if (!isDrawing() || !canvasRef) return;
        const context = bgCtx();
        if (!context) return;

        const { x, y } = getCanvasCoordinates(e);
        context.lineTo(x, y);
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const context = bgCtx();
        if (!context) return;
        context.beginPath();
    };

    const getLayerAtPosition = (x: number, y: number): Layer | null => {
        // Iterate layers in reverse to check top layers first
        for (let i = store.project.layers.length - 1; i >= 0; i--) {
            const layer = store.project.layers[i];
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
        if (!canvasRef) return;
        const rect = canvasRef.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedLayer = getLayerAtPosition(x, y);

        if (clickedLayer) {
            store.selectLayer(clickedLayer.id);
            setIsDragging(true);
            setDragStart({ left: x, top: y });
        } else {
            store.selectLayer(null);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging() || !dragStart() || !store.selectedLayer) return;

        const rect = canvasRef!.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const deltaX = currentX - dragStart()!.left;
        const deltaY = currentY - dragStart()!.top;

        const newPosition = {
            left: store.selectedLayer.position.left + deltaX,
            top: store.selectedLayer.position.top + deltaY
        };

        store.updateLayerPosition(store.selectedLayer.id, newPosition);
        setDragStart({ left: currentX, top: currentY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
    };

    return (
        <div class="w-full h-full bg-gray-50 overflow-hidden relative">
            {/* Background canvas for drawing */}
            <canvas
                ref={backgroundCanvasRef}
                class="absolute top-0 left-0 border border-gray-200 bg-white shadow-sm"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            {/* Main canvas for layers */}
            <canvas
                ref={canvasRef}
                class="absolute top-0 left-0 pointer-events-none"
            />
        </div>
    );
};

export default Canvas;