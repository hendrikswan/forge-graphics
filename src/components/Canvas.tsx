// src/components/Canvas.tsx
import {Component, createSignal, onMount, createEffect} from 'solid-js';
import {Layer, TextLayer, ImageLayer, useProjectStore, Position} from '../store/store';
import {render} from "../render/render";

const Canvas: Component = () => {
    const store = useProjectStore();
    let canvasRef: HTMLCanvasElement | undefined;
    const [ctx, setCtx] = createSignal<CanvasRenderingContext2D | null>(null);
    const [isDragging, setIsDragging] = createSignal(false);
    const [dragStart, setDragStart] = createSignal<Position | null>(null);


    // Initialize canvases
    onMount(() => {
        if (!canvasRef) return;

        const context = canvasRef.getContext('2d');
        setCtx(context);

        render({
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
                height: container.clientHeight
            })
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            // if (animationFrameId) {
            //     cancelAnimationFrame(animationFrameId);
            // }
        };
    });


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
            setDragStart({left: x, top: y});
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
        setDragStart({left: currentX, top: currentY});
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
    };

    return (
        <div class="w-full h-full bg-gray-100 overflow-hidden relative">
            {/* Main canvas for layers */}
            <canvas
                ref={canvasRef}
                class="absolute top-0 left-0 pointer-events-none"
            />
        </div>
    );
};

export default Canvas;