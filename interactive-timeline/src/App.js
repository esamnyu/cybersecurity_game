import React from 'react';
import './App.css';
import InteractiveTimeline from './InteractiveTimeline';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Interactive Timeline</h1>
      </header>
      <main>
        <InteractiveTimeline />
      </main>
    </div>
  );
}

export default App;