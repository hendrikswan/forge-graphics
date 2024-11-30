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
    canvas: Dimension;
}

type ProjectStore = {
    project: Project;
    selectedLayerId: string | null;
};

// Utility functions for generating new layers
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


const [store, setStore] = createStore<ProjectStore>({
    project: {
        layers: [],
        canvas: { width: 800, height: 600 }
    },
    selectedLayerId: null
});

export const projectStore = {
    // Getters
    get project() { return store.project; },
    get selectedLayerId() { return store.selectedLayerId; },
    get selectedLayer() {
        return store.project.layers.find(layer => layer.id === store.selectedLayerId);
    },

    // Layer Management
    addImageLayer(imageSrc: string, position?: Position, dimension?: Dimension) {
        setStore('project', 'layers', produce(layers => {
            layers.push(createImageLayer(imageSrc, position, dimension));
        }));
    },

    addTextLayer(text: string, position?: Position, dimension?: Dimension) {
        setStore('project', 'layers', produce(layers => {
            layers.push(createTextLayer(text, position, dimension));
        }));
    },

    removeLayer(layerId: string) {
        setStore('project', 'layers', layers =>
            layers.filter(layer => layer.id !== layerId)
        );
        if (store.selectedLayerId === layerId) {
            setStore('selectedLayerId', null);
        }
    },

    selectLayer(id: string | null) {
        setStore('selectedLayerId', id);
    },

    updateLayerPosition(id: string, position: Partial<Position>) {
        setStore('project', 'layers', layers =>
            layers.map(layer =>
                layer.id === id
                    ? { ...layer, position: { ...layer.position, ...position } }
                    : layer
            )
        );
    }
};

// Create a reactive hook to use the store in components
export function useProjectStore() {
    return projectStore;
}