// src/components/Canvas.tsx
import { Component, createSignal, onMount } from 'solid-js';

const Canvas: Component = () => {
    let canvasRef: HTMLCanvasElement | undefined;
    const [isDrawing, setIsDrawing] = createSignal(false);

    const startDrawing = (e: MouseEvent) => {
        if (!canvasRef) return;
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (e: MouseEvent) => {
        if (!isDrawing() || !canvasRef) return;

        const ctx = canvasRef.getContext('2d');
        if (!ctx) return;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        ctx.lineTo(e.clientX - canvasRef.offsetLeft, e.clientY - canvasRef.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvasRef.offsetLeft, e.clientY - canvasRef.offsetTop);
    };

    onMount(() => {
        if (canvasRef) {
            canvasRef.width = window.innerWidth;
            canvasRef.height = window.innerHeight - 100; // Account for toolbar and status bar
        }
    });

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            class="absolute inset-0 bg-white"
        />
    );
};

export default Canvas;