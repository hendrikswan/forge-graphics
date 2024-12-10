// src/components/StatusBar.tsx
import { Component } from 'solid-js';

const StatusBar: Component = () => {
  return (
    <footer class="h-6 bg-editor-toolbar border-t border-gray-200 px-4 flex items-center justify-between text-xs text-gray-600">
      <div class="flex items-center space-x-4">
        <span>Tool: Pencil</span>
        <span>Size: 2px</span>
        <span>Color: #000000</span>
      </div>
      <div class="flex items-center space-x-4">
        <span>Zoom: 100%</span>
        <span>Canvas: 1920 × 1080px</span>
      </div>
    </footer>
  );
};

export default StatusBar;
