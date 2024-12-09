import { createStore, produce } from "solid-js/store";
import { createSignal } from "solid-js";

export type Dimension = {
    width: number;
    height: number;
}

export type Position = {
    top: number;
    left: number;
}

export type ImageLayer = {
    position: Position;
    dimension: Dimension;
    rotation: number;
    imageSrc: string;
    id: string;
    type: 'image';
}

export type TextLayer = {
    position: Position;
    dimension: Dimension;
    text: string;
    fontSize: number;
    fontColor: string;
    fontFamily: string;
    id: string;
    type: 'text';
    rotation: number;
}

export type Layer = ImageLayer | TextLayer;
export type LayerType = Layer['type'];

export type Project = {
    layers: Layer[];
    dimension: Dimension;
}

type ProjectEditSession = {
    project: Project;
    selectedLayerId: string | null;
    canvas: Dimension
};

// Utility functions remain the same
export const createImageLayer = (
    imageSrc: string,
    position: Position = {top: 0, left: 0},
    dimension: Dimension = {width: 100, height: 100}
): ImageLayer => ({
    id: crypto.randomUUID(),
    type: 'image',
    imageSrc,
    position,
    dimension,
    rotation: 0
});

export const createTextLayer = (
    text: string,
    position: Position = {top: 0, left: 0},
    dimension: Dimension = {width: 200, height: 50}
): TextLayer => ({
    id: crypto.randomUUID(),
    type: 'text',
    text,
    position,
    dimension,
    fontSize: 16,
    fontColor: '#000000',
    fontFamily: 'Arial',
    rotation: 0,
});

const [store, setStore] = createStore<ProjectEditSession>({
    project: {
        layers: [],
        dimension: { width: 800, height: 600 }
    },
    selectedLayerId: null,
    canvas: { width: 800, height: 600 }
});

const projectStore = {
    // Getters remain the same
    get project() { return store.project; },
    get canvas() { return store.canvas; },
    get selectedLayerId() { return store.selectedLayerId; },
    get selectedLayer() {
        return store.project.layers.find(layer => layer.id === store.selectedLayerId);
    },

    // Layer Management with produce
    addImageLayer(imageSrc: string, position?: Position, dimension?: Dimension) {
        setStore(produce(draft => {
            draft.project.layers.push(createImageLayer(imageSrc, position, dimension));
        }));
    },

    addTextLayer(text: string, position?: Position, dimension?: Dimension) {
        setStore(produce(draft => {
            draft.project.layers.push(createTextLayer(text, position, dimension));
        }));
    },

    removeLayer(layerId: string) {
        setStore(produce(draft => {
            draft.project.layers = draft.project.layers.filter(layer => layer.id !== layerId);
            if (draft.selectedLayerId === layerId) {
                draft.selectedLayerId = null;
            }
        }));
    },

    selectLayer(id: string | null) {
        setStore(produce(draft => {
            draft.selectedLayerId = id;
        }));
    },

    updateLayerPosition(id: string, position: Partial<Position>) {
        setStore(produce(draft => {
            const layer = draft.project.layers.find(l => l.id === id);
            if (layer) {
                layer.position = { ...layer.position, ...position };
            }
        }));
    },

    setCanvasDimension(dimension: Dimension) {
        setStore(produce(draft => {
            draft.canvas = dimension;
        }));
    }
};

export function useProjectStore() {
    return projectStore;
}

export type ProjectStore = ReturnType<typeof useProjectStore>;