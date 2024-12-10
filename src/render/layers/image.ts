import {ImageLayer, ProjectStore} from "../../store/store";

// const imageCache: { [key: string]: HTMLImageElement } = {};

export function renderImageLayer(ctx: CanvasRenderingContext2D, layer: ImageLayer, image: HTMLImageElement) {
    // const image = imageCache[layer.imageSrc];
    // if (!image) {
    //     loadImage(layer.imageSrc);
    //     return;
    // }

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
}

export async function loadImage(src: string, projectStore: ProjectStore) {
    if (projectStore.assets[src]) {
        return;
    }

    const image = new Image();
    image.src = src;
    await new Promise((resolve) => {
        image.onload = resolve;
    });

    projectStore.setImageInCache(src, image);
}