import { Component } from 'solid-js';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import StatusBar from './components/StatusBar';
import SideBar from './components/SideBar';

const App: Component = () => {
  return (
    <div class="flex flex-col h-screen bg-editor-background">
      <Toolbar />
      <div class="flex flex-1 overflow-hidden">
        <SideBar />
        <main class="flex-1 relative">
          <Canvas />
        </main>
      </div>
      <StatusBar />
    </div>
  );
};

export default App;
