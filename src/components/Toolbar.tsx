// src/components/Toolbar.tsx
import { Component, createSignal } from 'solid-js';

const Toolbar: Component = () => {
    const [selectedTool, setSelectedTool] = createSignal('pencil');
    const [brushColor, setBrushColor] = createSignal('#000000');

    const tools = [
        { name: 'pencil', icon: '✏️' },
        { name: 'brush', icon: '🖌️' },
        { name: 'eraser', icon: '❌' },
        { name: 'rectangle', icon: '▭' },
        { name: 'circle', icon: '⭕' }
    ];

    return (
        <div class="flex items-center justify-between p-2 bg-gray-100 border-b">
            <div class="flex space-x-2">
                {tools.map((tool) => (
                    <button
                        class={`p-2 ${selectedTool() === tool.name ? 'bg-blue-200' : 'bg-gray-200'}`}
                        onClick={() => setSelectedTool(tool.name)}
                    >
                        {tool.icon}
                    </button>
                ))}
            </div>
            <div>
                <input
                    type="color"
                    value={brushColor()}
                    onChange={(e) => setBrushColor(e.currentTarget.value)}
                />
            </div>
        </div>
    );
};

export default Toolbar;