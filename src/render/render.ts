import {createEffect, Signal} from "solid-js";
import {Project, ProjectStore} from "../store/store";
import {renderTextLayer} from "./layers/text";
import {renderImageLayer} from "./layers/image";


const imageCache: { [key: string]: HTMLImageElement } = {};

export function render(
    { projectStore, canvasRef, ctx } :
    { projectStore: ProjectStore; canvasRef: HTMLCanvasElement; ctx: () => CanvasRenderingContext2D | null}) {
    let animationFrameId: number;
    createEffect(() => {
        // Access the store to create dependency
        const currentState = projectStore.project;
        // Deep clone to prevent mutation of snapshot
        const snapshot = JSON.parse(JSON.stringify(currentState));

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(async () => {
            const context = ctx();
            if (!context) return;

            console.log('rendering layers')
            if (!context) return;

            // Clear canvas
            context.clearRect(0, 0, canvasRef!.width, canvasRef!.height);

            // Render each layer
            for (const layer of projectStore.project.layers) {
                if (layer.type === 'text') {
                    renderTextLayer(context, layer);
                } else if (layer.type === 'image') {
                    renderImageLayer(context, layer);
                }

                // Draw selection border if layer is selected
                if (layer.id === projectStore.selectedLayerId) {
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
        });
    });
}
//
// // Example usage:
// let lastState: Project | null = null;
//
// trackStoreChanges((snapshot) => {
//     // Skip initial state
//     if (lastState === null) {
//         lastState = snapshot;
//         return;
//     }
//
//     // Do something with the new state
//     console.log('State changed:', snapshot);
//     // Compare with previous state
//     console.log('Changes:', diffStates(lastState, snapshot));
//
//     lastState = snapshot;
// });
//
// // Helper to find what changed between states
// function diffStates(prev: Project, next: Project) {
//     const changes = {
//         layersAdded: next.layers.filter(l => !prev.layers.find(pl => pl.id === l.id)),
//         layersRemoved: prev.layers.filter(l => !next.layers.find(nl => nl.id === l.id)),
//         layersModified: next.layers.filter(l => {
//             const prevLayer = prev.layers.find(pl => pl.id === l.id);
//             return prevLayer && JSON.stringify(prevLayer) !== JSON.stringify(l);
//         })
//     };
//     return changes;
// }