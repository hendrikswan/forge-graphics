// src/components/StatusBar.tsx
import { Component } from 'solid-js';

const StatusBar: Component = () => {
    return (
        <div class="bg-gray-100 p-2 text-sm text-gray-600 border-t flex justify-between">
            <span>Forge Graphics</span>
            <span>Tools: Pencil | Color: Black</span>
            <span>Zoom: 100%</span>
        </div>
    );
};

export default StatusBar;