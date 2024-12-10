// src/components/Toolbar.tsx
import { Component, createSignal } from 'solid-js';

const Toolbar: Component = () => {
  const [selectedTool, setSelectedTool] = createSignal('pencil');
  const [brushColor, setBrushColor] = createSignal('#000000');

  const tools = [
    { id: 'pencil', name: 'Pencil', icon: '✏️' },
    { id: 'brush', name: 'Brush', icon: '🖌️' },
    { id: 'eraser', name: 'Eraser', icon: '⌫' },
    { id: 'rectangle', name: 'Rectangle', icon: '▢' },
    { id: 'circle', name: 'Circle', icon: '○' },
    { id: 'text', name: 'Text', icon: 'T' },
  ];

  return (
    <header class="border-b border-gray-200 bg-editor-toolbar shadow-sm">
      <div class="max-w-screen-2xl mx-auto">
        <div class="flex items-center h-14 px-4">
          {/* Logo */}
          <div class="flex items-center mr-8">
            <span class="text-xl font-semibold text-editor-accent">Forge</span>
          </div>

          {/* File Operations */}
          <div class="flex space-x-2 mr-8">
            <button class="icon-button">New</button>
            <button class="icon-button">Open</button>
            <button class="icon-button">Save</button>
          </div>

          {/* Separator */}
          <div class="h-6 w-px bg-gray-200 mx-4" />

          {/* Tools */}
          <div class="flex space-x-1">
            {tools.map(tool => (
              <button
                title={tool.name}
                class={`tool-button ${selectedTool() === tool.id ? 'tool-button-active' : ''}`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <span class="text-lg">{tool.icon}</span>
              </button>
            ))}
          </div>

          {/* Color Picker */}
          <div class="ml-4 flex items-center space-x-2">
            <input
              type="color"
              value={brushColor()}
              onChange={e => setBrushColor(e.currentTarget.value)}
              class="w-8 h-8 rounded cursor-pointer"
            />
            <span class="text-sm text-gray-600">{brushColor()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
