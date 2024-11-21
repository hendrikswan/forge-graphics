// src/components/Sidebar.tsx
import { Component } from 'solid-js';

const SideBar: Component = () => {
    return (
        <aside class="w-64 border-r border-gray-200 bg-white">
            <div class="p-4">
                <h2 class="text-sm font-semibold text-gray-600 uppercase">Layers</h2>
                <div class="mt-4 space-y-2">
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span class="text-sm">Layer 1</span>
                        <button class="text-gray-400 hover:text-gray-600">👁️</button>
                    </div>
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span class="text-sm">Background</span>
                        <button class="text-gray-400 hover:text-gray-600">👁️</button>
                    </div>
                </div>
            </div>

            <div class="p-4 border-t border-gray-200">
                <h2 class="text-sm font-semibold text-gray-600 uppercase">Properties</h2>
                <div class="mt-4 space-y-3">
                    <div>
                        <label class="text-sm text-gray-600 block mb-1">Opacity</label>
                        <input type="range" class="w-full" min="0" max="100" value="100" />
                    </div>
                    <div>
                        <label class="text-sm text-gray-600 block mb-1">Brush Size</label>
                        <input type="range" class="w-full" min="1" max="50" value="5" />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;