// src/App.tsx
import { Component } from 'solid-js';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import StatusBar from './components/StatusBar';

const App: Component = () => {
  return (
      <div class="flex flex-col h-screen">
        <Toolbar />
        <div class="flex-grow relative">
          <Canvas />
        </div>
        <StatusBar />
      </div>
  );
};

export default App;