// src/components/Canvas.tsx
import { Component, createSignal, onMount, createEffect } from 'solid-js';
import {Layer, TextLayer, ImageLayer, useProjectStore} from '../store/store';

const Canvas: Component = () => {
    const store = useProjectStore();
    let canvasRef: HTMLCanvasElement | undefined;
    let backgroundCanvasRef: HTMLCanvasElement | undefined;
    const [isDrawing, setIsDrawing] = createSignal(false);
    const [ctx, setCtx] = createSignal<CanvasRenderingContext2D | null>(null);
    const [bgCtx, setBgCtx] = createSignal<CanvasRenderingContext2D | null>(null);

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
        }
    };

    // Re-render when layers change
    createEffect(() => {
        const layers = store.project.layers;
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

    return (
        <div class="w-full h-full bg-gray-50 overflow-hidden relative">
            {/* Background canvas for drawing */}
            <canvas
                ref={backgroundCanvasRef}
                class="absolute top-0 left-0 border border-gray-200 bg-white shadow-sm"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
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