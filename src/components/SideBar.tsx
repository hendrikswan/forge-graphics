import { Component } from 'solid-js';
import type { Component as SolidComponent } from 'solid-js';
import {useProjectStore} from "../store/store";
import logo from '../logo.svg';



const IconButton: SolidComponent<{
    icon: string;
    label: string;
    onClick: () => void;
}> = (props) => {
    return (
        <button
            onClick={props.onClick}
            class="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            title={props.label}
        >
            <span class="text-xl">{props.icon}</span>
        </button>
    );
};

const SideBar: Component = () => {
    const store = useProjectStore();
    const handleAddText = () => {
        store.addTextLayer(
            'New Text',
            { top: 100, left: 100 },
            { width: 200, height: 50 }
        );
    };

    const handleAddImage = () => {
        store.addImageLayer(
            logo,
            { top: 100, left: 100 },
            { width: 200, height: 200 }
        );
    };

    return (
        <aside class="w-16 border-r border-gray-200 bg-white flex flex-col items-center py-4 space-y-2">
            <IconButton
                icon="T"
                label="Add Text"
                onClick={handleAddText}
            />
            <IconButton
                icon="🖼️"
                label="Add Image"
                onClick={handleAddImage}
            />
        </aside>
    );
};

export default SideBar;