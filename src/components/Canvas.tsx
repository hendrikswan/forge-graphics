// src/components/Canvas.tsx
import { Component, createSignal, onMount } from 'solid-js';

const Canvas: Component = () => {
    let canvasRef: HTMLCanvasElement | undefined;
    const [isDrawing, setIsDrawing] = createSignal(false);

    onMount(() => {
        if (!canvasRef) return;

        const resizeCanvas = () => {
            if (!canvasRef) return;
            const container = canvasRef.parentElement;
            if (!container) return;

            canvasRef.width = container.clientWidth;
            canvasRef.height = container.clientHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    });

    const startDrawing = (e: MouseEvent) => {
        if (!canvasRef) return;
        setIsDrawing(true);
        const ctx = canvasRef.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        const rect = canvasRef.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: MouseEvent) => {
        if (!isDrawing() || !canvasRef) return;
        const ctx = canvasRef.getContext('2d');
        if (!ctx) return;

        const rect = canvasRef.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!canvasRef) return;
        setIsDrawing(false);
        const ctx = canvasRef.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
    };

    return (
        <div class="w-full h-full bg-gray-50 overflow-hidden">
            <canvas
                ref={canvasRef}
                class="border border-gray-200 bg-white shadow-sm"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
        </div>
    );
};

export default Canvas;